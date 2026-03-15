import { verify } from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log(token);
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  verify(token, 'secretkey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
