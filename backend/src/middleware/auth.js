const ApiError = require('../utils/ApiError');
const { verifyToken: verify } = require('../utils/jwt');

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError('Please log in to continue.', 401, 'NOT_AUTHENTICATED'));
  }

  try {
    const decoded = verify(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(new ApiError('Your session has expired. Please log in again.', 401, 'INVALID_TOKEN'));
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new ApiError('Admin access required.', 403, 'FORBIDDEN'));
  }
  next();
};

module.exports = { verifyToken, requireAdmin };
