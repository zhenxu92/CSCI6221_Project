"use strict";

let mongo=require('mongodb');
let client=mongo.MongoClient;
let _db;

module.exports={
    connect(){
        client.connect('mongodb://localhost:40000/homeless',(err,db)=>{
            if(err){
                console.log("Error connecting to Mongo - check mongod connection");
                process.exit(1);
            }

            _db=db;
            console.log("Connected to Mongo");


        });
    },
    people(){
        return _db.collection('people');

    },
    organizations(){
        return _db.collection('organizations');
    }
};