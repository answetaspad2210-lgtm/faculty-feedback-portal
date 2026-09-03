// client/src/utils/getErrorMessage.js
// Extracts a readable message from an axios error, falling back to a
// generic message so the UI never shows "undefined" or a raw stack trace.
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}
