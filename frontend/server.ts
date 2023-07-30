import express from "express";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, '/dist/project')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/dist/project/index.html'));
});

app.listen(5000);
