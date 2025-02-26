const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pg5idq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const dataBase = client.db("wood-wonders")

        const userCollection = dataBase.collection("users");
        const itemsCollection = dataBase.collection('items');
        const categoryItems = dataBase.collection("category-items");

        app.get('/myitem/:email', async (req, res) => {
            const result = await itemsCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        });

        app.get('/category-items', async (req, res) => {
            const cursor = categoryItems.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/items', async (req, res) => {
            const cursor = itemsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await itemsCollection.findOne(query);
            res.send(result);
        })

        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateItem = req.body;
            const item = {
                $set: {
                    name: updateItem.itemNAme,
                    subcategory: updateItem.subcategory,
                    photo: updateItem.photo,
                    description: updateItem.description,
                    price: updateItem.price,
                    rating: updateItem.rating,
                    time: updateItem.time,
                    customization: updateItem.customization,
                    stockStatus: updateItem.stockStatus

                }
            }

            const result = await itemsCollection.updateOne(filter, item, options);
            res.send(result)
        })

        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('wood wonders app is running')
});
app.listen(port, () => {
    console.log(`App is running in port ${port}`)
})