let users = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "123-456-7890",
    gender: "Male",
    email: "john@example.com",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    phoneNumber: "987-654-3210",
    gender: "Female",
    email: "jane@example.com",
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    gender: "Female",
    email: "alice@example.com",
  },
  {
    id: 4,
    firstName: "Bob",
    lastName: "Brown",
    phoneNumber: "777-777-7777",
    gender: "Male",
    email: "bob@example.com",
  },
  {
    id: 5,
    firstName: "Eva",
    lastName: "Garcia",
    phoneNumber: "111-222-3333",
    gender: "Female",
    email: "eva@example.com",
  },
];

let userLastId = 5;
let todos = [
  {
    id: 1,
    title: "Read some codes",
    description: "Saturday is for reading code",
    userId: 1
  },
  {
    id: 2,
    title: "Do Some Laundries",
    description: "Sunday Morning is for movies",
    userId: 2
  },
  {
    id: 3,
    title: "Watch Movies",
    description: "Sunday Evening is for movies",
    userId: 3
  },
];

let todoLastId = 3;

module.exports = {
  users,
  userLastId,
  todos,
  todoLastId,
};
