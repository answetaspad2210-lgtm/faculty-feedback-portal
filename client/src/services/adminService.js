// client/src/services/adminService.js
import api from './api';

export async function getAdminDashboard() {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
}

export async function getReports(filters) {
  const { data } = await api.get('/admin/reports', { params: filters });
  return data.data;
}

// Students
export const getStudents = async () => (await api.get('/admin/students')).data.data;
export const createStudent = async (payload) => (await api.post('/admin/students', payload)).data.data;
export const updateStudent = async (id, payload) => (await api.put(`/admin/students/${id}`, payload)).data.data;
export const deleteStudent = async (id) => (await api.delete(`/admin/students/${id}`)).data;

// Faculty
export const getFaculty = async () => (await api.get('/faculty')).data.data;
export const createFaculty = async (payload) => (await api.post('/admin/faculty', payload)).data.data;
export const updateFaculty = async (id, payload) => (await api.put(`/admin/faculty/${id}`, payload)).data.data;
export const deleteFaculty = async (id) => (await api.delete(`/admin/faculty/${id}`)).data;

// Courses
export const getCourses = async () => (await api.get('/courses')).data.data;
export const createCourse = async (payload) => (await api.post('/admin/courses', payload)).data.data;
export const updateCourse = async (id, payload) => (await api.put(`/admin/courses/${id}`, payload)).data.data;
export const deleteCourse = async (id) => (await api.delete(`/admin/courses/${id}`)).data;

// Feedback Questions
export const getAllQuestions = async () => (await api.get('/admin/questions')).data.data;
export const createQuestion = async (payload) => (await api.post('/admin/questions', payload)).data.data;
export const updateQuestion = async (id, payload) => (await api.put(`/admin/questions/${id}`, payload)).data.data;
export const deleteQuestion = async (id) => (await api.delete(`/admin/questions/${id}`)).data;
