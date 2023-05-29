const { MongoClient } = require("mongodb");
const _ = require("lodash");
require("dotenv").config();
const tract_data = require("./tract_data.json"); //this takes a long time. would be faster to stream
// const tract_data = require("./test_data.json");
const { username, password } = process.env;

const connection_string = `mongodb+srv://${username}:${password}@cluster0.vkpmdm5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(connection_string);

function cleanUp(arr){
  return arr.map(x=> ({
    ...x.properties,
    geometry: x.geometry,
    //type: undefined
  }));
}

async function run() {
  try {
    const database = client.db("OZ");
    const collection = database.collection("Tracts");
    await collection.drop();

    const indexResult = await collection.createIndex({ geometry: "2dsphere" });
    console.log(indexResult);

    const cleaned = cleanUp(tract_data);

    const insertResult = await collection.insertMany(cleaned);
    console.log(insertResult);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
