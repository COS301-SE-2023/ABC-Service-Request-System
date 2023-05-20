// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();

// const uri = "mongodb+srv://hyperiontechcapstone:Jetpad2023@cluster0.ki6ifk0.mongodb.net/?retryWrites=true&w=majority";

// async function connect(){
//     try{
//         await mongoose.connect(uri);
//         console.log("connected to mongo");
//     }
//     catch(error){
//         console.log(error);
//     }
// }

// connect();

// // Define your API routes
// app.get('/api/data', (req, res) => {
//   // Handle the API request and send a response
//   res.json({ message: 'Hello from the backend!' });
// });

// // Start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const uri = process.env.MONGODB_URI || "mongodb+srv://hyperiontechcapstone:mongodb+srv://hyperiontechcapstone:@Jetpad2023@cluster0.ki6ifk0.mongodb.net/?retryWrites=true";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

connect();

// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist/project')));

// API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Catch-all route for Angular routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/project', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
