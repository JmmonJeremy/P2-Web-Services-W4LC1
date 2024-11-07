const express = require('express');
const routes = express.Router();
const path = require('path');

// Static Routes
// Set up "public" folder / subfolders for static files
routes.use(express.static("public"));
routes.use("/css", express.static(__dirname + "public/css"));
routes.use("/js", express.static(__dirname + "public/js"));
routes.use("/images", express.static(__dirname + "public/images"));
routes.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = routes;