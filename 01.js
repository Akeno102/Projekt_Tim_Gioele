const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Yaz23562',
    database: 'DB_test'
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the CantinaDB.');
});

// Fetch all MenuPlans
app.get('/menuplans', (req, res) => {
    connection.query('SELECT * FROM MenuPlans', (err, results) => {
        if (err) {
            console.error('Error fetching MenuPlans:', err.code);
            res.status(500).send('Error fetching MenuPlans');
            return;
        }
        res.json(results);
    });
});

// Fetch all Dishes
app.get('/dishes', (req, res) => {
    connection.query('SELECT * FROM Dishes', (err, results) => {
        if (err) {
            console.error('Error fetching Dishes:', err.code);
            res.status(500).send('Error fetching Dishes');
            return;
        }
        res.json(results);
    });
});

// Fetch MenuPlans with Dishes
app.get('/menuplans/:id/dishes', (req, res) => {
    const query = `
        SELECT D.* FROM Dishes D
        JOIN MenuPlanDishes MPD ON D.DishID = MPD.DishID
        WHERE MPD.MenuPlanID = ?
    `;
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching Dishes for the MenuPlan:', err.code);
            res.status(500).send('Error fetching Dishes for the MenuPlan');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
