const mongoose = require('mongoose');

async function connectDb(mongoUri) {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
}

module.exports = {
  connectDb
};
