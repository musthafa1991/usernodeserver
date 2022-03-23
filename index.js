import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// const Mongo_URL = "mongodb://localhost:27017";


const PORT=process.env.PORT;
const Mongo_URL = process.env.Mongo_URL;


async function createConnection() {
    const client = new MongoClient(Mongo_URL);
    await client.connect();
    console.log("mongo connected");
    return client;
}
const client = await createConnection();

// app.get("/movies", async function (req, res) {
//     const movielist = await client.db("b30wd").collection("movies").find({}).toArray();
//     res.send(movielist);
// })


app.get("/userlist", async function (req, res) {
    const data = req.body;

    const userlist = await client.db("b30wd").collection("users").find({}).toArray();
    res.send(userlist);
})

app.get("/user/:id", async function (req, res) {
    const { id } = req.params;

    const user = await client.db("b30wd").collection("users").findOne({ id: +id });

    user ? res.send(user) : res.status(404).send({ message: "user not found" });
    ;
})



app.post("/user", async function (req, res) {

    req.body.id = (await client.db("b30wd").collection("users").find({}).toArray()).length + 1;
    const data = req.body;

    const result = await client.db("b30wd").collection("users").insertOne(data);

    res.send(result);
})

app.delete("/user/:id", async function (req, res) {
    const { id } = req.params;

    const result = await client.db("b30wd").collection("users").deleteOne({ id: +id });

    res.send(result);
})


app.put("/user/:id", async function (req, res) {
    const { id } = req.params;
    
    const updatedata = req.body;
    const result = await client.db("b30wd").collection("users").updateOne({ id: +id }, { $set: updatedata });
    res.send(result);
})

app.listen(PORT, () => console.log("server started in port no 4000"));