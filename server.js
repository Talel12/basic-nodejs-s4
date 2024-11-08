const express = require('express')
const mongoose = require("mongoose");
const Item = require("./models/Item");
const app = express()
const port = 3001
require('dotenv').config()

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const calculate = require('./calculate')

// "mongodb://localhost:27018/mydb" => connect from my host directly [use localhost & host-port].....
// "mongodb://mongodb-service:27017/mydb"  => connect from an other container in the same network [use service-name & container-port]

mongoose
    .connect(process.env.DB_HOST, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log("Error = ", err));


app.get('/', (req, res) => {
    res.status(200).send("Hello Devops ...")
})


app.get('/test', (req, res) => {
    res.status(200).send("This is a test ...")
})

app.get("/items", (req, res) => {
    Item.find()
        .then((items) => res.send({ items }))
        .catch((err) => res.status(500).json({ err }));
});

app.post("/items/add", (req, res) => {
    const newItem = new Item({
        name: req.body.name,
    });

    newItem
        .save()
        .then((item) => res.send({ message: "item saved successfully", item }))
        .catch((err) => res.status(500).json({ err }));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})