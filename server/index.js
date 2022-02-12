const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors"); // Allow all access data of http on port 4000
const routes = require("./src/routes/routers"); // Import routers from routes

// Connect mongoDB
const database_acc =
  "mongodb+srv://admin_1:LO3XKWfgjASj3E9t@cluster0.ewcuy.mongodb.net/myDatabase?retryWrites=true&w=majority";
mongoose.connect(database_acc, () => console.log("mongoDB is conected"));

app.use(express.json());
app.use(cors());
app.use("/api", routes);

app.listen(4000, () =>
  console.log("mongoDB Atlas sever is running on port 4000")
);
