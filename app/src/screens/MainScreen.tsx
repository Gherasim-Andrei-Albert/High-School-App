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


function MainScreen() {
  const [validated, setValidated] = useState(false);
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

      const response =
        await axiosClient('/users');

      // console.log(response.status);

      if (response.status === 200) {
        setUser(response.data.user);
      }
    })();
  }, []);

  return (
    <>
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
