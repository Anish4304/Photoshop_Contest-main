import { Request, Response } from 'express';
import Photographer from '../models/Photographer';
import Photo from '../models/Photo';

// @desc    Get all photographers
// @route   GET /api/photographers
// @access  Public
export const getPhotographers = async (req: Request, res: Response) => {
  try {
    const photographers = await Photographer.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: photographers.length,
      data: photographers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single photographer
// @route   GET /api/photographers/:id
// @access  Public
export const getPhotographer = async (req: Request, res: Response) => {
  try {
    const photographer = await Photographer.findById(req.params.id).select('-password');
    
    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found',
      });
    }

    // Get photographer's photos with categories
    const photos = await Photo.find({ photographerId: req.params.id })
      .populate('categoryId', 'name');

    res.status(200).json({
      success: true,
      data: {
        photographer,
        photos,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update photographer profile
// @route   PUT /api/photographers/:id
// @access  Private
export const updatePhotographer = async (req: Request, res: Response) => {
  try {
    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: photographer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete photographer
// @route   DELETE /api/photographers/:id
// @access  Private/Admin
export const deletePhotographer = async (req: Request, res: Response) => {
  try {
    const photographer = await Photographer.findByIdAndDelete(req.params.id);

    if (!photographer) {
      return res.status(404).json({
        success: false,
        message: 'Photographer not found',
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
