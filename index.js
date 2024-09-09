const express = require("express");
require('dotenv').config();
const {seque,connect} = require("./config/db");
const utilisateur = require("./routes/utilisateur/utilisateurRoutes");
const demande = require("./routes/demande/demandeRoutes");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.use('/api/utilisateur',utilisateur);
app.use('/api/demande',demande);
connect();
seque.sync().then(() =>{
    app.listen(port, ()=>{
        console.log(`Application demarré sur le port: ${port}`);
    })
}).catch((error)=>{
    console.log('Erreur lors du demarage: ',error);
});