import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.decode(token);

    if (!decoded?.sub) {
      throw new Error('Invalid token');
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email
    };

    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
