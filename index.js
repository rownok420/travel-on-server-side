const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");

require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amu9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("travelOn");
        const serviceCollection = database.collection("service");
        const ordersCollection = database.collection("orders");

        //  GET API
        app.get("/addservice", async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get("/placeorder", async (req, res) => {
            const cursor = ordersCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });

        app.get("/placeorder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.json(result);
        });

        app.get("/myOrder/:email", async (req, res) => {
            const result = await ordersCollection
                .find({ email: req.params.email })
                .toArray();
            res.json(result);
        });

        // app.get("/singleorder/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await ordersCollection.findOne(query);
        //     res.json(result);
        // });

        // POST SERVICE API
        app.post("/addservice", async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`
            );
            res.json(result);
        });

        // POST PLACE ORDER API
        app.post("/placeorder", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`
            );
            res.json(result);
        });

        // DELETE ORDER
        app.delete("/placeorder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log("deleting products", result);
            res.json(result);
        });

        // // update status
        // app.put("/placeorder/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const updateStatus = req.body;
        //     const status = "Confirm"
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             status: updateStatus.status,

        //         },
        //     };
        //     const result = await ordersCollection.updateOne(filter, updateDoc, options);
        //     console.log("updated product", req.body);
        //     res.json(result);
        //     console.log(id, updateStatus)
        // });

        console.log("Database connect");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Assignment Server is Started Successfully...");
});

app.listen(port, () => {
    console.log("Listing to Port", port);
});
