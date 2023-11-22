const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
let {users, userLastId } = require("../db");

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

router.get("/", function (req, res) {
  res.send({
    status: true,
    data: users,
  });
});

router.get("/:id", function (req, res) {
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

router.post("/", ...createUserSchema, function (req, res) {
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

router.delete("/mass-delete", function (req, res) {
  res.send(req.query.ids);
});

router.delete("/:id", function (req, res) {
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

module.exports.userRouter = router