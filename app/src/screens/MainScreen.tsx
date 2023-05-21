import React, { useEffect } from 'react';
import StudentScreen from './StudentScreen';
import { useNavigate } from 'react-router-dom';
import TeacherScreen from './TeacherScreen';
import Navbar from '../components/Navbar';


function MainScreen() {
  const navigate = useNavigate();

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
