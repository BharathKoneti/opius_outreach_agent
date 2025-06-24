import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get user profile
router.get('/profile', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'User profile endpoint',
    data: {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Profile updated successfully'
  });
}));

export { router as userRouter }; 