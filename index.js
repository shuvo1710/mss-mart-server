const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');


require("dotenv").config()


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.1mrcu36.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);

const run = async () => {

    try {
        const allProductCollection = client.db('mss-mart').collection('allProduct')
        const womanProductCollection = client.db('mss-mart').collection('womanCollection')
        const manProductCollection = client.db('mss-mart').collection('manCollection')
        const kidsProductCollection = client.db('mss-mart').collection('kidCollection')
        const recommendationProduct = client.db('mss-mart').collection('recommendationCollection')
        const bestSealProductsCollection = client.db('mss-mart').collection('bestSealCollection')




        app.get('/allProduct', async(req,res)=>{
            const productType=req.query.productType
            const query = {productType: productType}

            const allProduct = await allProductCollection.find(query).toArray()
            res.send(allProduct)
        })

        app.get('/allProducts', async (req, res) => {
            const category = req.query.category;
            const query = { category: category }
            const allProducts = await allProductCollection.find(query).toArray();
            res.send(allProducts)
        })
        app.get('/allProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const findProduct = await allProductCollection.findOne(query)
            res.send(findProduct)
        })
        app.get('/recommendation', async (req, res) => {
            const query = {}
            const recommendation = await recommendationProduct.find(query).limit(15).toArray()
            res.send(recommendation)
        })
        app.get('/bestSeal', async (req, res) => {
            const query = {}
            const BestSeal = await bestSealProductsCollection.find(query).toArray()
            res.send(BestSeal)
        })

    }
    finally {

    }
}
run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})