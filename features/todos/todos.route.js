const express = require("express");
const {
    body
} = require("express-validator");
const router = express.Router();
let {todos, todoLastId } = require("../../db");

const createTodoSchema = [
    body("title").isString().notEmpty(),
    body("description").isString().notEmpty(),
];

router.get("/users/:id/todos", (req, res) => {
    console.log(req.headers);
    const usersTodos = todos.filter((todo) => req.params.id == todo.userId);

    res.send({
        status: true,
        data: usersTodos
    });
});

router.get("/users/:userId/todos/:id", (req, res) => {
    let todo = todos.find((todo) => todo.id == req.params.id && todo.userId == req.params.userId);

    if (!todo) return res.status(400).send({
        status: false,
        message: 'Not found',
    });

    res.send({
        status: true,
        data: todo
    });
});

router.post("/todos", createTodoSchema, function (req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).send({
            status: false,
            errors: result.errors,
        });
        return;
    }

    let newTodo = {
        ...req.body,
        id: ++todoLastId
    };
    todos.push(newTodo);

    res.status(201).send({
        message: "Todo Created",
        status: true,
        data: newTodo,
    });
});

router.delete("/todos/:id", (req, res) => {
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

router.put("/todos/:id", createTodoSchema, (req, res) => {
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

    todos[todoIndex] = {
        ...todos[todoIndex],
        ...req.body
    };

    res.status(200).send({
        message: "Todo Updated",
        status: true,
        data: todos[todoIndex],
    });
});

router.post("/users/:userId/todos", createTodoSchema, function (req, res) {
    console.log(req.params.userId);
    const result = validationResult(req);
    let userId = req.params.userId;

    if (!result.isEmpty()) {
        res.status(400).send({
            status: false,
            errors: result.errors,
        });
        return;
    }

    let newTodo = {
        ...req.body,
        id: ++todoLastId,
        userId,
    };
    todos.push(newTodo);

    res.status(201).send({
        message: "Todo Created",
        status: true,
        data: newTodo,
    });
});

router.delete("/users/:userId/todos/:id", (req, res) => {
    let todo = todos.find(
        (todo) => todo.id == req.params.id && req.params.userId == todo.userId
    );
    if (!todo) {
        res.status(400).send({
            status: false,
            message: "Todo not found",
        });
        return;
    }

    const filteredTodo = todos.filter((todo) => todo.id != req.params.id);
    todos = filteredTodo;
    res.status(204).send();
});

router.put("/users/:useId/todos/:id", createTodoSchema, (req, res) => {
    console.log("Received PUT request with ID:", req.params.id);
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).send({
            status: false,
            errors: result.errors,
        });
        return;
    }

    const todoIndex = todos.findIndex(
        (todo) => todo.id == req.params.id && todo.userId == req.params.userId
    );

    if (todoIndex === -1) {
        res.status(404).send({
            status: false,
            message: "Todo not found",
        });
        return;
    }

    todos[todoIndex] = {
        ...todos[todoIndex],
        ...req.body
    };

    res.status(200).send({
        message: "Todo Updated",
        status: true,
        data: todos[todoIndex],
    });
});

module.exports.todoRouter = router