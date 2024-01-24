import {NextFunction, Request, Response} from 'express';

import CustomError from './classes/CustomError';
import {ErrorResponse} from './types/MessageTypes';
import {validationResult} from 'express-validator';
import fetchData from './lib/fetchData';
import {ImageFromWikipedia} from './types/ImageFromWikipedia';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // console.log(err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const validationErrors = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  next();
};

const imageFromWikipedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = `http://en.wikipedia.org/w/api.php?action=query&titles=${req.body.species_name}&prop=pageimages&format=json&pithumbsize=640`;
    // console.log(url);
    const imageData = await fetchData<ImageFromWikipedia>(url);
    console.log(imageData);
    const page = imageData.query.pages[Object.keys(imageData.query.pages)[0]];
    req.body.image = page.thumbnail.source;
    next();
  } catch (error) {
    next(new CustomError('wiki error', 400));
  }
};

export {notFound, errorHandler, validationErrors, imageFromWikipedia};
