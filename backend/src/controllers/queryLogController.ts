import { Request, Response } from 'express';
import QueryLog from '../models/QueryLog';

export const saveQueryLog = async (req: Request, res: Response) => {
  try {
    const { queryId, queryTitle, endpoint, results } = req.body;

    const queryLog = await QueryLog.create({
      queryId,
      queryTitle,
      endpoint,
      results,
      executedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: queryLog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getQueryLogs = async (req: Request, res: Response) => {
  try {
    const logs = await QueryLog.find().sort({ executedAt: -1 }).limit(100);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
