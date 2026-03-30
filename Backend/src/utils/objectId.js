const mongoose = require('mongoose');

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

module.exports = {
  toObjectId
};
