import React, { useState, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Formik } from 'formik';
import axios from 'axios';
import axiosClient from '../services/axiosClient';
import { useNavigate } from 'react-router-dom';

function TeacherScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('token')?.length) {
        navigate('/login');
      }
    })();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <p>
            Teacher page not implemented yet.<br />
            Log in with a student account
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default TeacherScreen;
