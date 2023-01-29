import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

const roles = ['superadmin', 'admin', 'manager', 'moderator', 'user'];

const permissions = ['view', 'create', 'edit', 'delete', 'none'];

const checkRole = (userRole) => {
  return roles.indexOf(userRole) !== -1;
};

const checkPermission = (userPermission) => {
  return permissions.indexOf(userPermission) !== -1;
};

const adminAuthMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. No token provided.',
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== 'superadmin' && decoded.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Invalid role.',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Invalid token.',
    });
  }
};

const superadminAuthMiddleware = (req, res, next) => {
  const token = req.headers['authorization'].replac('Bearer', '');
  if (!token) {
    return res.status(401).send('Access Denied. No Token Provided.');
  }

  try {
    const decoded = verify(token, SECRET_KEY);
    req.user = decoded;
    if (!checkRole(decoded.role) || decoded.role !== 'superadmin') {
      return res.status(400).send('Invalid Role.');
    }
    next();
  } catch (error) {
    res.status(400).send('Invalid Token.');
  }
};

const userAuthMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access Denied. No Token Provided.');
  }

  try {
    const decoded = verify(token, SECRET_KEY);
    req.user = decoded;
    if (!checkRole(decoded.role) || decoded.role === 'superadmin') {
      return res.status(400).send('Invalid Role.');
    }
    if (!checkPermission(decoded.permission)) {
      return res.status(400).send('Invalid Permission.');
    }
    next();
  } catch (error) {
    res.status(400).send('Invalid Token.');
  }
};

export default {
  adminAuthMiddleware,
  superadminAuthMiddleware,
  userAuthMiddleware,
};
