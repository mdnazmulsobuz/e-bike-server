const express = require('express');
const app = express();
const cors =require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo3sa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        console.log('Database Connected');
        const database = client.db('e-bike');
        const productsCollection = database.collection('products');

        // get api
        app.get('/products', async(req,res) =>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray()
            res.send(products);

        })

        // post api
        app.post('/products', async(req, res) =>{
            const product = req.body;
            console.log('hit the post', product)
        
            const result = await productsCollection.insertOne(product);
            // console.log(result);
            res.json(result);
        })


    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello e-bike.com!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})