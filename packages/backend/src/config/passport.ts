import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { logger } from '../utils/logger';

// Mock user lookup (replace with database)
const users = [
  { id: '1', email: 'test@example.com', name: 'Test User' }
];

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // TODO: Replace with database lookup
      const user = users.find(u => u.id === payload.userId);
      
      if (user) {
        return done(null, user);
      } else {
        logger.warn('JWT authentication failed: User not found', { userId: payload.userId });
        return done(null, false);
      }
    } catch (error) {
      logger.error('JWT authentication error:', error);
      return done(error, false);
    }
  })
);

export default passport; 