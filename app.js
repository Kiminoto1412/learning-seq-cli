//ให้ใส่บรรทัดแรกที่เริ่มproject เสมอ มันจะloadทุกสิ่งทุกอย่างใน File: .env มาให้
require("dotenv").config();
console.log(process.env); //process เป็นเหมือนglobal onjectที่เรียกใช้ตรงไหนก็ได้

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
app.use("/todos", authenticate, todoRoute);

//REST AOI: hadle resource Users
//CRETAE, UPDATE
app.use("/users", userRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

// const port = 8003;
const port = process.env.PORT || 8000; //ตั้งdefault port ไว้ให้เป็น8000 ถ้าหาportใน .envไม่เจอ
app.listen(port, () => console.log("server running on port" + port));
