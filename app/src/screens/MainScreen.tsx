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
  const [userFetchError, setUserFetchError] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] =
    useState<{
      studentDetails: ({} | null),
      teacherDetails: ({ id: number } | null)
    } | null>(null);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('token')?.length) {
        navigate('/login');
        return;
      }

      try {
        const response =
          await axiosClient('/users');

        if (response.status === 200) {
          setUser(response.data.user);
        }
        else {
          setUserFetchError(true);
        }
      } catch (err) {
        setUserFetchError(true);
      }
    })();
  }, []);

  return (
    <>
      <Modal show={userFetchError} onHide={() => { }}>
        <Modal.Body>
          <Alert variant="danger" onClose={() => { }} dismissible={false}>
            <Alert.Heading>Server or internet error!</Alert.Heading>
            <p>
              Check your internet connection and refresh the page.
            </p>
          </Alert>
        </Modal.Body>
      </Modal>
      {
        (user !== null) && (
          <>
            <Navbar />
            {
              user.teacherDetails ?
                <TeacherScreen user={user} />
                : <StudentScreen />
            }
          </>
        )
      }
    </>
  );
}

export default MainScreen;
