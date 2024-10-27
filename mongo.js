const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const db_password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const dbName = "phonebook";
const url = `mongodb+srv://engalihaitham:${db_password}@cluster0.rat1u.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
console.log("cd")
const Person = mongoose.model("Person", personSchema, "pb1");

const person = new Person({
  name: name,
  number: number,
});
if (!name && !number) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
});
} else {
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
//aHello