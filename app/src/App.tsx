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
import './App.css';
import SignUpScreen from './screens/SignUpScreen';
import LogInScreen from './screens/LogInScreen';
import StudentScreen from './screens/StudentScreen';
import MainScreen from './screens/MainScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainScreen />,
  },
  {
    path: '/signup',
    element: <SignUpScreen />,
  },
  {
    path: '/login',
    element: <LogInScreen />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
