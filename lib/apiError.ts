import { NextResponse } from 'next/server';

export interface ApiErrorOptions {
  status?: number;
  code?: string;
  details?: Record<string, any>;
}

export function apiError(message: string, options: ApiErrorOptions = {}) {
  const { status = 500, code, details } = options;
  
  const errorResponse = {
    error: message,
    ...(code && { code }),
    ...(details && { details }),
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(errorResponse, { status });
}

export function validationError(message: string, details?: Record<string, any>) {
  return apiError(message, { status: 400, code: 'VALIDATION_ERROR', details });
}

export function unauthorizedError(message = 'Unauthorized') {
  return apiError(message, { status: 401, code: 'UNAUTHORIZED' });
}

export function notFoundError(message = 'Resource not found') {
  return apiError(message, { status: 404, code: 'NOT_FOUND' });
}

export function serverError(message = 'Internal server error') {
  return apiError(message, { status: 500, code: 'INTERNAL_ERROR' });
} 