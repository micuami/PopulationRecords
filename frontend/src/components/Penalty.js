import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const Penalty = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSearchPenaltiesByCityModal, setShowSearchPenaltiesByCityModal] = useState(false);
  const [showSearchPenaltiesByCompanyNameModal, setShowSearchPenaltiesByCompanyNameModal] = useState(false);

  const [newPenalty, setNewPenalty] = useState({
    PenaltyID: '',
    CNP: '',
    Type: '',
    Date: '',
    Price: '',
  });

  const [selectedPenalty, setSelectedPenalty] = useState({
    PenaltyID: '',
    CNP: '',
    Type: '',
    Date: '',
    Price: '',
  });

  const [searchPenaltiesByCityData, setSearchPenaltiesByCityData] = useState({
    cityName: '',
    penaltyDate: '',
  });

  const [searchPenaltiesByCompanyNameData, setSearchPenaltiesByCompanyNameData] = useState({
    companyName: '',
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/penalty');
      setPenalties(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPenalty((prevPenalty) => ({ ...prevPenalty, [name]: value }));
  };

  const handleInsert = async () => {
    try {
      await axios.post('http://localhost:8081/penalty', newPenalty);
      setShowInsertModal(false);
      fetchData(); // Refetch data after insert
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8081/penalty/${newPenalty.PenaltyID}`, newPenalty);
      setShowUpdateModal(false);
      fetchData(); // Refetch data after update
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/penalty/${selectedPenalty.PenaltyID}`);
      setShowDeleteModal(false);
      fetchData(); // Refetch data after delete
    } catch (error) {
      setError(error);
    }
  };

  const handleSearchPenaltiesByCity = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/penalties-by-city-and-date`, {
        params: {
          cityName: searchPenaltiesByCityData.cityName,
          penaltyDate: searchPenaltiesByCityData.penaltyDate,
        },
      });
      setPenalties(response.data);
      setShowSearchPenaltiesByCityModal(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleSearchPenaltiesByCompanyName = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/penalties-by-company-name`, {
        params: {
          companyName: searchPenaltiesByCompanyNameData.companyName,
        },
      });
      setPenalties(response.data);
      setShowSearchPenaltiesByCompanyNameModal(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleRowClick = (penalty) => {
    setSelectedPenalty(penalty);
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString();
  };

  return (
    <div>
      <Button variant="primary" size="lg" onClick={() => setShowInsertModal(true)} className="penalty-button">
        Insert
      </Button>
      <Button variant="info" size="lg" onClick={() => setShowUpdateModal(true)} className="penalty-button">
        Update
      </Button>
      <Button variant="danger" size="lg" onClick={() => setShowDeleteModal(true)} className="penalty-button">
        Delete
      </Button>
      <Button variant="success" size="lg" onClick={() => setShowSearchPenaltiesByCityModal(true)} className="penalty-button">
        Search Penalties by City
      </Button>
      <Button variant="warning" size="lg" onClick={() => setShowSearchPenaltiesByCompanyNameModal(true)} className="penalty-button">
        Search Penalties by Company
      </Button>

      {/* Insert Modal */}
      <Modal show={showInsertModal} onHide={() => setShowInsertModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Penalty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Insert form */}
          <Form>
            <Form.Group controlId="formCNP">
              <Form.Label>CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter CNP"
                name="CNP"
                value={newPenalty.CNP}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter type"
                name="Type"
                value={newPenalty.Type}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="YYYY-MM-DD"
                name="Date"
                value={newPenalty.Date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="Price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter price"
                name="Price"
                value={newPenalty.Price}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInsertModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleInsert}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Penalty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Update form */}
          <Form>
          <Form.Group controlId="formPenaltyID">
              <Form.Label>Penalty ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter PenaltyID"
                name="PenaltyID"
                value={newPenalty.PenaltyID}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCNP">
              <Form.Label>CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter CNP"
                name="CNP"
                value={newPenalty.CNP}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter type"
                name="Type"
                value={newPenalty.Type}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="YYYY-MM-DD"
                name="Date"
                value={newPenalty.Date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="Price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter price"
                name="Price"
                value={newPenalty.Price}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this penalty?</p>
          <p>Details: {`${selectedPenalty.CNP} - ${formatDate(selectedPenalty.Date)}, ${selectedPenalty.Type}`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search Penalties by City Modal */}
      <Modal show={showSearchPenaltiesByCityModal} onHide={() => setShowSearchPenaltiesByCityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Penalties by City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Search form for penalties by city */}
          <Form>
            <p>Display all the fines taken on a certain date in a certain city.</p>
            <Form.Group controlId="formCityName">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city name"
                name="cityName"
                value={searchPenaltiesByCityData.cityName}
                onChange={(e) => setSearchPenaltiesByCityData((prevData) => ({ ...prevData, cityName: e.target.value }))}
              />
            </Form.Group>
            <Form.Group controlId="formPenaltyDate">
              <Form.Label>Penalty Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="YYYY-MM-DD"
                name="penaltyDate"
                value={searchPenaltiesByCityData.penaltyDate}
                onChange={(e) => setSearchPenaltiesByCityData((prevData) => ({ ...prevData, penaltyDate: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchPenaltiesByCityModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSearchPenaltiesByCity}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search Penalties by Company Name Modal */}
      <Modal show={showSearchPenaltiesByCompanyNameModal} onHide={() => setShowSearchPenaltiesByCompanyNameModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Penalties by Company Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Search form for penalties by company name */}
          <Form>
          <p>Display the fines of employees from a certain company.</p>
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                name="companyName"
                value={searchPenaltiesByCompanyNameData.companyName}
                onChange={(e) => setSearchPenaltiesByCompanyNameData((prevData) => ({ ...prevData, companyName: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchPenaltiesByCompanyNameModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSearchPenaltiesByCompanyName}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {loading ? (
        <p>Loading penalties...</p>
      ) : error ? (
        <p>Error fetching penalties: {error.message}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>CNP</th>
              <th>Type</th>
              <th>Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {penalties.map((penalty) => (
              <tr key={penalty.PenaltyID} onClick={() => handleRowClick(penalty)}>
                <td>{penalty.CNP}</td>
                <td>{penalty.Type}</td>
                <td>{formatDate(penalty.Date)}</td>
                <td>{penalty.Price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Penalty;