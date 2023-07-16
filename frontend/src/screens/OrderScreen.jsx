import React, {useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {
    Row,
    Col,
    ListGroup,
    Image,
    Card,
    Button,
} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useDeliverOrderMutation
} from '../slices/orderApiSlice';
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {toast} from "react-toastify";


function OrderScreen(props) {
    const {id: orderId} = useParams();

    const {
        data: order,
        refetch,
        isLoading,
        error
    } = useGetOrderDetailsQuery(orderId);

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();

    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

    const {data: paypal, isLoading: loadingPayPal, error: errorPaypal} = useGetPaypalClientIdQuery();

    const {userInfo} = useSelector(state => state.auth)

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();


    const onApprove = async (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({orderId, details})
                refetch();
                toast.success('Payment successful')
            } catch (e) {
                toast.error(e?.data?.message || e.error);
            }
        })
    }


    // const onApproveTest = async () => {
    //     await payOrder({orderId, details: {payer: {}}})
    //     refetch();
    //     toast.success('Payment successful')
    // }

    const onError = (err) => {
        toast.error(err.message)
    }
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice
                    }
                }]
        }).then((orderID) => orderID)
    }
    useEffect(() => {
        if (!errorPaypal && !loadingPayPal && paypal.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPaypalScript()
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPaypal]);


    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId)
            refetch();
            toast.success('Order delivered')
        } catch (e) {
            toast.error(e?.data?.message || e.error);
        }
    }

    return isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong>{order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{order.user.email}
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address},
                                {order.shippingAddress.city},
                                {order.shippingAddress.postalCode},
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message
                                    variant='success'
                                >
                                    Deliverred on {order.deliveredAt}
                                </Message>
                            ) : (<Message variant='danger'>
                                Not Delivered
                            </Message>)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message
                                    variant='success'
                                >
                                    Paid on {order.paidAt}
                                </Message>
                            ) : (<Message variant='danger'>
                                Not Paid
                            </Message>)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>

                            {order.orderItems.map((item, index) => (<ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                    </Col>
                                    <Col>
                                        <Link to={`/products/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                    </Col>
                                </Row>
                            </ListGroup.Item>))}


                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Items: </Col>
                                    <Col> ${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Shipping: </Col>
                                    <Col> ${order.shippingPrice}</Col>

                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Tax: </Col>
                                    <Col> ${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Total: </Col>
                                    <Col> ${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader/>}
                                    {isPending ? (<Loader/>) : (
                                        <div>
                                            {/*<Button*/}
                                            {/*    onClick={onApproveTest}*/}
                                            {/*    className='mb-2'*/}
                                            {/*>Test Pay Order</Button>*/}

                                            <PayPalButtons
                                                style={{layout: 'horizontal'}}
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            />
                                        </div>)}
                                </ListGroup.Item>)}
                            {loadingDeliver && <Loader/>}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (<ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn btn-block'
                                    onClick={deliverOrderHandler}
                                >
                                    Mark as Delivered
                                </Button>
                            </ListGroup.Item>)}
                        </ListGroup>
                    </Card>

                </Col>
            </Row>
        </>)
}

export default OrderScreen;