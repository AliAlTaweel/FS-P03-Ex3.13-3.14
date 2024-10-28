
require("dotenv").config(); // Ensure this is called as a function
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors"); // Uncomment this to use CORS
const newPerson = require('./models/phonebook')


const app = express();
const PORT = process.env.VITE_PORT || 3003;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static("dist"));
app.use(morgan("tiny")); // Use morgan logging middleware for requests


// Get all persons
app.get("/api/persons", (req, res) => {
  newPerson.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      res.status(500).json({ error: "Could not retrieve persons" });
    });
});

// Get info about persons
app.get('/api/info', async (req, res) => {
  const persons = await Note.find({});
  res.send(`persons has info for ${persons.length} persons <br/><br/>${new Date()}.`);
});

// Get note by ID
app.get('/api/persons/:id', (req, res) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ error: 'No such note!' });
      }
    })
    .catch((error) => res.status(400).json({ error: 'Malformatted ID' }));
});

// Delete note by ID
app.delete('/api/persons/:id', (req, res) => {
  newPerson.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => res.status(400).json({ error: 'Malformatted ID' }));
});

// Generate a new ID
const generateId = () => {
  const maxId =
    Note.length > 0 ? Math.max(...Note.map((note) => note.id)) : 0;
  return maxId + 1;
};

// Create a new note
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required!' });
  }

  const newNum = new newPerson({
    name,
    number,
  });

  newNum.save()
    .then((savedNote) => res.status(201).json(savedNote))
    .catch((error) => res.status(400).json({ error: 'Error saving person' }));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
