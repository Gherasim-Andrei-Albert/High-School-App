import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import axiosClient from '../services/axiosClient';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';

function SignUpScreen() {
  const [validated, setValidated] = useState(false);
  const [signupError, setSignupError] = useState(false);
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
      <Modal show={signupError} onHide={() => setSignupError(false)}>
        <Modal.Body className="p-0">
          <Alert
            className="m-0"
            variant="danger"
            onClose={() => {
              document.body.style.overflow = '';
              setSignupError(false);
            }}
            dismissible>
            <Alert.Heading>Error! Coudn't register account.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '100%' }}>
        <Card className="my-3" style={{
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
                    firstName: '',
                    lastName: '',
                    type: 'teacher',
                    grade: 9,
                    groupName: 'A',
                    enrolmentYear: new Date().getFullYear()
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
                        await axiosClient.post('/users', values);
                      if (result.status === 200) {
                        navigate('/login');
                      }
                      else {
                        setLoading(false);
                        setSignupError(true);
                      }
                    }
                    catch (err) {
                      setLoading(false);
                      setSignupError(true);
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
                        <Form.Group controlId="firstName">
                          <Form.Label>First name</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="First name"
                            onChange={handleChange}
                            value={values.firstName}
                          />
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="lastName">
                          <Form.Label>Last name</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Last name"
                            onChange={handleChange}
                            value={values.lastName}
                          />
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="accountType">
                          <Form.Label>Account type</Form.Label>
                          <Form.Select name="type" aria-label="Account type"
                            onChange={handleChange}
                            value={values.type}
                          >
                            <option value="teacher">teacher</option>
                            <option value="student">student</option>
                          </Form.Select>
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        {
                          values.type === 'student' && (
                            <>
                              <Form.Group controlId="grade">
                                <Form.Label>Grade</Form.Label>
                                <Form.Select name="grade" aria-label="Grade"
                                  onChange={handleChange}
                                  value={values.grade}
                                >
                                  {Array.from(Array(4).keys()).map(gradeIndex =>
                                    <option value={9 + gradeIndex}>{9 + gradeIndex}</option>)
                                  }
                                </Form.Select>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group controlId="groupName">
                                <Form.Label>Group</Form.Label>
                                <Form.Select name="groupName" aria-label="Group name"
                                  onChange={handleChange}
                                  value={values.groupName}
                                >
                                  {Array.from(Array(4).keys()).map(gradeIndex =>
                                    <option value={['A', 'B', 'C', 'D'][gradeIndex]}>
                                      {['A', 'B', 'C', 'D'][gradeIndex]}
                                    </option>
                                  )}
                                </Form.Select>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group controlId="enrolmentYear">
                                <Form.Label>Enrolment year</Form.Label>
                                <Form.Control type="number"
                                  onChange={handleChange}
                                  value={values.enrolmentYear}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                              </Form.Group>
                            </>
                          )
                        }
                        <Button type="submit">Register</Button>
                      </Stack>
                    </Form>
                  )}
                </Formik>
                <p>Already have an account? <Link to="/login">Log in</Link></p>
              </Stack>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default SignUpScreen;
