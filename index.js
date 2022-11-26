const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2wxfltx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const categoriesCollection = client.db('assignmentTwelve').collection('categories');
        const allproduct = client.db('assignmentTwelve').collection('allproduct');
        const bookingsCollection = client.db('assignmentTwelve').collection('bookings');


        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            console.log(categories)
            res.send(categories);
        });


        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { category: id };
            const products = await allproduct.find(query).toArray();
            res.send(products);
        });

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking)
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })



    }
    finally {

    }
}

run().catch(console.log)


















app.get('/', async (req, res) => {
    res.send('assignment twelve server-side is running')
});

app.listen(port, () => console.log(`assignment twelve server running ${port}`))