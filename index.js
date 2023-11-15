const express = require('express');
const { query, validationResult, body } = require('express-validator');
const app = express()

// tell express how to parse json objects
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT ?? 8000;

let users = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "123-456-7890",
      gender: "Male",
      email: "john@example.com"
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "987-654-3210",
      gender: "Female",
      email: "jane@example.com"
    },
    {
      id: 3,
      firstName: "Alice",
      lastName: "Johnson",
      phoneNumber: "555-555-5555",
      gender: "Female",
      email: "alice@example.com"
    },
    {
      id: 4,
      firstName: "Bob",
      lastName: "Brown",
      phoneNumber: "777-777-7777",
      gender: "Male",
      email: "bob@example.com"
    },
    {
      id: 5,
      firstName: "Eva",
      lastName: "Garcia",
      phoneNumber: "111-222-3333",
      gender: "Female",
      email: "eva@example.com"
    }
  ];
  let lastId = 5;
  
// register routes
app.get('/', function (req, res) {
    res.send({
        name: "Our first NodeJS API V1.0.0",
    });
})

app.get('/users', function (req, res) {
    res.send({
        status: true,
        data: users
    });
})

app.get('/users/:id', function (req, res) {
    let user = users.find((user) => user.id == req.params.id)
    
    if (!user) {
        res.status(404).send({
            status: false,
            message: "User not found"
        });
    }

    res.send({
        status: true,
        data: user
    });
})


const createUserSchema = [
    body('firstName').isString().notEmpty().isLength({min: 2, max: 60}),
    body('lastName').isString().notEmpty().isLength({min: 2, max: 60}),
    body('phoneNumber').isString().matches(/^0[789][01]\d{8}$/),
    body('gender').isString().notEmpty().isIn(['Male', 'Female']).withMessage("Gender must be either Male or Female"),
    body('email').isEmail().custom((value) => {
        let userFound = users.findIndex((user) => user.email === value);
        return userFound < 0;
      }).withMessage("Email must unique and be a valid email address"),
];
app.post('/users', ...createUserSchema, function (req,res) {
    // validation
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).send({
            status: false,
            errors: result.errors
        })
    }

    // create/register a new user
    let newUser = {...req.body, id: ++lastId};
    users.push(newUser);
   
    res.status(201).send({
        message: "User created",
        status: true,
        data: newUser
    })
})


app.delete('/users/mass-delete', function(req, res) {
    
    res.send(req.query.ids)
})

app.delete('/users/:id', function(req, res) {
    let user = users.find((user) => user.id == req.params.id)
    
    if (!user) {
        res.status(404).send({
            status: false,
            message: "User not found"
        });
        return;
    }

    const newUsers = users.filter((user) => user.id != req.params.id);
    users = newUsers;

    res.status(204).send()
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})