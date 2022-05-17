const express = require("express");

const todoRoute = require("./routes/todoRoute");
const userRoute = require("./routes/userRoute");
const notFoundMiddleware = require("./middlewares/notfound");
const errorMiddleware = require("./middlewares/error");
const { authenticate } = require("./middlewares/authenticate");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//REST API: handle resource Todo
//CREATE, UPDATE, DELETE, GETALL, GETBYID
app.use("/todos",authenticate, todoRoute);

//REST AOI: hadle resource Users
//CRETAE, UPDATE
app.use("/users", userRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = 8003;
app.listen(port, () => console.log("server running on port" + port));
