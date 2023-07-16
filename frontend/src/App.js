import React from 'react';
import {Container} from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Outlet} from "react-router";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//TODO: Extract items list in OrderScreen ProfileScreen and ProductScreen to a separate component
//TODO: Extract user profile form in RegisterScreen and ProfileScreen to a separate component
//TODO: Extract order to a separate component
//TODO: Add pagination to OrderListScreen and UserListScreen
//TODO: Add input for page number in ProductListScreen

function App(props) {

    return (
        <>
            <ToastContainer/>
            <Header/>
            <main className="py-3">
                <Container>
                    <Outlet/>
                </Container>
            </main>
            <Footer/>
        </>
    );
}

export default App;