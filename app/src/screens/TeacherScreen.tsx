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
import { Formik, useFormikContext } from 'formik';
import axios from 'axios';
import axiosClient from '../services/axiosClient';
import { useNavigate } from 'react-router-dom';
import { DateTime, Info } from "luxon";
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import Navbar from '../components/Navbar';

function OnGroupChangeFieldsReseter() {
  const { values, setFieldValue } = useFormikContext<{ groupId: number }>();
  useEffect(() => {
    setFieldValue('studentId', -1);
    setFieldValue('value', -1);
    setFieldValue('lessonId', -1);
  }, [values.groupId]);
  return <></>;
}

function TeacherScreen() {
  const [validated, setValidated] = useState(false);
  const [groupsFetchError, setGroupsFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slowLoading, setSlowLoading] = useState(false);
  const [absenceAddedSuccess, setAbsenceAddedSuccess] = useState(false);
  const [absenceAddedError, setAbsenceAddedError] = useState(false);
  const [markAddedSuccess, setMarkAddedSuccess] = useState(false);
  const [markAddedError, setMarkAddedError] = useState(false);
  const [groups, setGroups] = useState<{
    id: number,
    grade: number,
    name: string,
    students: {
      id: number,
      firstName: string,
      lastName: string
    }[],
    lessons: {
      id: number,
      teacherId: number,
      weekday: number,
      startTime: string
    }[]
  }[]>([]);
  // const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const groupsResponse = await axiosClient.get('/groups');
        if (groupsResponse.status !== 200) {
          setGroupsFetchError(true)
          return;
        }
        const { groups } = groupsResponse.data;
        setGroups(groups);
      }
      catch (err) {
        setGroupsFetchError(true)
      }
    })();
  }, []);

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

  let submitAction: string | undefined = undefined;

  return (
    <>
      <Modal show={groupsFetchError} onHide={() => { }}>
        <Modal.Body className="p-0">
          <Alert
            className="m-0"
            variant="danger"
            onClose={() => { }}
            dismissible={false}>
            <Alert.Heading>Error! Coudn't download data for forms.</Alert.Heading>
            <p>
              Server or internet error.
              Check your internet connection and refresh the page.
            </p>
          </Alert>
        </Modal.Body>
      </Modal>
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
      <Modal show={absenceAddedError} onHide={() => setAbsenceAddedError(false)}>
        <Modal.Body className="p-0">
          <Alert
            className="m-0"
            variant="danger"
            onClose={() => {
              document.body.style.overflow = '';
              setAbsenceAddedError(false);
            }}
            dismissible>
            <Alert.Heading>Error! Absence coudn't be added.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Modal show={absenceAddedSuccess} onHide={() => setAbsenceAddedSuccess(false)}>
        <Modal.Body className="p-0">
          <Alert
            className="m-0"
            variant="success"
            onClose={() => {
              document.body.style.overflow = '';
              setAbsenceAddedSuccess(false);
            }}
            dismissible>
            <Alert.Heading>Absence added successfuly.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Modal show={markAddedError} onHide={() => setMarkAddedError(false)}>
        <Modal.Body className="p-0">
          <Alert
            className="m-0"
            variant="danger"
            onClose={() => {
              document.body.style.overflow = '';
              setMarkAddedError(false)
            }}
            dismissible>
            <Alert.Heading>Error! Mark coudn't be added.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Modal show={markAddedSuccess} onHide={() => setMarkAddedSuccess(false)}>
        <Modal.Body className="p-0">
          <Alert
            className="m-0"
            variant="success"
            onClose={() => {
              document.body.style.overflow = '';
              setMarkAddedSuccess(false)
            }}
            dismissible>
            <Alert.Heading>Mark added successfuly.</Alert.Heading>
          </Alert>
        </Modal.Body>
      </Modal>
      <Container style={{ flex: 1 }}>
        <Formik
          // enableReinitialize={true}
          initialValues={{
            groupId: -1,
            studentId: -1,
            lessonId: -1,
            value: -1,
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
            switch (submitAction) {
              case 'addAbsence': {
                try {
                  setLoading(true);

                  const result =
                    await axiosClient.post('/absences', values);

                  if (result.status === 200) {
                    setAbsenceAddedSuccess(true);
                  }
                  else {
                    setAbsenceAddedError(true);
                  }
                }
                catch (err) {
                  setAbsenceAddedError(true);
                }
                finally {
                  setLoading(false);
                }
                break;
              }
              case 'addMark': {
                try {
                  setLoading(true);

                  const result =
                    await axiosClient.post('/marks', values);

                  if (result.status === 200) {
                    setMarkAddedSuccess(true);
                  }
                  else {
                    setMarkAddedError(true);
                  }
                }
                catch (err) {
                  setMarkAddedError(true);
                }
                finally {
                  setLoading(false);
                }
                break;
              }
            }
            submitAction = undefined;
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
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              className="my-3"
              style={{
                width: '100%',
                maxWidth: 576
              }}
            >
              <Stack gap={3}>
                <OnGroupChangeFieldsReseter />
                <Form.Group controlId="groupId">
                  {!groups.length &&
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  }
                  <Form.Label>Group</Form.Label>
                  <Form.Select name="groupId" aria-label="Group name"
                    onChange={handleChange}
                    value={values.groupId}
                  >
                    {
                      (values.groupId === -1) && (
                        <option>Select a group</option>
                      )
                    }
                    {
                      groups.map(group => (
                        <option value={group.id}>
                          {`${group.grade}${group.name}`}
                        </option>
                      ))
                    }
                  </Form.Select>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="studentId">
                  <Form.Label>Student</Form.Label>
                  <Form.Select name="studentId" aria-label="student"
                    onChange={handleChange}
                    value={values.studentId}
                    disabled={values.groupId === -1}
                  >
                    {
                      (values.studentId === -1) && (
                        <option value={-1}>Select a student</option>
                      )
                    }
                    {groups.find(group => group.id == values.groupId)?.students
                      .map(student =>
                        <option value={student.id}>
                          {`${student.lastName} ${student.firstName}`}
                        </option>
                      )
                    }
                  </Form.Select>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="lessonId">
                  <Form.Label>Lesson time</Form.Label>
                  <Form.Select name="lessonId" aria-label="Lesson time"
                    onChange={handleChange}
                    value={values.lessonId}
                    disabled={values.groupId === -1}
                  >
                    {
                      (values.lessonId === -1) && (
                        <option>Select a time</option>
                      )
                    }
                    {
                      groups.find(
                        group => group.id == values.groupId
                      )?.lessons?.map(({ id, weekday, startTime }) => {
                        const weekdayName =
                          Info.weekdays('long', { locale: 'ro' })[weekday - 1];
                        const formatedDate =
                          DateTime.fromFormat(startTime, 'HH:mm:ss', { zone: 'utc' })
                            .setZone('Europe/Bucharest')
                            .toFormat('HH:mm', { locale: 'ro' });
                        return <option value={id}>
                          {`${weekdayName} ${formatedDate}`}
                        </option>;
                      })
                    }
                  </Form.Select>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Button
                  type="button"
                  className="align-self-start"
                  onClick={() => {
                    submitAction = "addAbsence";
                    handleSubmit();
                  }}
                  disabled={
                    Object.entries(values)
                      .filter(([key, value]) => key !== 'value')
                      .findIndex(
                        ([key, value]) => value === -1
                      ) !== -1
                  }
                >
                  Add absence
                </Button>
                <Form.Group controlId="value">
                  <Form.Label>Mark</Form.Label>
                  <Form.Select name="value" aria-label="Mark"
                    onChange={handleChange}
                    value={values.value}
                    disabled={values.groupId === -1}
                  >
                    {
                      (values.value === -1) && (
                        <option>Select a mark value</option>
                      )
                    }
                    {
                      Array.from(Array(10).keys()).map(markIndex => (
                        <option value={markIndex + 1}>{markIndex + 1}</option>
                      ))
                    }
                  </Form.Select>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Button
                  type="button"
                  className="align-self-start"
                  onClick={() => {
                    submitAction = "addMark";
                    handleSubmit();
                  }}
                  disabled={
                    Object.values(values).findIndex(
                      value => value === -1
                    ) !== -1
                  }
                >
                  Add mark
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
}

export default TeacherScreen;
