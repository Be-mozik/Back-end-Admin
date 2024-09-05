const express = require("express");
const utilisateur = require("./routes/utilisateur/utilisateurRoutes");
require('dotenv').config();
const {seque,connect} = require("./config/db");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api/utilisateur',utilisateur);

connect();
seque.sync().then(() =>{
    app.listen(port, ()=>{
        console.log(`Application demarré sur le port: ${port}`);
    })
}).catch((error)=>{
    console.log('Erreur lors du demarage: ',error);
});