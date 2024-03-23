import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { LoggedInContext } from '../context';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(LoggedInContext);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8081/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ username }));
        login(); // Update the logged-in state using context
        navigate('/person'); // Redirect to the desired page after login
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };
  return (
  <>
    <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="button" onClick={handleLogin}>
                Login
              </Button>
            </Modal.Footer>
      </Modal>
    <Container>
      <h2 style={{ color: 'white', padding: 5, marginTop: 5 }}>Population Records Database App</h2>
      <ul style={{ color: 'white', listStyleType: 'none', padding: 5 }}>
        <li>The Population Records Management App is a comprehensive solution for managing and organizing data related to individuals, penalties, cities, and more. Built with a React frontend and an Express backend, this application offers a user-friendly interface for seamless navigation and efficient data management.</li>
        <li><strong>Key Features:</strong>
          <ul style={{ color: 'white', listStyleType: 'none', padding: 5 }}>
            <li>Person Management: Add, update, or delete individual records with details such as CNP, name, birthplace, and identification information.</li>
            <li>Penalty Tracking: Monitor penalties incurred by individuals, recording details like type, date, and price.</li>
            <li>City Information: Explore and manage data related to cities, including inhabitants, counties, and other relevant details.</li>
            <li>Data Analysis: Utilizes various endpoints for analyzing data, such as retrieving penalties by city and date or finding persons with a specific job type.</li>
          </ul>
        </li>
        <li><strong>How to Use:</strong>
          <ul style={{ color: 'white', listStyleType: 'none', padding: 3 }}>
            <li>Users start by logging in through a modal, gaining access to features based on their authentication status.</li>
            <li>Navigate through the intuitive interface to manage individual records, penalties, cities, and more.</li>
            <li>Explore data analysis endpoints for valuable insights into population-related information.</li>
            <li>Logout securely when finished, ensuring data privacy.</li>
          </ul>
        </li>
      </ul>

      <Button variant="primary" onClick={handleModalShow} size="lg" className = "log-button">
         Login 
      </Button>
    </Container>
  </>
  );
};

export default Login;