const express = require('express');
const router = new express.Router();
const axios = require('axios');

const options = require('./options');
const RainbowSDK = require('rainbow-node-sdk');
const timeTolive = 3600;

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient //gives us access to function necessary to connect to DB to perform CRUD
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'RoutingEngineDB'


const rainbowSDK = new RainbowSDK(options);
rainbowSDK.start();
rainbowSDK.events.on('rainbow_onready', function() {
    // do something when the SDK is connected to Rainbow
    console.log('Successfully connected to rainbow NodeSDK')
});


const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 1 // limit each IP to 1 requests per windowMs
});

/* Admin Service - Create Guest Account For User*/
router.post("/", limiter, (req,res) => {
    try{
        rainbowSDK.admin.createAnonymousGuestUser().then((loginCredentials) => {
            console.log("Guest User Account successfully created")
            console.log("Login Credentials:\n" , loginCredentials)
            res.status(200).send(loginCredentials)
        }).catch((error)=>{
            console.log(`Failed to Create Guest Account; Error: ${error}`)
        })

    }catch(error){
        res.status(404).send(error)
        console.log("Creating of Guess Account Failed")
    }
})

// Route to upload new user information to Database
router.post('/users', limiter, (req,res) => {
    const info = req.body
    try{
        MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
            if(error){
                return console.log("Unable to connect to database")
            }
            console.log("Connected to Database successfully!")
        
            const db = client.db(databaseName)
            
            db.collection('user').insertOne({
                info
            }).then((result) => {
                res.status(200).send(info)
            }).catch((error) => {
                console.log(error)
            })
        })
    }catch(error){
        res.status(500).send()
    }
})

module.exports =  router;