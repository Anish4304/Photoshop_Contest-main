import { Request, Response } from 'express';
import Gallery from '../models/Gallery';

// @desc    Create gallery
// @route   POST /api/galleries
// @access  Private/Admin
export const createGallery = async (req: Request, res: Response) => {
  try {
    const gallery = await Gallery.create(req.body);

    res.status(201).json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get all galleries
// @route   GET /api/galleries
// @access  Public
export const getGalleries = async (req: Request, res: Response) => {
  try {
    const galleries = await Gallery.find().populate({
      path: 'photos',
      populate: [
        { path: 'photographerId', select: 'name' },
        { path: 'categoryId', select: 'name' },
      ],
    });

    res.status(200).json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single gallery
// @route   GET /api/galleries/:id
// @access  Public
export const getGallery = async (req: Request, res: Response) => {
  try {
    const gallery = await Gallery.findById(req.params.id).populate({
      path: 'photos',
      populate: [
        { path: 'photographerId', select: 'name email' },
        { path: 'categoryId', select: 'name' },
      ],
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update gallery
// @route   PUT /api/galleries/:id
// @access  Private/Admin
export const updateGallery = async (req: Request, res: Response) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete gallery
// @route   DELETE /api/galleries/:id
// @access  Private/Admin
export const deleteGallery = async (req: Request, res: Response) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
