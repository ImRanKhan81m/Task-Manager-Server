const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

//todoTask
//Nlqa7X3SjwaBYR8c

app.use(cors({
  origin: "*"
}));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://todoTask:Nlqa7X3SjwaBYR8c@cluster0.815jo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const tasksCollection = client.db("taskTracker").collection("task");
    const completeTaskCollection = client.db("completeTask").collection("complete");

    app.get("/tasks", async (req, res) => {
      const q = req.query;
      console.log(q);

      const cursor = tasksCollection.find(q);

      const result = await cursor.toArray();

      res.send(result);
    });

    app.post("/task", async (req, res) => {
      const data = req.body;
      console.log("from post api", data);

      const result = await tasksCollection.insertOne(data);

      res.send(result);
    });

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("from update api", data);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          title: data.title,
          textData: data.textData,
        },
      };

      const result = await tasksCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };

      const result = await tasksCollection.deleteOne(filter);

      res.send(result);
    });

    app.post('/complete', async (req, res) => {

      const data = req.body;
      const result = await completeTaskCollection.insertOne(data);
      res.send(result)
    })

    app.get('/complete-task', async (req, res) => {
      const result = await completeTaskCollection.find({}).toArray();
      res.send(result)
    })

    app.delete("/complete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await completeTaskCollection.deleteOne(filter);
      res.send(result);
    });



    console.log("connected to db");
  } finally {
  }
}

run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
