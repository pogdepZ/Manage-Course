const RefreshToken = require('../models/RefreshToken');

class RefreshTokenRepository {
  async create(payload) {
    return RefreshToken.create(payload);
  }

  async findByJti(jti) {
    return RefreshToken.findOne({ jti });
  }

  async deleteByJti(jti) {
    return RefreshToken.deleteOne({ jti });
  }

  async deleteByUserId(userId) {
    return RefreshToken.deleteMany({ userId });
  }
}

module.exports = RefreshTokenRepository;
