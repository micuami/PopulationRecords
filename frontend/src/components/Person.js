import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const Person = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSearchPenaltiesModal, setShowSearchPenaltiesModal] = useState(false);
  const [showSearchPropertiesModal, setShowSearchPropertiesModal] = useState(false);
  const [showSearchByParentBirthPlaceModal, setShowSearchByParentBirthPlaceModal] = useState(false);
  const [showSearchByCompanyModal, setShowSearchByCompanyModal] = useState(false);
  const [showSearchJobModal, setShowSearchJobModal] = useState(false);

  const [searchJobData, setSearchJobData] = useState({
    jobType: '',
  });

  const [companyData, setCompanyData] = useState({
    companyType: '',
    establishmentDate: '',
  });
  
  const [parentBirthPlaceData, setParentBirthPlaceData] = useState({
    parentBirthPlace: '',
  });

  const [newPerson, setNewPerson] = useState({
    CNP: '',
    LastName: '',
    FirstName: '',
    BirthPlace: '',
    SeriesIC: '',
    NumberIC: '',
  });

  const [selectedPerson, setSelectedPerson] = useState({
    CNP: '',
    LastName: '',
    FirstName: '',
    BirthPlace: '',
    SeriesIC: '',
    NumberIC: '',
  });

  const [searchData, setSearchData] = useState({
    numberOfPenalties: '',
    penaltyDate: '',
  });

  const [searchPropertiesData, setSearchPropertiesData] = useState({
    constructionDate: '',
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/person');
      setPersons(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount


  const handleSearchJob = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/persons-by-job`, {
        params: {
          jobType: searchJobData.jobType,
        },
      });
      setPersons(response.data);
      setShowSearchJobModal(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleSearchByCompany = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/persons-with-established-companies`, {
        params: {
          companyType: companyData.companyType,
          establishmentDate: companyData.establishmentDate,
        },
      });
      setPersons(response.data);
    } catch (error) {
      setError(error);
    }
  };

  const handleParentBirthPlaceInputChange = (e) => {
    const { name, value } = e.target;
    setParentBirthPlaceData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearchPropertiesInputChange = (e) => {
    const { name, value } = e.target;
    setSearchPropertiesData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearchByParentBirthPlace = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/persons-by-parent-birthplace`, {
        params: {
          parentBirthPlace: parentBirthPlaceData.parentBirthPlace,
        },
      });
      setPersons(response.data);
    } catch (error) {
      setError(error);
    }
  };
  
  const handleSearchProperties = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/persons-with-properties`, {
        params: {
          constructionDate: searchPropertiesData.constructionDate,
        },
      });
      setPersons(response.data);
      setShowSearchPropertiesModal(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleSearchPenalties = async () => {
    try {
      // Convert the number of penalties to a number (assuming it should be a numeric value)
      const numberOfPenalties = parseInt(searchData.numberOfPenalties, 10);
      // Make the API call with the search parameters
      const response = await axios.get(`http://localhost:8081/persons-with-penalties`, {
        params: {
          numberOfPenalties,
          penaltyDate: searchData.penaltyDate,
        },
      });
      // Update the persons state with the fetched results
      setPersons(response.data);
      // Close the search modal
      setShowSearchPenaltiesModal(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPerson((prevPerson) => ({ ...prevPerson, [name]: value }));
  };

  const handleInsert = async () => {
    try {
      await axios.post('http://localhost:8081/person', newPerson);
      setShowInsertModal(false);
      fetchData(); // Refetch data after insert
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8081/person/${newPerson.CNP}`, newPerson);
      setShowUpdateModal(false);
      fetchData(); // Refetch data after update
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/person/${selectedPerson.CNP}`);
      setShowDeleteModal(false);
      fetchData(); // Refetch data after delete
    } catch (error) {
      setError(error);
    }
  };

  const handleRowClick = (person) => {
    setSelectedPerson(person);
  };

  return (
    <div>
      <Button variant="primary" size="lg" onClick={() => setShowInsertModal(true)} className="person-button">
        Insert
      </Button>
      <Button variant="info" size="lg" onClick={() => setShowUpdateModal(true)} className="person-button">
        Update
      </Button>
      <Button variant="danger" size="lg" onClick={() => setShowDeleteModal(true)} className="person-button">
        Delete
      </Button>
      <Button variant="success" size="lg" onClick={() => setShowSearchPenaltiesModal(true)} className="person-button">
        Search Penalties
      </Button>
      <Button variant="primary" size="lg" onClick={() => setShowSearchPropertiesModal(true)} className="person-button">
        Search Properties
      </Button>
      <Button variant="warning" size="lg" onClick={() => setShowSearchByParentBirthPlaceModal(true)} className="person-button">
        Search Parents
      </Button>
      <Button variant="dark" size="lg" onClick={() => setShowSearchByCompanyModal(true)} className="person-button">
        Search Company
      </Button>
      <Button variant="primary" size="lg" onClick={() => setShowSearchJobModal(true)} className="person-button">
        Search Job
      </Button>

      {/* Insert Modal */}
      <Modal show={showInsertModal} onHide={() => setShowInsertModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Person</Modal.Title>
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
                value={newPerson.CNP}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="LastName"
                value={newPerson.LastName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="FirstName"
                value={newPerson.FirstName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formResidenceID">
              <Form.Label>Residence ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter residence id"
                name="ResidenceID"
                value={newPerson.ResidenceID}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBirthPlace">
              <Form.Label>Birth Place</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter birth place"
                name="BirthPlace"
                value={newPerson.BirthPlace}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formSeriesIC">
              <Form.Label>Series IC</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter series IC"
                name="SeriesIC"
                value={newPerson.SeriesIC}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formNumberIC">
              <Form.Label>Number IC</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter number IC"
                name="NumberIC"
                value={newPerson.NumberIC}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMotherCNP">
              <Form.Label>Mother CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mother CNP"
                name="MotherCNP"
                value={newPerson.MotherCNP}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formFatherCNP">
              <Form.Label>Father CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter father CNP"
                name="FatherCNP"
                value={newPerson.FatherCNP}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formSpouseCNP">
              <Form.Label>Spouse CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter spouce CNP"
                name="SpouseCNP"
                value={newPerson.SpouseCNP}
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
          <Modal.Title>Update Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Update form */}
          <Form>
            <Form.Group controlId="formCNP">
              <Form.Label>CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter CNP"
                name="CNP"
                value={newPerson.CNP}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="LastName"
                value={newPerson.LastName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="FirstName"
                value={newPerson.FirstName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formResidenceID">
              <Form.Label>Residence ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter residence id"
                name="ResidenceID"
                value={newPerson.ResidenceID}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBirthPlace">
              <Form.Label>Birth Place</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter birth place"
                name="BirthPlace"
                value={newPerson.BirthPlace}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formSeriesIC">
              <Form.Label>Series IC</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter series IC"
                name="SeriesIC"
                value={newPerson.SeriesIC}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formNumberIC">
              <Form.Label>Number IC</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter number IC"
                name="NumberIC"
                value={newPerson.NumberIC}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMotherCNP">
              <Form.Label>Mother CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mother CNP"
                name="MotherCNP"
                value={newPerson.MotherCNP}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formFatherCNP">
              <Form.Label>Father CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter father CNP"
                name="FatherCNP"
                value={newPerson.FatherCNP}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formSpouseCNP">
              <Form.Label>Spouse CNP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter spouce CNP"
                name="SpouseCNP"
                value={newPerson.SpouseCNP}
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
          <p>Are you sure you want to delete this person?</p>
          <p>Details: {`${selectedPerson.CNP} - ${selectedPerson.LastName} ${selectedPerson.FirstName}`}</p>
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

      {/* Search Modal */}
      <Modal show={showSearchPenaltiesModal} onHide={() => setShowSearchPenaltiesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Persons</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Search form */}
          <Form>
          <p>Display all people who have exceeded a number of fines after a certain date.</p>
            <Form.Group controlId="formNumberOfPenalties">
              <Form.Label>Number of Penalties</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter number of penalties"
                name="numberOfPenalties"
                value={searchData.numberOfPenalties}
                onChange={handleSearchInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPenaltyDate">
              <Form.Label>Penalty Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter penalty date"
                name="penaltyDate"
                value={searchData.penaltyDate}
                onChange={handleSearchInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchPenaltiesModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSearchPenalties}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search Properties Modal */}
      <Modal show={showSearchPropertiesModal} onHide={() => setShowSearchPropertiesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Persons with Properties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Search form for properties */}
          <Form>
          <p>Display all people who have properties built after a certain date.</p>
            <Form.Group controlId="formConstructionDate">
              <Form.Label>Construction Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter construction date"
                name="constructionDate"
                value={searchPropertiesData.constructionDate}
                onChange={handleSearchPropertiesInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchPropertiesModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSearchProperties}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search Parent Modal */}
      <Modal show={showSearchByParentBirthPlaceModal} onHide={() => setShowSearchByParentBirthPlaceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Persons by Parent Birth Place</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Search form for parent birth place */}
          <Form>
          <p>Display people whose parents (mother or father) were born in a certain city.</p>
            <Form.Group controlId="formParentBirthPlace">
              <Form.Label>Parent Birth Place</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter parent birth place"
                name="parentBirthPlace"
                value={parentBirthPlaceData.parentBirthPlace}
                onChange={handleParentBirthPlaceInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchByParentBirthPlaceModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSearchByParentBirthPlace}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search by Company Modal */}
      <Modal show={showSearchByCompanyModal} onHide={() => setShowSearchByCompanyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Persons by Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Search form for company */}
          <Form>
          <p>Display all people who work at a company of a certain type, established after a certain date.</p>
            <Form.Group controlId="formCompanyType">
              <Form.Label>Company Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company type"
                name="companyType"
                value={companyData.companyType}
                onChange={handleCompanyInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEstablishmentDate">
              <Form.Label>Establishment Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter establishment date"
                name="establishmentDate"
                value={companyData.establishmentDate}
                onChange={handleCompanyInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchByCompanyModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSearchByCompany}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search Job Modal */}
      <Modal show={showSearchJobModal} onHide={() => setShowSearchJobModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Persons by Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Search form for job */}
          <Form>
          <p>Display people by job type.</p>
            <Form.Group controlId="formJobType">
              <Form.Label>Job Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter job type"
                name="jobType"
                value={searchJobData.jobType}
                onChange={(e) => setSearchJobData((prevData) => ({ ...prevData, jobType: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchJobModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSearchJob}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {loading ? (
        <p>Loading persons...</p>
      ) : error ? (
        <p>Error fetching persons: {error.message}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>CNP</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Birth Place</th>
              <th>Series IC</th>
              <th>Number IC</th>
              <th>Mother CNP</th>
              <th>Father CNP</th>
              <th>Spouse CNP</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => (
              <tr key={person.CNP} onClick={() => handleRowClick(person)}>
                <td>{person.CNP}</td>
                <td>{person.LastName}</td>
                <td>{person.FirstName}</td>
                <td>{person.BirthPlace}</td>
                <td>{person.SeriesIC}</td>
                <td>{person.NumberIC}</td>
                <td>{person.MotherCNP}</td>
                <td>{person.FatherCNP}</td>
                <td>{person.SpouseCNP}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Person;
