import React, { useContext } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar/Navbar';
import Person from './components/Person';
import Penalty from './components/Penalty';
import City from './components/City';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoggedInContext } from './context';

function App() {
  const { isLoggedIn } = useContext(LoggedInContext);

  return (
    <div className="App">
      
      <BrowserRouter>
        <Navbar />
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/person" element={<Person />} />
              <Route path="/penalty" element={<Penalty />} />
              <Route path="/city" element={<City />} />
            </>
          ) : (
            <Route path="/" element={<Login />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
