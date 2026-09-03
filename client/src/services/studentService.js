// client/src/services/studentService.js
import api from './api';

export async function getStudentDashboard() {
  const { data } = await api.get('/students/dashboard');
  return data.data;
}

export async function getFeedbackQuestions() {
  const { data } = await api.get('/feedback/questions');
  return data.data;
}

export async function submitFeedback(payload) {
  const { data } = await api.post('/feedback', payload);
  return data.data;
}
