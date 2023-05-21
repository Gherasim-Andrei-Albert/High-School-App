import React, { useState, useEffect } from 'react';
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
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';

function LogInScreen() {
  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slowLoading, setSlowLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loading) {
      timer = setTimeout(() => {
        setSlowLoading(true);
      }, 10 * 1000);
    } else {
      setSlowLoading(false);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      <Modal show={loading} fullscreen animation={false} onHide={() => { }}>
        <Modal.Body
          className="d-flex align-items-center justify-content-center flex-column">
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
          {slowLoading && (
            <Alert className="mt-3 mb-0">
              <p className="m-0">
                It might take up to 60 seconds.
                <br />
                Server is waiking up or internet connection is slow.
              </p>
            </Alert>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={loginError} onHide={() => setLoginError(false)}>
        <Modal.Body className="p-0">
          <Alert
            className="m-0"
            variant="danger"
            onClose={() => {
              document.body.style.overflow = '';
              setLoginError(false)
            }}
            dismissible>
            <Alert.Heading>Error! Coudn't login.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '100%' }}>
        <Card
          className="my-3"
          style={{
          width: '100%',
          maxWidth: 576
        }}>
          <Card.Body>
            <Card.Text>
              <Stack gap={3}>
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

                      const tokenResponse =
                        await axiosClient.post('/tokens', values);
                      if (tokenResponse.status !== 200) {
                        setLoginError(true);
                        setLoading(false);
                        return;
                      }
                      localStorage.setItem('token', tokenResponse.data.token);

                      const userResponse =
                        await axiosClient.get('/users');
                      if (userResponse.status !== 200) {
                        setLoginError(true);
                        setLoading(false);
                        return;
                      }
                      localStorage.setItem('role',
                        userResponse.data.user.teacherDetails ? 'teacher' : 'student'
                      );

                      return navigate('/');
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
                      <Stack gap={3}>
                        <Form.Group controlId="email">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            onChange={handleChange}
                            value={values.email}
                          />
                        </Form.Group>
                        <Form.Group controlId="password">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={values.password}
                          />
                        </Form.Group>
                        <Button type="submit"
                          style={{ maxWidth: 576 }}>
                          Login
                        </Button>
                      </Stack>
                    </Form>
                  )}
                </Formik>
                <p style={{ maxWidth: 576 }}>
                  Don't have an account? <Link to="/signup">Register</Link>
                </p>
              </Stack>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default LogInScreen;
