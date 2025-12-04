import { Request, Response } from 'express';
import Judge from '../models/Judge';
import JudgeScore from '../models/JudgeScore';

// @desc    Get all judges
// @route   GET /api/judges
// @access  Public
export const getJudges = async (req: Request, res: Response) => {
  try {
    const judges = await Judge.find().select('-password');

    res.status(200).json({
      success: true,
      count: judges.length,
      data: judges,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single judge
// @route   GET /api/judges/:id
// @access  Public
export const getJudge = async (req: Request, res: Response) => {
  try {
    const judge = await Judge.findById(req.params.id).select('-password');

    if (!judge) {
      return res.status(404).json({
        success: false,
        message: 'Judge not found',
      });
    }

    // Get judge's scores
    const scores = await JudgeScore.find({ judgeId: req.params.id }).populate({
      path: 'photoId',
      populate: [
        { path: 'photographerId', select: 'name' },
        { path: 'categoryId', select: 'name' },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        judge,
        scores,
        totalScored: scores.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update judge
// @route   PUT /api/judges/:id
// @access  Private/Admin
export const updateJudge = async (req: Request, res: Response) => {
  try {
    const judge = await Judge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!judge) {
      return res.status(404).json({
        success: false,
        message: 'Judge not found',
      });
    }

    res.status(200).json({
      success: true,
      data: judge,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete judge
// @route   DELETE /api/judges/:id
// @access  Private/Admin
export const deleteJudge = async (req: Request, res: Response) => {
  try {
    const judge = await Judge.findByIdAndDelete(req.params.id);

    if (!judge) {
      return res.status(404).json({
        success: false,
        message: 'Judge not found',
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
