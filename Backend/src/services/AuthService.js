const bcrypt = require('bcrypt');
const AppError = require('../errors/AppError');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

class AuthService {
  constructor({ userRepository, refreshTokenRepository }) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async register({ name, email, password, role, department }) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
      role,
      department: department || null
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    };
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = signAccessToken(user);
    const { token: refreshToken, jti } = signRefreshToken(user);
    const decoded = verifyRefreshToken(refreshToken);

    const tokenHash = await bcrypt.hash(refreshToken, 12);
    await this.refreshTokenRepository.create({
      userId: user._id,
      tokenHash,
      jti,
      expiresAt: new Date(decoded.exp * 1000)
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    };
  }

  async refresh({ refreshToken }) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }

    const storedToken = await this.refreshTokenRepository.findByJti(payload.jti);
    if (!storedToken) {
      throw new AppError('Refresh token revoked', 401);
    }

    if (storedToken.expiresAt.getTime() < Date.now()) {
      await this.refreshTokenRepository.deleteByJti(payload.jti);
      throw new AppError('Refresh token expired', 401);
    }

    const tokenMatches = await bcrypt.compare(refreshToken, storedToken.tokenHash);
    if (!tokenMatches) {
      await this.refreshTokenRepository.deleteByJti(payload.jti);
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.refreshTokenRepository.deleteByJti(payload.jti);

    const accessToken = signAccessToken(user);
    const { token: newRefreshToken, jti } = signRefreshToken(user);
    const decoded = verifyRefreshToken(newRefreshToken);

    const tokenHash = await bcrypt.hash(newRefreshToken, 12);
    await this.refreshTokenRepository.create({
      userId: user._id,
      tokenHash,
      jti,
      expiresAt: new Date(decoded.exp * 1000)
    });

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }
}

module.exports = AuthService;
