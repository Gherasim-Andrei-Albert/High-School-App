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
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Navbar from '../components/Navbar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import './StudentScreen.css';
import Spinner from 'react-bootstrap/Spinner';

function MarkCard({ mark }: {
  mark: {
    markDetails: { value: number, createdAt: string },
    subject: { name: string }
  }
}
) {

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Text>
          Nota: {mark.markDetails.value} <br />
          {mark.subject.name} <br />
          Data: {new Date(mark.markDetails.createdAt).toLocaleString()}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

function AbsenceCard({ absence }: {
  absence: {
    absenceDetails: { createdAt: string },
    subject: { name: string }
  }
}
) {

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Text>
          Absență: {absence.subject.name} <br />
          Data: {new Date(absence.absenceDetails.createdAt).toLocaleString()}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

function StudentScreen() {
  const [validated, setValidated] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [marks, setMarks] =
    useState<{
      markDetails: { value: number, createdAt: string },
      subject: { name: string },
      lesson: {}
    }[]>([]);
  const [absences, setAbsences] =
    useState<{
      absenceDetails: { createdAt: string },
      subject: { name: string },
      lesson: {}
    }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const marksResponse = await axiosClient('/marks');
        const absencesResponse = await axiosClient('/absences');
        if (marksResponse.status === 200
          && absencesResponse.status === 200) {
          const { marks } = marksResponse.data;
          const { absences } = absencesResponse.data;
          console.log({ marks, absences });
          setLoading(false);
          setMarks(marks);
          setAbsences(absences);
        }
        else {
          setLoading(false);
          setFetchError(true);
        }
      }
      catch (err) {
        setLoading(false);
        setFetchError(true);
      }
    })();
  }, []);

  return (
    <>
      <Modal show={fetchError} onHide={() => { }}>
        <Modal.Body className="p-0">
          <Alert
            className="m-0"
            variant="danger"
            onClose={() => { }}
            dismissible={false}>
            <Alert.Heading>Error! Coudn't load marks and absences.</Alert.Heading>
            <p>
              Server or internet error.
              Check your internet connection and refresh the page.
            </p>
          </Alert>
        </Modal.Body>
      </Modal>
      <Container style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        flex: 1,
      }}>
        <div
          className='d-md-none mt-3'
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            flex: 1,
          }}
        >
          <Tabs
            defaultActiveKey="marks"
            id="marks-and-absences-tabs"
            style={{ flex: '0 0 auto' }}
            className="mb-3"
          >
            <Tab eventKey="marks" title="Marks">
              {
                loading ?
                  (
                    <Spinner
                      className='d-flex d-md-none'
                      animation="border"
                      role="status"
                      variant='primary'
                      style={{
                        width: 100,
                        height: 100,
                        margin: 'auto',
                      }}>
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )
                  : (
                    marks.map(mark => <MarkCard mark={mark} />)
                  )
              }
            </Tab>
            <Tab eventKey="absences" title="Absences">
              {
                loading ?
                  (
                    <Spinner
                      className='d-flex d-md-none'
                      animation="border"
                      role="status"
                      variant='primary'
                      style={{
                        width: 100,
                        height: 100,
                        margin: 'auto',
                      }}>
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )
                  : (
                    absences.map(absence => <AbsenceCard absence={absence} />)
                  )
              }
            </Tab>
          </Tabs>
        </div>
        {
          loading ?
            (
              <Spinner
                className='d-none d-md-flex'
                animation="border"
                role="status"
                variant='primary'
                style={{
                  width: 100,
                  height: 100,
                  margin: 'auto',
                }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )
            : (
              <Row className="d-none d-md-flex overflow-auto mt-3" style={{ height: '100%' }}>
                <Col style={{ height: '100%' }} className="overflow-auto">
                  {marks.map(mark =>
                    <Row>
                      <Col>
                        <MarkCard mark={mark} />
                      </Col>
                    </Row>
                  )}
                </Col>
                <Col style={{ height: '100%' }} className="overflow-auto">
                  {absences.map(absence =>
                    <Row>
                      <Col>
                        <AbsenceCard absence={absence} />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            )
        }
      </Container>
    </>
  );
}

export default StudentScreen;
