import { Response } from 'express';
import BookInstance, { IBookInstance } from '../models/bookinstance';
import express from 'express';
import escapeHtml from 'escape-html';

const router = express.Router();

/**
 * @route GET /available
 * @returns {object} 200 - An array of available books
 * @returns {Error}  500 - if an error occurs when fetching the books
 */
router.get('/', async (_, res: Response) => {
  try {
    const results = await BookInstance.getAllBookStatuses();
    // Escape all text-based fields
    // Escape each book title and status
    const sanitizedResults = results.map(entry => escapeHtml(entry));

    res.status(200).json(sanitizedResults);  // JSON ensures safe encoding
  }
  catch (err) {
    res.status(500).send('Status not found');
  }
});

export default router;