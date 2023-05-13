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

function StudentScreen() {
  const [validated, setValidated] = useState(false);
  const [fetchError, setFetchError] = useState(false);
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
      if (!localStorage.getItem('token')?.length) {
        navigate('/login');
      }

      try {
        const marksResponse = await axiosClient('/marks');
        const absencesResponse = await axiosClient('/absences');
        if (marksResponse.status === 200
          && absencesResponse.status === 200) {
          const { marks } = marksResponse.data;
          const { absences } = absencesResponse.data;
          console.log({ marks, absences });
          setMarks(marks);
          setAbsences(absences);
        }
        else {
          setFetchError(true);
        }
      }
      catch (err) {
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
      <Container style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Row style={{ height: '100%' }}>
          <Col style={{ height: '100%' }} className="overflow-auto">
            {marks.map(mark =>
              <Row>
                <Col>
                  {
                    <Card>
                      <Card.Body>
                        <Card.Text>
                          Nota: {mark.markDetails.value} <br />
                          {mark.subject.name} <br />
                          Data: {new Date(mark.markDetails.createdAt).toLocaleString()}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  }
                </Col>
              </Row>
            )}
          </Col>
          <Col style={{ height: '100%' }} className="overflow-auto">
            {absences.map(absence =>
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Text>
                        Absenta: {absence.subject.name} <br />
                        Data: {new Date(absence.absenceDetails.createdAt).toLocaleString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default StudentScreen;
