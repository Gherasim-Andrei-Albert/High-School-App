import React, { useEffect, useState } from 'react';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  redirect
} from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Formik } from 'formik';
import axios from 'axios';
import axiosClient from '../services/axiosClient';
import StudentScreen from './StudentScreen';
import { useNavigate } from 'react-router-dom';
import TeacherScreen from './TeacherScreen';
import Navbar from '../components/Navbar';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';


function MainScreen() {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] =
    useState<{
      studentDetails: ({} | null),
      teacherDetails: ({ id: number } | null)
    } | null>(null);

  useEffect(() => {
    if (
      !(
        localStorage.getItem('token')
        && localStorage.getItem('role')
      )
    ) {
      navigate('/login', { replace: true });
        return;
    }
  }, []);

  return (
    <>
      {
        (localStorage.getItem('role')) && (
          <div
            className='d-flex flex-column'
            style={{
              height: '100%',
              overflow: 'auto'
            }}
          >
            <Navbar />
            {
              localStorage.getItem('role') === 'teacher' ?
                <TeacherScreen />
                : <StudentScreen />
            }
          </div >
        )
      }
    </>
  );
}

export default MainScreen;
