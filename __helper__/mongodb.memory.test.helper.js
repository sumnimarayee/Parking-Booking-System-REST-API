const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoDb = null;

exports.connect = async () => {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();
  //   await mongoose.connect(uri);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

exports.cleanData = async () => {
  //   await mongoose.connection.dropDatabase();
  if (mongoDb) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.remove();
    }
  }
};

exports.disconnect = async () => {
  //   await mongoose.disconnect();
  //   await mongoDb.stop();
  if (mongoDb) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoDb.stop();
  }
};
