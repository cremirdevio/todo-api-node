require('dotenv').config();

const express = require("express");
const { query, validationResult, body } = require("express-validator");
const {users, userLastId, todos, todoLastId } = require("./db");
const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.static('public'))

// tell express how to parse json objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// file, console | mode: 'file', 'console'
const logger = function (options = { mode: 'file'}) {
    return function(req, res, next) {
        console.log(`New Request [mode: ${options.mode}] - Method: ${req.method} | URL: ${req.url} | IP Address: ${req.ip}`);
        next();
    }
}

app.use(logger({ mode: 'console' }));

// register routes
app.get("/", function (req, res) {
  res.send(`
    <html>
        <head>
            <meta name="twitter:image" content="/og-image.png" inertia="twitter:image">
            <link rel="stylesheet" href="style.css">
            <title>Todo App</title>
        </head>
        <input />
        <b>hello world!</b>
    </html>
  `);
});


app.get("/users", function (req, res) {
  res.send({
    status: true,
    data: users,
  });
});

app.get("/users/:id", function (req, res) {
  let user = users.find((user) => user.id == req.params.id);

  if (!user) {
    res.status(404).send({
      status: false,
      message: "User not found",
    });
  }

  res.send({
    status: true,
    data: user,
  });
});

const createUserSchema = [
  body("firstName").isString().notEmpty().isLength({ min: 2, max: 60 }),
  body("lastName").isString().notEmpty().isLength({ min: 2, max: 60 }),
  body("phoneNumber")
    .isString()
    .matches(/^0[789][01]\d{8}$/),
  body("gender")
    .isString()
    .notEmpty()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be either Male or Female"),
  body("email")
    .isEmail()
    .custom((value) => {
      let userFound = users.findIndex((user) => user.email === value);
      return userFound < 0;
    })
    .withMessage("Email must unique and be a valid email address"),
];

app.post("/users", ...createUserSchema, function (req, res) {
  // validation
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).send({
      status: false,
      errors: result.errors,
    });
  }

  // create/register a new user
  let newUser = { ...req.body, id: ++userLastId };
  users.push(newUser);

  res.status(201).send({
    message: "User created",
    status: true,
    data: newUser,
  });
});

app.delete("/users/mass-delete", function (req, res) {
  res.send(req.query.ids);
});

app.delete("/users/:id", function (req, res) {
  let user = users.find((user) => user.id == req.params.id);

  if (!user) {
    res.status(404).send({
      status: false,
      message: "User not found",
    });
    return;
  }

  const newUsers = users.filter((user) => user.id != req.params.id);
  users = newUsers;

  res.status(204).send();
});

const createTodoSchema = [
  body("title").isString().notEmpty(),
  body("description").isString().notEmpty(),
];

app.get("/", (req, res) => {
  res.send("<h1>Todo demo home</h1>");
});

app.get("/users/:id/todos", (req, res) => {
    console.log(req.headers);
    const usersTodos = todos.filter((todo) => req.params.id == todo.userId);
    
  res.send({ status: true, data: usersTodos });
});

app.get("/users/:userId/todos/:id", (req, res) => {
  let todo = todos.find((todo) => todo.id == req.params.id && todo.userId == req.params.userId);

  if (! todo) return res.status(400).send({
    status: false,
    message: 'Not found',
  });

  res.send({ status: true, data: todo });
});

app.post("/todos", createTodoSchema, function (req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).send({
      status: false,
      errors: result.errors,
    });
    return;
  }

  let newTodo = { ...req.body, id: ++todoLastId };
  todos.push(newTodo);

  res.status(201).send({
    message: "Todo Created",
    status: true,
    data: newTodo,
  });
});

app.delete("/todos/:id", (req, res) => {
  let todo = todos.find((todo) => todo.id == req.params.id);
  if (!todo) {
    res.status(400).send({
      status: false,
      message: "Todo not found",
    });
    return;
  }

  const filteredTodo = todos.filter((todo) => todo.id != req.params.id);
  todos = filteredTodo;
  console.log(todos);
  res.status(204).send();
});

app.put("/todos/:id", createTodoSchema, (req, res) => {
  console.log("Received PUT request with ID:", req.params.id);
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).send({
      status: false,
      errors: result.errors,
    });
    return;
  }

  const todoIndex = todos.findIndex((todo) => todo.id == req.params.id);

  if (todoIndex === -1) {
    res.status(404).send({
      status: false,
      message: "Todo not found",
    });
    return;
  }

  todos[todoIndex] = { ...todos[todoIndex], ...req.body };

  res.status(200).send({
    message: "Todo Updated",
    status: true,
    data: todos[todoIndex],
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
