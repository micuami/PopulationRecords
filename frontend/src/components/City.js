import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const City = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSearchCitiesModal, setShowSearchCitiesModal] = useState(false);
    const [showSearchByCountyInhabitantsModal, setShowSearchByCountyInhabitantsModal] = useState(false);
    const [searchCounty, setSearchCounty] = useState('');
    const [searchInhabitantsThreshold, setSearchInhabitantsThreshold] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchByCountyInhabitants, setSearchByCountyInhabitants] = useState([]);
    const [searchCompaniesByCity, setSearchCompaniesByCity] = useState([]);
    const [showSearchCompaniesByCityModal, setShowSearchCompaniesByCityModal] = useState(false);
    const [searchCityForCompanies, setSearchCityForCompanies] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/city');
      setCities(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCities = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/cities-by-county?countyName=${searchCounty}`);
      setSearchResults(response.data);
      setShowSearchCitiesModal(false);
    } catch (error) {
      console.error('Error searching cities:', error);
    }
  };

  const handleSearchByCountyInhabitants = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/counties-by-inhabitants?countyName=${searchCounty}&inhabitantsThreshold=${searchInhabitantsThreshold}`);
      setSearchByCountyInhabitants(response.data);
    } catch (error) {
      console.error('Error searching counties by inhabitants:', error);
    } finally {
      setShowSearchByCountyInhabitantsModal(false);
    }
  };

  const handleSearchCompaniesByCity = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/companies-by-city?cityName=${searchCityForCompanies}`);
      setSearchCompaniesByCity(response.data);
    } catch (error) {
      console.error('Error searching companies by city:', error);
    } finally {
      setShowSearchCompaniesByCityModal(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      <Button variant="primary" size="lg" onClick={() => setShowSearchCitiesModal(true)} className="person-button">
        Search Cities
      </Button>
      <Button variant="info" size="lg" onClick={() => setShowSearchByCountyInhabitantsModal(true)} className="person-button">
        Search Inhabitants Number
      </Button>
      <Button variant="success" size="lg" onClick={() => setShowSearchCompaniesByCityModal(true)} className="person-button">
        Search Streets
      </Button>

      {/* Modal for searching cities */}
      <Modal show={showSearchCitiesModal} onHide={() => setShowSearchCitiesModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Search Cities</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
              <p>Display all the cities in a county.</p>
                <Form.Group controlId="formCounty">
                  <Form.Label>County Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter county name"
                    value={searchCounty}
                    onChange={(e) => setSearchCounty(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowSearchCitiesModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSearchCities}>
                Search
              </Button>
            </Modal.Footer>
          </Modal>

      {/* Modal for searching counties by inhabitants */}
      <Modal show={showSearchByCountyInhabitantsModal} onHide={() => setShowSearchByCountyInhabitantsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Counties by Inhabitants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <p>Display all counties with a number of inhabitants greater than a certain number.</p>
            <Form.Group controlId="formCountyInhabitants">
              <Form.Label>County Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter county name"
                value={searchCounty}
                onChange={(e) => setSearchCounty(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formInhabitantsThreshold">
              <Form.Label>Inhabitants Threshold</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter inhabitants threshold"
                value={searchInhabitantsThreshold}
                onChange={(e) => setSearchInhabitantsThreshold(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchByCountyInhabitantsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSearchByCountyInhabitants}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for searching city */}
      <Modal show={showSearchCompaniesByCityModal} onHide={() => setShowSearchCompaniesByCityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Companies by City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <p>Display streets from a certain city.</p>
            <Form.Group controlId="formCityForCompanies">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city name"
                value={searchCityForCompanies}
                onChange={(e) => setSearchCityForCompanies(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSearchCompaniesByCityModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSearchCompaniesByCity}>
            Search
          </Button>
        </Modal.Footer>
      </Modal>

      {loading ? (
        <p>Loading cities...</p>
      ) : error ? (
        <p>Error fetching cities: {error.message}</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Inhabitants</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.CityID}>
                  <td>{city.Name}</td>
                  <td>{city.Inhabitants}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Display search results */}
          {searchResults.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Inhabitants</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((city) => (
                  <tr key={city.CityID}>
                    <td>{city.Name}</td>
                    <td>{city.Inhabitants}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

        {/* Display search results for counties by inhabitants */}
        {searchByCountyInhabitants.length > 0 && (
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {searchByCountyInhabitants.map((county) => (
                <tr key={county.CountyID}>
                    <td>{county.Name}</td>
                </tr>
                ))}
            </tbody>
            </Table>
        )}

        {/* Display search results for companies by city */}
        {searchCompaniesByCity.length > 0 && (
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Street</th>
                </tr>
            </thead>
            <tbody>
                {searchCompaniesByCity.map((company) => (
                <tr key={company.Street}>
                    <td>{company.Street}</td>
                </tr>
                ))}
            </tbody>
            </Table>
        )}
        </>
      )}
    </div>
  );
};

export default City;
