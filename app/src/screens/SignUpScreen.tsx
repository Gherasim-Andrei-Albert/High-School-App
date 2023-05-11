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
import axios from 'axios';
import axiosClient from '../services/axiosClient';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

function SignUpScreen() {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col>
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
              setSubmitting(false);
              const result =
                await axiosClient.post('/users', values);
              if (result.status === 200) {
                navigate('/login');
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
                <Form.Group as={Col} md="4" controlId="firstName">
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
                <Form.Group as={Col} md="4" controlId="lastName">
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
                <Form.Group as={Col} md="4" controlId="accountType">
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
                      <Form.Group as={Col} md="4" controlId="grade">
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
                      <Form.Group as={Col} md="4" controlId="groupName">
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
                      <Form.Group as={Col} md="4" controlId="enrolmentYear">
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
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUpScreen;
