const express = require('express');
const mongoose = require('mongoose');
const app = express();

const uri = "mongodb+srv://hyperiontechcapstone:Jetpad2023@cluster0.ki6ifk0.mongodb.net/?retryWrites=true&w=majority";

async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("connected to mongo");
    }
    catch(error){
        console.log(error);
    }
}

connect();

// Define your API routes
app.get('/api/data', (req, res) => {
  // Handle the API request and send a response
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
