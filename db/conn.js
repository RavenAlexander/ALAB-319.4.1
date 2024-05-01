import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb+srv://theravenalexander:p4ssw0rd@cluster0.mu0c0gd.mongodb.net/');

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("sample_training");

export default db;
