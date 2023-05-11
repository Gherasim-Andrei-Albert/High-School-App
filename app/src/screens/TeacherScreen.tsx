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
import { DateTime, Info } from "luxon";

function TeacherScreen(props: {
  user: { teacherDetails: { id: number } | null }
}) {
  const [validated, setValidated] = useState(false);
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
      const groupsResponse =
        await axiosClient.get('/groups');
      if (groupsResponse.status === 200) {
        const { groups } = groupsResponse.data;
        console.log({ groups });
        setGroups(groups);
      }
    })();
  }, []);

  let submitAction: string | undefined = undefined;

  return (
    <Container>
      <Row>
        <Col>
          <Formik
            // enableReinitialize={true}
            initialValues={{
              groupId: undefined,
              studentId: undefined,
              lessonId: undefined,
              value: undefined,
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
                  const result =
                    await axiosClient.post('/absences', values);
                  console.log(result)
                  break;
                }
                case 'addMark': {
                  const result =
                    await axiosClient.post('/marks', values);
                  console.log(result)
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
                <Form.Group as={Col} md="4" controlId="groupId">
                  <Form.Label>Group</Form.Label>
                  <Form.Select name="groupId" aria-label="Group name"
                    onChange={handleChange}
                    value={values.groupId}
                  >
                    {
                      (values.groupId === undefined) && (
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
                    disabled={values.groupId === undefined}
                  >
                    {
                      (values.studentId === undefined) && (
                        <option>Select a student</option>
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
                    disabled={values.groupId === undefined}
                  >
                    {
                      (values.lessonId === undefined) && (
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
                      .find(
                        ([key, value]) => value === undefined
                      ) !== undefined
                  }
                >
                  Add absence
                </Button>
                <Form.Group as={Col} md="4" controlId="value">
                  <Form.Label>Mark</Form.Label>
                  <Form.Select name="value" aria-label="Mark"
                    onChange={handleChange}
                    value={values.value}
                    disabled={values.groupId === undefined}
                  >
                    {
                      (values.value === undefined) && (
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
                      value => value === undefined
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
  );
}

export default TeacherScreen;
