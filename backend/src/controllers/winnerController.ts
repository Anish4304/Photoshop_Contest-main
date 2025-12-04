import { Request, Response } from 'express';
import Winner from '../models/Winner';
import Photo from '../models/Photo';
import JudgeScore from '../models/JudgeScore';
import VisitorVote from '../models/VisitorVote';
import mongoose from 'mongoose';

// @desc    Declare winner
// @route   POST /api/winners
// @access  Private/Admin
export const declareWinner = async (req: Request, res: Response) => {
  try {
    const { photoId, categoryId, position, announcement } = req.body;

    // Check if photo exists
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    // Calculate total score
    const judgeScores = await JudgeScore.find({ photoId });
    const totalJudgeScore = judgeScores.reduce(
      (acc, score) => acc + score.score,
      0
    );

    const visitorVotes = await VisitorVote.countDocuments({ photoId });
    const totalScore = totalJudgeScore + visitorVotes;

    const winner = await Winner.create({
      photoId,
      categoryId,
      position,
      totalScore,
      announcement,
    });

    res.status(201).json({
      success: true,
      data: winner,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get all winners
// @route   GET /api/winners
// @access  Public
export const getWinners = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const filter: any = {};

    if (categoryId) filter.categoryId = categoryId;

    const winners = await Winner.find(filter)
      .populate({
        path: 'photoId',
        populate: [
          { path: 'photographerId', select: 'name email' },
          { path: 'categoryId', select: 'name' },
        ],
      })
      .populate('categoryId', 'name description')
      .sort({ position: 1 });

    res.status(200).json({
      success: true,
      count: winners.length,
      data: winners,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single winner
// @route   GET /api/winners/:id
// @access  Public
export const getWinner = async (req: Request, res: Response) => {
  try {
    const winner = await Winner.findById(req.params.id)
      .populate({
        path: 'photoId',
        populate: [
          { path: 'photographerId', select: 'name email bio' },
          { path: 'categoryId', select: 'name' },
        ],
      })
      .populate('categoryId', 'name description');

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found',
      });
    }

    res.status(200).json({
      success: true,
      data: winner,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update winner
// @route   PUT /api/winners/:id
// @access  Private/Admin
export const updateWinner = async (req: Request, res: Response) => {
  try {
    const winner = await Winner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found',
      });
    }

    res.status(200).json({
      success: true,
      data: winner,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete winner
// @route   DELETE /api/winners/:id
// @access  Private/Admin
export const deleteWinner = async (req: Request, res: Response) => {
  try {
    const winner = await Winner.findByIdAndDelete(req.params.id);

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found',
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

// @desc    Get top photos by category
// @route   GET /api/winners/category/:categoryId/top
// @access  Public
export const getTopPhotosByCategory = async (req: Request, res: Response) => {
  try {
    const winners = await Winner.find({ categoryId: req.params.categoryId })
      .populate({
        path: 'photoId',
        populate: [
          { path: 'photographerId', select: 'name email' },
          { path: 'categoryId', select: 'name' },
        ],
      })
      .sort({ position: 1 })
      .limit(3);

    res.status(200).json({
      success: true,
      count: winners.length,
      data: winners,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
