const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, './dist/project')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/project/index.html'));
});

// default Heroku port
app.listen(process.env.PORT || 5000);
