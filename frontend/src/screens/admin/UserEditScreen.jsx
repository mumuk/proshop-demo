import {useEffect, useState} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {Form, Button} from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import {toast} from "react-toastify";
import {useGetUserDetailsQuery, useUpdateUserMutation} from "../../slices/usersApiSlice";

function UserEditScreen() {
    const {id: userId} = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const {data: user, refetch,isLoading, error} = useGetUserDetailsQuery(userId);
    const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation();


    useEffect(() => {
        console.log(user)
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);

        }
    }, [user]);


    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const updatedUser = {
            userId,
            name,
            email,
            isAdmin
        }

        try {
           await updateUser(updatedUser);
            toast.success('User updated successfully');
            refetch();
            navigate('/admin/userlist');
        } catch (e) {
            toast.error(e?.data?.message||e.error);
        }

    }


    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
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

                        <Form.Group controlId='email' className='my-2'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />

                        </Form.Group>


                        <Form.Group controlId='isAdmin' className='my-2'>
                            <Form.Label>Admin</Form.Label>
                            <Form.Check
                                type='checkbox'
                                label='Is Admin'
                                checked={isAdmin}
                                onChange={(e) => {
                                    setIsAdmin(e.target.checked)
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


export default UserEditScreen;