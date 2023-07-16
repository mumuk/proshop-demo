import React from 'react';
import {Navbar, Nav, Container, Badge, NavDropdown} from "react-bootstrap";
import {FaShoppingCart} from "react-icons/fa";
import logo from '../assets/logo.png';
import {LinkContainer} from "react-router-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import {useNavigate} from "react-router-dom";
import SearchBox from "./SearchBox";


function Header(props) {
    const {cartItems} = useSelector(state => state.cart)
    const {userInfo} = useSelector(state => state.auth);
    const [logoOutApiCall] = useLogoutMutation();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            await logoOutApiCall().unwrap()
            dispatch(logout())
            navigate('/login')
        } catch (e) {
            console.log(e?.data?.message || e.error);
        }
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>
                            <img src={logo} alt=""/>
                            ProShop</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <SearchBox/>
                            <LinkContainer to='/cart'>
                                <Nav.Link><FaShoppingCart/>Cart
                                    {cartItems.length > 0 && <Badge pill bg='success' style={{marginLeft: '5px'}}>
                                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                    </Badge>}
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ?
                                (<NavDropdown title={userInfo.name} id='username'>
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>Profile</NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                    </NavDropdown>

                                )
                                :
                                (<LinkContainer to='/login'>
                                    <Nav.Link><FaShoppingCart/>Sign In</Nav.Link>
                                </LinkContainer>)}
                            {userInfo && userInfo.isAdmin && (
                                (<NavDropdown title='Admin' id='admin'>
                                        <LinkContainer to='/admin/productlist'>
                                            <NavDropdown.Item>Product List</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/orderlist'>
                                            <NavDropdown.Item>Order List</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/userlist'>
                                            <NavDropdown.Item>User List</NavDropdown.Item>
                                        </LinkContainer>

                                    </NavDropdown>

                                )
                            )}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;