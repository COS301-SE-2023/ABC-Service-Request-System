const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, './dist/project')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/project/index.html'));
});

// default Heroku port
app.listen(process.env.PORT || 5000);
