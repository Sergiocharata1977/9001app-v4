import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { MongoError } from 'mongodb';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Error interno del servidor';
  let details: any = null;

  console.error('❌ Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Errores de validación Joi
  if (error instanceof ValidationError) {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
    details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
  }

  // Errores de JWT
  if (error instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (error instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token expirado';
  }

  // Errores de MongoDB
  if (error instanceof MongoError) {
    switch (error.code) {
      case 11000: // Duplicate key
        statusCode = 409;
        message = 'El recurso ya existe';
        const field = Object.keys(error.keyValue || {})[0];
        details = { field, value: error.keyValue?.[field] };
        break;
      case 11001: // Duplicate key (legacy)
        statusCode = 409;
        message = 'El recurso ya existe';
        break;
      default:
        statusCode = 500;
        message = 'Error de base de datos';
    }
  }

  // Errores de Mongoose
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
    details = Object.values(error.errors || {}).map((err: any) => ({
      field: err.path,
      message: err.message
    }));
  }

  // Respuesta de error
  const errorResponse: any = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  };

  if (details) {
    errorResponse.details = details;
  }

  // En desarrollo, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};