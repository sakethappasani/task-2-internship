const express = require("express");
const { MongoClient, Collection } = require("mongodb");

const app = express();
app.use(express.json());

const dburl = "mongodb://localhost:27017";
const dbname = "aicte-internship";
const client = new MongoClient(dburl);

client.connect().then(() => {
    console.log("Connection to DB established Successfully");
  }).catch((error) => {
    console.log(error.message);
  });

const db = client.db(dbname);
const coll = db.collection("student");

app.post("/addstudent", async (req, res) => {
  try {
    const stu = await req.body;
    coll.insertOne(stu);
    res.status(200).send("Student Inserted Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/viewstudents", async (req, res) => {
  try {
    const students = await db.collection("student").find().toArray();
    if (students.length === 0) {
      res.send("Empty Student Collection");
    } else {
      res.json(students);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/deletestudent/:id", async (req, res) => {
  try {
    const id = await parseInt(req.params.id);
    const student = coll.findOne({ id: id });
    if (student) {
      coll.deleteOne({ id: id });
      res.status(200).send("Student Deleted Successfully");
    } else {
      res.status(200).send("No Student Exist with that ID");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/viewstudent/:id", async (req, res) => {
  try {
    const id = await parseInt(req.params.id);
    const student = await coll.findOne({ id: id });
    if (student.length === 0) {
      res.status(200).send(`No Student found with ID: ${id}`);
    } else {
      res.status(200).json(student);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/updatestudentname", async (request, response) => {
  try {
    const s = await request.body;
    const student = await coll.findOne({ sid: s.sid });
    if (student != null) {
      coll.updateOne({ sid: s.sid },{ $set: { sname: s.sname, sage: s.sage } });
      response.send("Student Updated Successfully");
    } else {
      response.send("Student ID Not Found");
    }
  } catch (err) {
    response.status(500).send(err.message);
  }
});

const port = 2000;
app.listen(port, () => {
  console.log(`Server started running on port: ${port}`);
});
