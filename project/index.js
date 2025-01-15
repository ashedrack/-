const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database
let users = [];
let idCounter = 1;

// Routes
// Create a user
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    const user = { id: idCounter++, name, email };
    users.push(user);
    res.status(201).json(user);
});

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
});

// Update a user
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;

    res.json(user);
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found.' });
    }

    users.splice(userIndex, 1);
    res.status(204).send();
});

// Serve favicon (to suppress GET /favicon.ico errors)
app.get('/favicon.ico', (req, res) => res.status(204).send());

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
