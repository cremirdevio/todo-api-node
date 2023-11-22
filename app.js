require('dotenv').config();

const express = require("express");
const { userRouter } = require('./features/users/users.route');
const { todoRouter } = require('./features/todos/todos.route');
const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const logger = function (options = { mode: 'file'}) {
//     return function(req, res, next) {
//         console.log(`New Request [mode: ${options.mode}] - Method: ${req.method} | URL: ${req.url} | IP Address: ${req.ip}`);
//         next();
//     }
// }
// app.use(logger({ mode: 'console' }));

app.get("/", function (req, res) {
  res.send({
    message: 'Hello world!'
  });
});

app.use('/users', userRouter)
app.use('/', todoRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});