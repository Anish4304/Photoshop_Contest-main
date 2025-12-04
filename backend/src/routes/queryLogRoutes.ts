import express from 'express';
import { saveQueryLog, getQueryLogs } from '../controllers/queryLogController';

const router = express.Router();

router.post('/', saveQueryLog);
router.get('/', getQueryLogs);

export default router;
