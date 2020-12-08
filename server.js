// Importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from "pusher";
import cors from 'cors';

//App Config
const app = express();
const port = process.env.PORT || 8000;

const pusher = new Pusher({
    appId: "1119521",
    key: "522980b97f696c0b67e5",
    secret: "284f5d1d53c75545056f",
    cluster: "eu",
    useTLS: true,
  });

// Middleware
app.use(express.json());
app.use(cors());


// Db config
const connect_url= 'mongodb+srv://admin:UIApWECU0y9xdNe7@cluster0.xairj.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connect_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//??

const db = mongoose.connection;

db.once ('open', () => {
    console.log("db connected");

    const msgCollection = db.collection ('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on ('change', (change) => {
        console.log('a change happened up in this mfer', change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger ('messages', 'inserted', 
            {   name: messageDetails.name,
                message: messageDetails.message,  
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,              
            },
           
            );
        }else{
            console.log('error triggering pusher')
        }

    })

})

// api routes
app.get("/", (req,res) => res.status(200).send('hello damian'))

app.get('/messages/sync', (req,res) => {
    Messages.find ((err,data) => {
        if (err) {
            res.status(500).send(err)            
        }else{
            res.status(200).send(data)
        }
    })
})

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err){
            res.status(500).send(err)
        }else {
            res.status(201).send (data)
        }
    })
})

// Listener
app.listen(port, () => console.log (`Listening on localhost: ${port}`))
