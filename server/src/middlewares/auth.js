const auth = require('../configs/auth');

/**
 * Authentication Middleware using Better-Auth
 * Validates session/JWT and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Attach user information to request object
    // Note: session.user will contain id, email, name, image, role etc.
    req.user = session.user;
    req.session = session.session;
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

module.exports = authenticate;
