const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const routes = require("../routes/index.routes");
const BASE_URL = "/api/v1";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  `${BASE_URL}/uploads`,
  express.static(path.join(__dirname, "..", "uploads"))
);

app.use(`${BASE_URL}`, routes);

module.exports = app;
