// server/config/constants.js
// Central place for fixed values used across the backend.
// Editing values here updates them everywhere they're referenced -
// avoids "magic strings" scattered through the codebase.

const ROLES = Object.freeze({
  STUDENT: 'student',
  ADMIN: 'admin',
});

const QUESTION_TYPES = Object.freeze({
  STAR: 'star',
  NUMERIC: 'numeric',
  SLIDER: 'slider',
  YES_NO: 'yes_no',
  MULTIPLE_CHOICE: 'multiple_choice',
  TEXT: 'text',
});

const FEEDBACK_STATUS = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
});

module.exports = { ROLES, QUESTION_TYPES, FEEDBACK_STATUS };
