import { Request, Response } from 'express';
import Visitor from '../models/Visitor';
import VisitorVote from '../models/VisitorVote';
import Photo from '../models/Photo';

// @desc    Add visitor
// @route   POST /api/visitors
// @access  Public
export const addVisitor = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    // Check if visitor exists
    let visitor = await Visitor.findOne({ email });

    if (!visitor) {
      visitor = await Visitor.create({ name, email });
    }

    res.status(201).json({
      success: true,
      data: visitor,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Submit vote
// @route   POST /api/votes
// @access  Public
export const submitVote = async (req: Request, res: Response) => {
  try {
    const { visitorId, photoId } = req.body;

    // Check if visitor exists
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found',
      });
    }

    // Check if photo exists
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    // Check if visitor already voted for this photo
    const existingVote = await VisitorVote.findOne({ visitorId, photoId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted for this photo',
      });
    }

    const vote = await VisitorVote.create({ visitorId, photoId });

    res.status(201).json({
      success: true,
      data: vote,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get all votes
// @route   GET /api/votes
// @access  Public
export const getVotes = async (req: Request, res: Response) => {
  try {
    const { photoId, visitorId } = req.query;
    const filter: any = {};

    if (photoId) filter.photoId = photoId;
    if (visitorId) filter.visitorId = visitorId;

    const votes = await VisitorVote.find(filter)
      .populate('visitorId', 'name email')
      .populate({
        path: 'photoId',
        populate: [
          { path: 'photographerId', select: 'name' },
          { path: 'categoryId', select: 'name' },
        ],
      });

    res.status(200).json({
      success: true,
      count: votes.length,
      data: votes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get photo vote count
// @route   GET /api/votes/photo/:photoId/count
// @access  Public
export const getPhotoVoteCount = async (req: Request, res: Response) => {
  try {
    const count = await VisitorVote.countDocuments({
      photoId: req.params.photoId,
    });

    res.status(200).json({
      success: true,
      data: { voteCount: count },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get visitor activity
// @route   GET /api/visitors/:id/activity
// @access  Public
export const getVisitorActivity = async (req: Request, res: Response) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found',
      });
    }

    const votes = await VisitorVote.find({ visitorId: req.params.id }).populate(
      {
        path: 'photoId',
        populate: [
          { path: 'photographerId', select: 'name' },
          { path: 'categoryId', select: 'name' },
        ],
      }
    );

    res.status(200).json({
      success: true,
      data: {
        visitor,
        votes,
        totalVotes: votes.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
