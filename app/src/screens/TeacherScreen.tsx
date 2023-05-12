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

function OnGroupChangeFieldsReseter() {
  const { values, setFieldValue } = useFormikContext<{ groupId: number }>();
  useEffect(() => {
    setFieldValue('studentId', -1);
    setFieldValue('value', -1);
    setFieldValue('lessonId', -1);
  }, [values.groupId]);
  return <></>;
}

function TeacherScreen(props: {
  user: { teacherDetails: { id: number } | null }
}) {
  const [validated, setValidated] = useState(false);
  const [groupsFetchError, setGroupsFetchError] = useState(false);
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
      if (!localStorage.getItem('token')?.length) {
        navigate('/login');
      }
      try {
        const groupsResponse = await axiosClient.get('/groups');
        if (groupsResponse.status === 200) {
          const { groups } = groupsResponse.data;
          setGroups(groups);
        }
        else {
          setGroupsFetchError(true)
        }
      }
      catch (err) {
        setGroupsFetchError(true)
      }
    })();
  }, []);

  let submitAction: string | undefined = undefined;

  return (
    <>
      <Modal show={groupsFetchError} onHide={() => { }}>
        <Modal.Body>
          <Alert variant="danger" onClose={() => { }} dismissible={false}>
            <Alert.Heading>Error! Coudn't download data for forms.</Alert.Heading>
            <p>
              Server or internet error.
              Check your internet connection and refresh the page.
            </p>
          </Alert>
        </Modal.Body>
      </Modal>
      <Modal show={absenceAddedError} onHide={() => setAbsenceAddedError(false)}>
        <Modal.Body>
          <Alert
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
        <Modal.Body>
          <Alert
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
        <Modal.Body>
          <Alert
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
        <Modal.Body>
          <Alert
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
      <Container>
        <Row>
          <Col>
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
                    break;
                  }
                  case 'addMark': {
                    try {
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
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <OnGroupChangeFieldsReseter />
                  <Form.Group as={Col} md="4" controlId="groupId">
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
                  <Form.Group as={Col} md="4" controlId="studentId">
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
                  <Form.Group as={Col} md="4" controlId="lessonId">
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
                        )?.lessons?.filter(lesson =>
                          lesson.teacherId === props.user.teacherDetails?.id
                        )?.map(({ id, weekday, startTime }) => {
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
                  <Form.Group as={Col} md="4" controlId="value">
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
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TeacherScreen;
