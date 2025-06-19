import React, { useContext } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Navigate } from "react-router";
import LoginForm from "../components/LoginForm.jsx";
import UserContext from "../contexts/UserContext.jsx";
import { logIn } from "../API/API.js";

function LoginPage() {
    const { loggedInUser, setLoggedInUser } = useContext(UserContext);
    
    // If already logged in, redirect to home
    if (loggedInUser) {
        return <Navigate to="/" />;
    }

    const handleLogin = async (credentials) => {
        try {
            const user = await logIn(credentials);
            setLoggedInUser(user);
        } catch (error) {
            throw error;
        }
    };
    
    return(
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white text-center">
                            <h2 className="mb-0">🔐 Login</h2>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <LoginForm handleLogin={handleLogin} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;