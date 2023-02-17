const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors'); 
const { query, query } = require('express');
require("dotenv").config()


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.1mrcu36.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);

const run =async()=>{
    
    try{
        const allProductCollection=client.db('mss-mart').collection('allProduct')
        const womanProductCollection = client.db ('mss-mart').collection('womanCollection')
        const manProductCollection = client.db ('mss-mart').collection('manCollection')
        const kidsProductCollection = client.db('mss-mart').collection('kidCollection')
        const recommendationProduct = client.db('mss-mart').collection('recommendationCollection')



        app.get('/allProduct', async(req,res)=>{
            const query = {}
            const allProduct = await allProductCollection.find(query).toArray()
            res.send(allProduct)
        })

        app.get('/woman', async(req,res)=>{
            const query = {}
            const woman = await womanProductCollection.find(query).toArray()
            res.send(woman)
        })
        app.get('/man', async(req,res)=>{
            const query = {}
            const man = await manProductCollection.find(query).toArray()
            res.send(man)
        })
        app.get('/man/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await manProductCollection.findOne(query)
            res.send(result)
        })


        app.get('/kids', async(req,res)=>{
            const query = {}
            const man = await kidsProductCollection.find(query).toArray()
            res.send(man)
        })
        app.get('/recommendation', async(req,res)=>{
            const query ={}
            const recommendation= await recommendationProduct.find(query).limit(15).toArray()
            res.send(recommendation)
        })

    }
    finally{

    }
}
run().catch(err => console.error(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})