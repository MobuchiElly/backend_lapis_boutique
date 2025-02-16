const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URI;

if (!MONGO_URL) {
  throw new Error(
    'Please define the MONGO_URL environment variable inside .env.local'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { 
    conn: null,
    promise: null
  }
}

async function connectDb() {
  if (cached.conn) {
    return cached.conn
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGO_URL, opts).then((mongoose) => {
      return mongoose
    })
  }
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

module.exports = connectDb;