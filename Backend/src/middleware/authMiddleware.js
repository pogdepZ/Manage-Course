const AppError = require('../errors/AppError');
const { verifyAccessToken } = require('../utils/jwt');

function authMiddleware(request, _reply, done) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    done(new AppError('Missing or invalid Authorization header', 401));
    return;
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== 'access') {
      done(new AppError('Invalid token type', 401));
      return;
    }

    request.user = {
      id: payload.sub,
      role: payload.role,
      department: payload.department
    };

    done();
  } catch (error) {
    done(new AppError('Invalid or expired token', 401));
  }
}

module.exports = authMiddleware;
