import { Request, Response } from 'express';
import Photo from '../models/Photo';
import Gallery from '../models/Gallery';
import JudgeScore from '../models/JudgeScore';
import VisitorVote from '../models/VisitorVote';

// @desc    Submit photo
// @route   POST /api/photos
// @access  Private/Photographer
export const submitPhoto = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const { title, description, categoryId } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const photo = await Photo.create({
      title,
      description,
      imageUrl,
      photographerId: req.user._id,
      categoryId,
    });

    res.status(201).json({
      success: true,
      data: photo,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get all photos
// @route   GET /api/photos
// @access  Public
export const getPhotos = async (req: Request, res: Response) => {
  try {
    const { categoryId, photographerId } = req.query;
    const filter: any = {};

    if (categoryId) filter.categoryId = categoryId;
    if (photographerId) filter.photographerId = photographerId;

    const photos = await Photo.find(filter)
      .populate('photographerId', 'name email')
      .populate('categoryId', 'name')
      .populate('galleries', 'name');

    // Add scores and votes to each photo
    const photosWithStats = await Promise.all(
      photos.map(async (photo) => {
        const judgeScores = await JudgeScore.find({ photoId: photo._id });
        const totalJudgeScore = judgeScores.reduce((acc, s) => acc + s.score, 0);
        const visitorVotes = await VisitorVote.countDocuments({ photoId: photo._id });
        
        return {
          ...photo.toObject(),
          judgeScore: totalJudgeScore,
          visitorVotes,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: photosWithStats.length,
      data: photosWithStats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single photo with scores and votes
// @route   GET /api/photos/:id
// @access  Public
export const getPhoto = async (req: Request, res: Response) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('photographerId', 'name email bio')
      .populate('categoryId', 'name description')
      .populate('galleries', 'name description');

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    // Get judge scores
    const judgeScores = await JudgeScore.find({ photoId: req.params.id })
      .populate('judgeId', 'name expertise');

    const totalJudgeScore = judgeScores.reduce(
      (acc, score) => acc + score.score,
      0
    );

    // Get visitor votes
    const visitorVotes = await VisitorVote.countDocuments({
      photoId: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: {
        photo,
        judgeScores,
        totalJudgeScore,
        visitorVotes,
        totalScore: totalJudgeScore + visitorVotes,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update photo
// @route   PUT /api/photos/:id
// @access  Private/Photographer
export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: photo,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete photo
// @route   DELETE /api/photos/:id
// @access  Private/Photographer/Admin
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
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

// @desc    Add photo to gallery
// @route   POST /api/photos/:id/galleries/:galleryId
// @access  Private/Admin
export const addPhotoToGallery = async (req: Request, res: Response) => {
  try {
    const { id, galleryId } = req.params;

    const photo = await Photo.findById(id);
    const gallery = await Gallery.findById(galleryId);

    if (!photo || !gallery) {
      return res.status(404).json({
        success: false,
        message: 'Photo or Gallery not found',
      });
    }

    // Add photo to gallery
    if (!gallery.photos.includes(photo._id)) {
      gallery.photos.push(photo._id);
      await gallery.save();
    }

    // Add gallery to photo
    if (!photo.galleries.includes(gallery._id)) {
      photo.galleries.push(gallery._id);
      await photo.save();
    }

    res.status(200).json({
      success: true,
      data: { photo, gallery },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
