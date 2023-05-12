import React, { useState } from 'react';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Formik } from 'formik';
import axios from 'axios';
import axiosClient from '../services/axiosClient';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

function LogInScreen() {
  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Modal className="opacity-50" show={loading} fullscreen animation={false} onHide={() => { }}>
        <Modal.Body
          className="d-flex align-items-center justify-content-center">
          <Spinner
            animation="border"
            role="status"
            variant='primary'
            style={{
              width: 100,
              height: 100,
            }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
      <Modal show={loginError} onHide={() => setLoginError(false)}>
        <Modal.Body>
          <Alert variant="danger" onClose={() => setLoginError(false)} dismissible>
            <Alert.Heading>Error! Coudn't login.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Container >
        <Row>
          <Col className="justify-content-md-center">
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validate={values => {
                const errors = {};
                // if (!values.email) {
                //   errors.email = 'Required';
                // } else if (
                //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                // ) {
                //   errors.email = 'Invalid email address';
                // }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(false);
                  setLoading(true);
                  const result =
                    await axiosClient.post('/tokens', values);
                  if (result.status === 200) {
                    localStorage.setItem('token', result.data.token);
                    navigate('/');
                  }
                  else {
                    setLoginError(true);
                    setLoading(false);
                  }
                }
                catch (err) {
                  setLoginError(true);
                  setLoading(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group as={Col} md="4" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      onChange={handleChange}
                      value={values.email}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={values.password} />
                  </Form.Group>
                  <Button type="submit">Login</Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Don't have an account? <Link to="/signup">Register</Link></p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LogInScreen;
