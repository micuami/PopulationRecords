const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON cerere


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "populationrecords"
});

db.connect( (error) => {
    if(error) {
        console.log(error);
    } else {
        console.log("MySQL Connected...")
    }
})

// Endpoint login
app.post("/", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    const values = [username, password];
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).json({ error: "Error during login" });
        }
        if (results.length > 0) {
            return res.status(200).json({ message: "Login successful" });
        } else {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    });
});


// Select persoane
app.get("/person", (req, res) => {
    const sql = "SELECT * FROM person";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching persons" });
        return res.json(data);
    });
});

// Insert persoana
app.post("/person", (req, res) => {
    const { CNP, LastName, FirstName, BirthPlace, ResidenceID, SeriesIC, NumberIC, MotherCNP, FatherCNP, SpouseCNP } = req.body;
    const sql = "INSERT INTO person (CNP, LastName, FirstName, ResidenceID, BirthPlace, SeriesIC, NumberIC, MotherCNP, FatherCNP, SpouseCNP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [CNP, LastName, FirstName, ResidenceID, BirthPlace, SeriesIC, NumberIC, MotherCNP, FatherCNP, SpouseCNP];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing insert query:', err);
            return res.status(500).json({ error: "Error inserting data" });
        }
        console.log('Data inserted successfully');
        return res.status(200).json({ message: "Data inserted successfully" });
    });
});

// Update persoana
app.put("/person/:CNP", (req, res) => {
    const { LastName, FirstName, BirthPlace, ResidenceID, SeriesIC, NumberIC, MotherCNP, FatherCNP, SpouseCNP } = req.body;
    const CNP = req.params.CNP;

    const sql = "UPDATE person SET LastName=?, FirstName=?, ResidenceID=?, BirthPlace=?, SeriesIC=?, NumberIC=?, MotherCNP=?, FatherCNP=?, SpouseCNP=? WHERE CNP=?";
    const values = [LastName, FirstName, ResidenceID, BirthPlace, SeriesIC, NumberIC, MotherCNP, FatherCNP, SpouseCNP, CNP];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing update query:', err);
            return res.status(500).json({ error: "Error updating data" });
        }
        console.log('Data updated successfully');
        return res.status(200).json({ message: "Data updated successfully" });
    });
});

// Delete persoana
app.delete("/person/:CNP", (req, res) => {
    const CNP = req.params.CNP;

    const sql = "DELETE FROM person WHERE CNP=?";
    const values = [CNP];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing delete query:', err);
            return res.status(500).json({ error: "Error deleting data" });
        }
        console.log('Data deleted successfully');
        return res.status(200).json({ message: "Data deleted successfully" });
    });
});

// Select amenzi
app.get("/penalty", (req, res) => {
    const sql = "SELECT * FROM penalty";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching penalties" });
        return res.json(data);
    });
});

// Insert amenda
app.post("/penalty", (req, res) => {
    const { CNP, Type, Date, Price } = req.body;
    const sql = "INSERT INTO penalty (CNP, Type, Date, Price) VALUES (?, ?, ?, ?)";
    const values = [CNP, Type, Date, Price];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing insert query:', err);
            return res.status(500).json({ error: "Error inserting data" });
        }
        console.log('Data inserted successfully');
        return res.status(200).json({ message: "Data inserted successfully" });
    });
});

// Update amenda
app.put("/penalty/:PenaltyID", (req, res) => {
    const { CNP, Type, Date, Price } = req.body;
    const PenaltyID = req.params.PenaltyID;

    const sql = "UPDATE penalty SET CNP=?, Type=?, Date=?, Price=? WHERE PenaltyID=?";
    const values = [CNP, Type, Date, Price, PenaltyID];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing update query:', err);
            return res.status(500).json({ error: "Error updating data" });
        }
        console.log('Data updated successfully');
        return res.status(200).json({ message: "Data updated successfully" });
    });
});

// Delete amenda
app.delete("/penalty/:PenaltyID", (req, res) => {
    const PenaltyID = req.params.PenaltyID;

    const sql = "DELETE FROM penalty WHERE PenaltyID=?";
    const values = [PenaltyID];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing delete query:', err);
            return res.status(500).json({ error: "Error deleting data" });
        }
        console.log('Data deleted successfully');
        return res.status(200).json({ message: "Data deleted successfully" });
    });
});

// Endpoint pentru afisarea tuturor amenzilor luate la o anumita data intr-un anumit oras
app.get("/penalties-by-city-and-date", async (req, res) => {
    const { cityName, penaltyDate } = req.query;
  
    // Validation of parameters
    if (!cityName || !penaltyDate) {
      return res.status(400).json({ error: "City name and penalty date parameters are required" });
    }
  
    const sql = `
      SELECT P.PenaltyID, P.CNP, P.Type, P.Date, P.Price
      FROM penalty P
      JOIN person PR ON P.CNP = PR.CNP
      JOIN adress A ON PR.ResidenceID = A.AdressID
      JOIN city C ON C.CityID = A.CityID
      WHERE C.Name = ? AND P.Date = ?;
    `;
  
    const values = [cityName, penaltyDate];
  
    db.query(sql, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching penalties by city and date" });
      }
      return res.json(data);
    });
  });

// Endpoint pentru afisarea amenzilor angajatilor de la o anumita companie
app.get("/penalties-by-company-name", async (req, res) => {
  const { companyName } = req.query;

  // Validation of the companyName parameter
  if (!companyName) {
    return res.status(400).json({ error: "Company name parameter is missing" });
  }

  const sql = `
    SELECT P.PenaltyID, P.CNP, P.Type, P.Date, P.Price
    FROM penalty P
    JOIN person PR ON P.CNP = PR.CNP
    JOIN employee E ON E.CNP = PR.CNP
    JOIN company C ON C.CompanyID = E.CompanyID
    WHERE C.Name = ?;
  `;

  const values = [companyName];

  db.query(sql, values, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching penalties by company name" });
    }
    return res.json(data);
  });
});

// Endpoint pentru afisarea tuturor persoanelor care au depasit un numar de amenzi dupa o anumita data
app.get("/persons-with-penalties", (req, res) => {
    const { numberOfPenalties, penaltyDate } = req.query;

    // Validare parametri
    if (!numberOfPenalties || !penaltyDate) {
        return res.status(400).json({ error: "Parametri insuficienți sau invalizi" });
    }

    const sql = `
    SELECT *
    FROM person PR
    WHERE EXISTS (
        SELECT 1
        FROM penalty P
        WHERE PR.CNP = P.CNP
        AND P.Date > ?
        HAVING COUNT(DISTINCT P.PenaltyID) >= ?
    );
    `;

    const values = [penaltyDate, numberOfPenalties];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Parametri insuficienți sau invalizi" });
        return res.json(data);
    });
});

// Endpoint pentru afisarea tuturor persoanelor care au proprietăți construite după o anumită dată
app.get("/persons-with-properties", (req, res) => {
    const { constructionDate } = req.query;

    // Validare parametri
    if (!constructionDate) {
        return res.status(400).json({ error: "Parametri insuficienți sau invalizi" });
    }

    const sql = `
        SELECT *
        FROM person PR
        JOIN proprietor P ON PR.CNP = P.ProprietorCNP
        JOIN property R ON P.PropertyID = R.PropertyID
        WHERE EXISTS (
            SELECT R2.PropertyID
            FROM property R2
            WHERE R2.PropertyID = R.PropertyID AND R2.ConstructionDate > ?
        );
    `;

    const values = [constructionDate];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching persons with properties" });
        return res.json(data);
    });
});

// Endpoint pentru afisarea persoanelor al caror parinte (mama sau tatal) s-a nascut intr-un anumit oras
app.get("/persons-by-parent-birthplace", (req, res) => {
    const { parentBirthPlace } = req.query;

    // Validare parametru
    if (!parentBirthPlace) {
        return res.status(400).json({ error: "Parametru insuficient sau invalid" });
    }

    const sql = `
        SELECT *
        FROM person PR1
        WHERE (
            SELECT PR2.BirthPlace
            FROM person PR2
            WHERE PR2.CNP = PR1.MotherCNP OR PR2.CNP = PR1.FatherCNP
        ) = ?;
    `;

    const values = [parentBirthPlace];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Eroare la extragerea persoanelor" });
        return res.json(data);
    });
});

// Endpoint pentru afisarea persoanelor care lucreaza la o companie de un anume tip, infiintata dupa o anume data
app.get("/persons-with-established-companies", (req, res) => {
    const { companyType, establishmentDate } = req.query;

    const sql = `
    SELECT *
    FROM person PR
    JOIN employee E ON PR.CNP = E.CNP
    JOIN company C ON E.CompanyID = C.CompanyID
    WHERE (
        SELECT C.EstablishmentDate
        FROM company C
        WHERE C.Type = ?
            AND C.CompanyID = E.CompanyID  
    ) > ?;
    `;

    const values = [companyType, establishmentDate];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching persons with established companies" });
        return res.json(data);
    });
});

// Endpoint for searching persons by job type
app.get("/persons-by-job", async (req, res) => {
    const { jobType } = req.query;
  
    // Validation of the jobType parameter
    if (!jobType) {
      return res.status(400).json({ error: "Job type parameter is missing" });
    }
  
    const sql = `
      SELECT *
      FROM person PR
      JOIN employee E ON PR.CNP = E.CNP
      WHERE E.Job = ?;
    `;
  
    const values = [jobType];
  
    db.query(sql, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching persons by job type" });
      }
      return res.json(data);
    });
  });

// Select orase
app.get("/city", (req, res) => {
    const sql = "SELECT * FROM city";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching persons" });
        return res.json(data);
    });
});

// Endpoint pentru afisarea tuturor oraselor dintr-un judet
app.get("/cities-by-county", (req, res) => {
    const { countyName } = req.query;

    // Validating the parameter
    if (!countyName) {
        return res.status(400).json({ error: "County name parameter is missing" });
    }

    const sql = `
        SELECT C.CityID, C.Name, C.CountyID, C.Inhabitants
        FROM city C
        JOIN county CO ON C.CountyID = CO.CountyID
        WHERE CO.Name = ?;
    `;

    const values = [countyName];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error executing cities query:', err);
            return res.status(500).json({ error: "Error fetching cities" });
        }
        return res.json(data);
    });
});

// Endpoint pentru afisarea tuturor judetelor cu un numar de locuitori mai mare decat un anumit numar
app.get("/counties-by-inhabitants", (req, res) => {
    const { countyName, inhabitantsThreshold } = req.query;

    // Validating the parameters
    if (!countyName || isNaN(inhabitantsThreshold)) {
        return res.status(400).json({ error: "Invalid or missing parameters" });
    }

    const sql = `
        SELECT C.CountyID, C.Name
        FROM county C
        JOIN city CY ON C.CountyID = CY.CountyID
        WHERE C.Name = ? 
        GROUP BY C.CountyID, C.Name
        HAVING SUM(CY.Inhabitants) > ?;
    `;

    const values = [countyName, inhabitantsThreshold];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error executing counties by inhabitants query:', err);
            return res.status(500).json({ error: "Error searching counties by inhabitants" });
        }
        return res.json(data);
    });
});

// Endpoint pentru afisarea strazilor dintr-un anumit oras
app.get("/companies-by-city", (req, res) => {
    const { cityName } = req.query;

    // Validating the parameter
    if (!cityName) {
        return res.status(400).json({ error: "City name parameter is missing" });
    }

    const sql = `
        SELECT Street
        FROM adress A
        JOIN city CY ON A.CityID = CY.CityID
        WHERE CY.Name = ?;
    `;

    const values = [cityName];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error executing companies by city query:', err);
            return res.status(500).json({ error: "Error searching companies by city" });
        }
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Listening on port 8081...");
});
