// Auth API
export {
  login,
  register,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from './auth';

// Dashboard API
export {
  getDashboardData,
  getDashboardStats,
  getRevenueData,
  getUserGrowthData,
  getActivityLogs,
  getRecentActivity,
} from './dashboard';

// Forms API
export {
  getFormSchemas,
  getFormSchema,
  submitContactForm,
  submitProfileForm,
  submitForm,
  getFormSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
} from './forms';

// PDF API
export {
  getPDFTemplates,
  getPDFTemplate,
  generatePDF,
  getGeneratedPDFs,
  deletePDF,
  downloadPDF,
  createDocuSignEnvelope,
  getDocuSignEnvelopes,
  getDocuSignEnvelope,
  voidDocuSignEnvelope,
} from './pdf';

// Users API
export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getSettings,
  updateSettings,
} from './users';
