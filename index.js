const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const port = process.env.VITE_PORT || 3003;
const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("dist"));
app.use(express.json());

let persons = [
  { name: "Arto Hellas", number: "040-123456", id: "1" },
  { name: "s Lovelace", number: "39-44-5323523", id: "2" },
  { name: "Dan Abramov", number: "12-43-234345", id: "3" },
  { name: "Mary Poppendieck", number: "39-23-6423122", id: "4" },
];

//=========== get all persons ============
app.get("/api/persons", (req, res) => {
  res.json(persons);
  console.log("Fetched all persons.");
});

//=========== get person by ID ============
app.get("/api/person/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: "Person with this ID not found" });
  }
});

//=========== delete person by ID ============
app.delete("/api/person/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

//=========== add person ============
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;
  return (maxId + 1).toString(); // Convert to string to maintain consistent ID type
};

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  console.log("Received new person:", req.body);

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }

  const personExists = persons.some((person) => person.name === name);
  if (personExists) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    id: generateId(),
    name,
    number,
  };

  persons = [...persons, newPerson];
  res.status(201).json(newPerson); // Use status 201 for created resources
});

//=========== listen to port ============
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
