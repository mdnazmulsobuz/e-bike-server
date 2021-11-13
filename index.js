const express = require('express');
const app = express();
const cors =require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
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
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

        // get products api
        app.get('/products', async(req,res) =>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray()
            res.send(products);
        });

         // get single product api 
         app.get('/products/:id', async(req, res) =>{
            const id = req.params.id;
            console.log("load product with id", id)
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            // res.json(product);
            res.send(product);
        });

        // post products api
        app.post('/products', async(req, res) =>{
            const product = req.body;
            console.log('hit the post', product)
            const result = await productsCollection.insertOne(product);
            res.json(result);
        });

         //  Get orders api
         app.get('/orders', async(req, res)=>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // add order api
        app.post('/orders', async(req,res)=>{
            const order = req.body;
            console.log("order", order)
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });

        // delete order api
        app.delete('/orders/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });

        // delete products api
        app.delete('/products/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        });

         // get single product 
        app.get('/orders/:', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const product = await productsCollection.findOne(query);
        res.json(product);
        });

        // user api
        app.post('/users', async(req, res)=>{
        const user = req.body;
        const result = await usersCollection.insertOne(user);  
        console.log(result);
        res.json(result);
        });

        // role api
        app.get('/users/:email', async(req, res) =>{
        const email = req.params.email;
        const query= {email: email};
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if(user?.role === 'admin'){
          isAdmin = true;
        }
        res.json({admin : isAdmin});
        });

        // make admin api
        app.put('/users/admin', async(req, res) =>{
        const user = req.body;
        const filter = {email: user.email};
        const updateDoc = {$set: {role: 'admin'}};
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.json(result);
        });

        // my order api 
        app.get('/orders/:email', async (req, res) =>{
        const result = await ordersCollection.find({email: req.params.email}).toArray();
        res.send(result);
        });

        // send review api
        app.post('/reviews', async(req, res) =>{
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.json(result);
        });

        // get reviews api
        app.get('/reviews', async(req,res) =>{
        const cursor = reviewsCollection.find({});
        const reviews = await cursor.toArray()
        res.send(reviews);
        });

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