const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.og8u4je.mongodb.net/?retryWrites=true&w=majority`;

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

    const popularClassCollection = client.db("shineOn").collection("populerClass");
    const popularInsCollection = client.db("shineOn").collection("populerIns");
    const cartsCollection = client.db("shineOn").collection("carts");
    const usersCollection = client.db("shineOn").collection("users");



    app.get('/populerClass', async(req, res)=>{
      const result = await popularClassCollection.find().sort({ "students": -1 }).limit(6).toArray()
      res.send(result);
    })


    app.get('/populerIns', async(req, res)=>{
      const result = await popularInsCollection.find().sort({ "students": -1 }).limit(6).toArray()
      res.send(result);
    })


    app.get('/instructors', async(req, res)=>{
      const result = await popularInsCollection.find().toArray()
      res.send(result);
    })

    app.get('/classes', async(req, res)=>{
      const result = await popularClassCollection.find().toArray()
      res.send(result);
    })

     // users

     app.get('/users', async(req, res)=>{
      const result = await usersCollection.find().toArray()
      res.send(result);
     })

     app.post('/users', async(req, res)=>{
      const user = req.body;
      console.log(user);
      const query = {email: user.email}
      const existingUser = await usersCollection.findOne(query);
      if(existingUser){
        return res.send({ message: 'user exists'})
      }
      const result = await usersCollection.insertOne(user)
      res.send(result);
    })

    app.patch('/users/admin/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersCollection.deleteOne(query)
      res.send(result);
    })





    // carts

    app.get('/carts', async(req, res)=>{
      const email = req.query.email;
      // console.log(email);
      if(!email){
        res.send([]);
      }
      const query = {email: email};
      const result = await cartsCollection.find(query).toArray()
      res.send(result)
    })


    app.post('/carts', async(req, res)=>{
      const item = req.body;
      console.log(item)
      const result = await cartsCollection.insertOne(item)
      res.send(result);
    })

    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query)
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
  res.send('shine on summer!')
})

app.listen(port, () => {
  console.log(`shine on summer is running on port ${port}`)
})