
const { MongoClient, ObjectId } = require("mongodb");
const _ = require("lodash");
require('dotenv').config();
const { username, password } = process.env;
const connection_string = `mongodb+srv://${username}:${password}@cluster0.vkpmdm5.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(connection_string);

async function run() {
  try {
    const database = client.db('OZ');
    const collection = database.collection('Tracts');
    
    const experience = [-86.4868179,35.8045765];
    const test = [ -85.343925395999975, 32.14716005300005 ];
    const query = {
        geometry: {
            $geoIntersects: {
                $geometry: {
                  "type": "Point",
                  "coordinates": experience
                //   "coordinates": test
                }
              }
        }
    };
    const cursor = await collection.find(query)
    const arr = await cursor.toArray();
    console.log(arr);
    
  } finally {
    await client.close();
  }
}
run().catch(console.dir);