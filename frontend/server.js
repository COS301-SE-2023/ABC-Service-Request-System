const express = require('express');
const path = require('path');

const fs = require('fs');

function printDirectoryStructure(directory) {
  const files = fs.readdirSync(directory);
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      console.log(`Directory: ${filePath}`);
      printDirectoryStructure(filePath);
    } else {
      console.log(`File: ${filePath}`);
    }
  });
}

const app = express();

app.use(express.static(path.join(__dirname, './dist/project')));

app.get('*', (req, res) => {
  printDirectoryStructure(__dirname);
  res.sendFile(path.resolve(__dirname, './dist/project/index.html'));
});

// default Heroku port
app.listen(process.env.PORT || 5000);
