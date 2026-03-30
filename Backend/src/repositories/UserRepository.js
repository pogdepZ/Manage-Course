const User = require('../models/User');

class UserRepository {
  async create(payload) {
    return User.create(payload);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id);
  }
}

module.exports = UserRepository;
