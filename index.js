const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



// wood-wonders
// EH0dBJX1BoYpbiwK




const uri = "mongodb+srv://wood-wonders:EH0dBJX1BoYpbiwK@cluster0.pg5idq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        await client.connect();


        const userCollection = client.db("wood-wonders").collection("users");

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser)
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