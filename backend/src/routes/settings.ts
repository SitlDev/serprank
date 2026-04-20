import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { SettingsModel } from '../models/index';

const router = Router();

// Get user settings
router.get('/settings', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    let settings = await SettingsModel.findByUserId(req.userId!);
    
    // Create default settings if they don't exist
    if (!settings) {
      settings = await SettingsModel.create(req.userId!);
    }

    console.log('GET /settings response for user:', req.userId);
    console.log('Settings object:', settings);
    console.log('Settings keys:', Object.keys(settings));
    console.log('JSON stringified:', JSON.stringify(settings));
    
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user settings
router.put('/settings', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('PUT /settings request for user:', req.userId);
    console.log('Request body:', req.body);
    
    // First, ensure settings exist for this user
    let settings = await SettingsModel.findByUserId(req.userId!);
    if (!settings) {
      console.log('Settings not found, creating defaults...');
      settings = await SettingsModel.create(req.userId!);
    }
    
    // Now update the settings
    const updated = await SettingsModel.update(req.userId!, req.body);
    console.log('Settings updated successfully:', updated);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
