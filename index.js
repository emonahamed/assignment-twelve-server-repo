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
        const usersCollection = client.db('assignmentTwelve').collection('users');



        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            console.log(categories)
            res.send(categories);
        });

        app.post('/allproduct', async (req, res) => {
            const product = req.body;
            const result = await allproduct.insertOne(product);
            res.send(result)
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

            const updateProduct = await allproduct.updateOne(
                { _id: ObjectId(booking.productId) },
                { $set: { isBooked: true } },
                { upsert: true }
            )

            console.log(updateProduct)
            res.send(result);
        })


        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updateReview = {
                $set: {
                    isAdvertise: true,
                }
            }
            const result = await allproduct.updateOne(filter, updateReview, option)
            res.send(result)
        })



        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        });

        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const products = await allproduct.find(query).toArray();
            res.send(products);
        });


        app.get('/users', async (req, res) => {
            const query = { role: "user" };
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' })
        })

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' })
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await allproduct.deleteOne(filter);
            res.send(result);
        })



        app.get('/advertise', async (req, res) => {
            // const isAdvertise = req.query.isAdvertise;
            const query = { isAdvertise: true };
            const products = await allproduct.find(query).toArray();
            res.send(products);
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })


        app.get('/sellers', async (req, res) => {
            const query = { role: "seller" };
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

        app.delete('/sellers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
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