import {useEffect, useState} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {Form, Button} from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import {toast} from "react-toastify";
import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation
} from "../../slices/productsApiSlice";

function ProductEditScreen() {
    const {id: productId} = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');


    const {data: product, isLoading, error} = useGetProductDetailsQuery(productId);
    const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation();
    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCountInStock(product.countInStock);
            setDescription(product.description);
            setCategory(product.category);
        }
    }, [product]);


    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            countInStock,
            description,
            category
        }

        const result = await updateProduct(updatedProduct);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Product Updated Successfully');
            navigate('/admin/productlist');
        }
    }

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader/>}
                {isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={onSubmitHandler}>

                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId='price' className='my-2'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='price'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value)
                                }}
                            />

                        </Form.Group>


                        <Form.Group controlId='image' className='my-2'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Add image Ur'
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value)
                                }}
                            />
                            <Form.Control
                                label='Choose File'
                                onChange={uploadFileHandler}
                                type='file'
                           />

                        </Form.Group>
                        {loadingUpload && <Loader/>}

                        <Form.Group controlId='brand' className='my-2'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type='brand'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => {
                                    setBrand(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId='countInStock' className='my-2'>
                            <Form.Label>CountInStock</Form.Label>
                            <Form.Control
                                type='countInStock'
                                placeholder='Enter countInStock'
                                value={countInStock}
                                onChange={(e) => {
                                    setCountInStock(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId='category' className='my-2'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='category'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId='description' className='my-2'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='description'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                            />
                        </Form.Group>


                        <Button type='submit' variant='primary' className='my-2'>Update</Button>
                    </Form>
                )}
                {error && <Message variant=''>{error}</Message>}
                <Form onSubmit={onSubmitHandler}/>
            </FormContainer>
        </>
    );
}


export default ProductEditScreen;