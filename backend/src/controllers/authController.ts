import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Photographer from '../models/Photographer';
import Judge from '../models/Judge';
import { generateToken } from '../utils/jwt';

// @desc    Register photographer
// @route   POST /api/auth/register/photographer
// @access  Public
export const registerPhotographer = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, bio } = req.body;

    // Check if user exists
    const existingUser = await Photographer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create photographer
    const photographer = await Photographer.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bio,
    });

    // Generate token
    const token = generateToken(photographer._id.toString(), 'photographer');

    res.status(201).json({
      success: true,
      data: {
        id: photographer._id,
        name: photographer.name,
        email: photographer.email,
        role: photographer.role,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Register judge
// @route   POST /api/auth/register/judge
// @access  Public
export const registerJudge = async (req: Request, res: Response) => {
  try {
    const { name, email, password, expertise } = req.body;

    // Check if user exists
    const existingUser = await Judge.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create judge
    const judge = await Judge.create({
      name,
      email,
      password: hashedPassword,
      expertise,
    });

    // Generate token
    const token = generateToken(judge._id.toString(), 'judge');

    res.status(201).json({
      success: true,
      data: {
        id: judge._id,
        name: judge.name,
        email: judge.email,
        role: judge.role,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for photographer
    let user = await Photographer.findOne({ email }).select('+password');
    let role = 'photographer';

    // If not photographer, check for judge
    if (!user) {
      user = await Judge.findOne({ email }).select('+password');
      role = 'judge';
    }

    // Check for admin (hardcoded for demo)
    if (email === 'admin@contest.com' && password === 'admin123') {
      const token = generateToken('admin', 'admin');
      return res.status(200).json({
        success: true,
        data: {
          id: 'admin',
          email: 'admin@contest.com',
          role: 'admin',
          token,
        },
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id.toString(), role);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
