import { Request, Response } from 'express';
import Book from '../models/book';
import express from 'express';
import bodyParser from 'body-parser';
import escapeHtml from 'escape-html';  // Import escapeHtml for escaping potentially unsafe characters
import { validateBookDetailsMiddleware, RequestWithSanitizedBookDetails } from '../sanitizers/bookSanitizer';

const router = express.Router();

/**
 * Middleware specific to this router
 * The function is called for every request to this router
 * It parses the body and makes it available under req.body
 */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

/**
 * @route POST /newbook
 * @returns a newly created book for an existing author and genre in the database
 * @returns 500 error if book creation failed
 * @returns 400 error if the input validation fails
 */
router.post('/', validateBookDetailsMiddleware, async (req: Request, res: Response) => {
  const { familyName, firstName, genreName, bookTitle } = req.body;

  // Escape user input to prevent reflected XSS
  const sanitizedFamilyName = escapeHtml(familyName);
  const sanitizedFirstName = escapeHtml(firstName);
  const sanitizedGenreName = escapeHtml(genreName);
  const sanitizedBookTitle = escapeHtml(bookTitle);

  try {
    const book = new Book({});
    const savedBook = await book.saveBookOfExistingAuthorAndGenre(
      sanitizedFamilyName, sanitizedFirstName, sanitizedGenreName, sanitizedBookTitle
    );

    // Respond with sanitized data to prevent XSS
    res.status(200).send({
      title: sanitizedBookTitle, 
      author: `${sanitizedFirstName} ${sanitizedFamilyName}`,
      genre: sanitizedGenreName
    });
  } catch (err: unknown) {
    console.error('Error creating book:', (err as Error).message);
    res.status(500).send('Error creating book: ' + sanitizedBookTitle); // Send sanitized book title in error message
  }
});

export default router;
