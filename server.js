const ObjectID = require('mongodb').ObjectID;

const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())
app.set('port', 3000);


const MongoClient = require('mongodb').MongoClient;
const path = require("path");
const fs = require("fs");

let db;
MongoClient.connect('mongodb+srv://SyedSalman:Thedarkknight01@gettingstarted.hgg5baw.mongodb.net', (err, client) => {
    db = client.db('Coursework_2_Database')
})

app.use("/",function(request, response, next) {
    console.log("In comes a " + request.method + " to " + request.url);
    next();
    });

app.get('/', (req, res, next) => {
    res.send('Select a collection')
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

app.post('/collection/:collectionName', (req, res, next) => {  
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)    
        res.send(results.ops)
      })
    })

app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.updateOne(
        {_id: new ObjectID(req.params.id)},
        {$set: req.body},
        {safe: true, multi: false},
        (e, result) => {
            if (e) return next(e)
            res.send((result) ? {msg: 'success'} : {msg: 'error'})
})
})

app.get('/collection/:collectionName/:id', function(req, res) {
  const query = req.query.query;
  const collection = db.collection('lessons');

  collection.find({topic: {$regex: `.*${query}.*`, $options: 'i'}})
            .toArray(function(err, docs) {
    res.json(docs);
  });
});



app.listen(3000, () => {
    console.log('Express.js server localhost 3000')
})