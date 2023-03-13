const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require("jsonwebtoken")


require("dotenv").config()


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.1mrcu36.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send({ message: 'forbidden access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_TOKEN, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded
        next();
    })
}

const run = async () => {

    try {
        const allProductCollection = client.db('mss-mart').collection('allProduct')
        const bestSealProductsCollection = client.db('mss-mart').collection('bestSealCollection')
        const addToCartCollection = client.db('mss-mart').collection('AddToCart')
        const userInfoCollection = client.db('mss-mart').collection('userInformation')
        const loveCollection = client.db('mss-mart').collection('loveProduct')

        
        app.get('/allProduct', async (req, res) => {
            const productType = req.query.productType
            const query = { productType: productType }
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

        app.delete('/allProduct/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id :new ObjectId(id)}
            const productDelete = await allProductCollection.deleteOne(query)
            res.send(productDelete)
        })

        app.get('/bestSeal', async (req, res) => {
            const query = {}
            const BestSeal = await bestSealProductsCollection.find(query).toArray()
            res.send(BestSeal)
        })

        app.post('/addToCart', async (req, res) => {
            const productDetails = req.body;
            const addToCart = await addToCartCollection.insertOne(productDetails)
            res.send(addToCart)
        })

        app.get('/addGetCart', async(req,res)=>{
            const email = req.query.email;
            const query = {email:email}
            const getCart = await addToCartCollection.find(query).toArray()
            res.send(getCart)
        })

      

        app.post('/loveProduct', async (req, res) => {
            const Product = req.body;
            const loveProduct = await loveCollection.insertOne(Product)
            res.send(loveProduct)
        })

        app.get('/loveProduct', async(req,res)=>{
            const email = req.query.email;
            const query = {email: email}
            const getLove = await loveCollection.find(query).toArray()
            res.send(getLove)
        })

        app.delete('/loveProductDelete/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const getLove = await loveCollection.deleteOne(query)
            res.send(getLove)
        })

        app.post('/userInfo', async (req, res) => {
            const userInformation = req.body;
            const information = await userInfoCollection.insertOne(userInformation)
            res.send(information)
        })

        app.get('/allUser', async(req,res)=>{
            const email = req.query.email;
            const query = {email:email}
            const allUser= await userInfoCollection.findOne(query)
            res.send({isAdmin:allUser?.role=== 'admin'})
        })

        app.get('/user', async(req,res)=>{
            const email = req.query.email;
            const query = {email:email}
            const userinfo = await userInfoCollection.findOne(query)
            res.send(userinfo)

        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await userInfoCollection.findOne(query)
            if (user ) {
                const token = jwt.sign({ email }, process.env.JWT_TOKEN)
                return res.send({ token })
            }
            res.status(403).send({ message: 'Forbidden Access' })
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