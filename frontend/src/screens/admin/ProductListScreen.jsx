import React from 'react';
import {LinkContainer} from "react-router-bootstrap";
import {Table, Row, Button, Col} from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {FaEdit, FaTrash} from "react-icons/fa";
import {useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation} from "../../slices/productsApiSlice";
import {toast} from "react-toastify";
import {useParams} from "react-router";
import Paginate from "../../components/Paginate";

function ProductListScreen(props) {
    const {pageNumber} = useParams();
    const {isLoading, error, data, refetch} = useGetProductsQuery({pageNumber});
    const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation();
    const [createProduct, {isLoading: loadingCreate}] = useCreateProductMutation();

    const deleteHandler =async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteProduct(id);
                refetch();
                toast.success('Product deleted successfully')
            } catch (e) {
                toast.error(e?.data?.message || e.error)
            }
        }
    }

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                refetch();
            } catch (e) {
                toast(e?.data?.message || e.error)
            }
        }

    }

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-end'>
                    <Button
                        className="btn-sm m-3"
                        onClick={createProductHandler}
                    >Create Product</Button>
                </Col>
            </Row>

            {loadingDelete && <Loader/>}
            {loadingCreate && <Loader/>}
            {isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <Table striped hover responsive className='table-sm'>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>EDIT/DELETE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className="btn-sm">
                                            <FaEdit/>
                                        </Button>
                                    </LinkContainer>

                                    <Button
                                        variant='danger'
                                        className="btn-sm"
                                        onClick={() => deleteHandler(product._id)}
                                    >
                                        <FaTrash style={{color: 'white'}}/>
                                    </Button>

                                </td>
                            </tr>))}
                        </tbody>
                    </Table>
                    <Paginate   pages={data.pages} page={data.page} isAdmin={true}/>
                </>
            )}
        </>
    );
}

export default ProductListScreen;