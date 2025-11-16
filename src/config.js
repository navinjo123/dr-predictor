// Configuration file for the Diabetic Retinopathy Detection app
// Update API_BASE before deployment

export const API_BASE = 'http://localhost:8000';

// API Endpoints (relative to API_BASE)
export const ENDPOINTS = {
  PREDICT: '/predict',
  EXPLAIN: '/explain',
  REPORT: '/report',
  HISTORY: '/history',
};
