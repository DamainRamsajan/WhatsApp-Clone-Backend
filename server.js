// Importing
import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessages.js'

//App Config
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Db config
const connect_url= 'mongodb+srv://admin:UIApWECU0y9xdNe7@cluster0.xairj.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connect_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//??

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
