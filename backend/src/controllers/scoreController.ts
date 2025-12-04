import { Request, Response } from 'express';
import JudgeScore from '../models/JudgeScore';
import Photo from '../models/Photo';

// @desc    Submit judge score
// @route   POST /api/scores
// @access  Private/Judge
export const submitScore = async (req: any, res: Response) => {
  try {
    const { photoId, score, comment } = req.body;

    // Check if photo exists
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    // Check if judge already scored this photo
    const existingScore = await JudgeScore.findOne({
      judgeId: req.user._id,
      photoId,
    });

    if (existingScore) {
      return res.status(400).json({
        success: false,
        message: 'You have already scored this photo',
      });
    }

    const judgeScore = await JudgeScore.create({
      judgeId: req.user._id,
      photoId,
      score,
      comment,
    });

    res.status(201).json({
      success: true,
      data: judgeScore,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get all scores
// @route   GET /api/scores
// @access  Public
export const getScores = async (req: Request, res: Response) => {
  try {
    const { photoId, judgeId } = req.query;
    const filter: any = {};

    if (photoId) filter.photoId = photoId;
    if (judgeId) filter.judgeId = judgeId;

    const scores = await JudgeScore.find(filter)
      .populate('judgeId', 'name expertise')
      .populate({
        path: 'photoId',
        populate: [
          { path: 'photographerId', select: 'name' },
          { path: 'categoryId', select: 'name' },
        ],
      });

    res.status(200).json({
      success: true,
      count: scores.length,
      data: scores,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update score
// @route   PUT /api/scores/:id
// @access  Private/Judge
export const updateScore = async (req: Request, res: Response) => {
  try {
    const score = await JudgeScore.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found',
      });
    }

    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete score
// @route   DELETE /api/scores/:id
// @access  Private/Judge/Admin
export const deleteScore = async (req: Request, res: Response) => {
  try {
    const score = await JudgeScore.findByIdAndDelete(req.params.id);

    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found',
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

// @desc    Get photo total judge score
// @route   GET /api/scores/photo/:photoId/total
// @access  Public
export const getPhotoTotalScore = async (req: Request, res: Response) => {
  try {
    const scores = await JudgeScore.find({ photoId: req.params.photoId });

    const totalScore = scores.reduce((acc, score) => acc + score.score, 0);
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;

    res.status(200).json({
      success: true,
      data: {
        totalScore,
        averageScore,
        numberOfJudges: scores.length,
        scores,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
