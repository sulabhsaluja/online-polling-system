import api from './api';

class AdminService {
  // Admin registration
  async registerAdmin(adminData) {
    const response = await api.post('/admin/register', adminData);
    return response.data;
  }

  // Admin login
  async loginAdmin(credentials) {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  }

  // Get admin by ID
  async getAdminById(adminId) {
    const response = await api.get(`/admin/${adminId}`);
    return response.data;
  }

  // Update admin
  async updateAdmin(adminId, adminData) {
    const response = await api.put(`/admin/${adminId}`, adminData);
    return response.data;
  }

  // Create poll
  async createPoll(adminId, pollData) {
    const response = await api.post(`/admin/${adminId}/polls`, pollData);
    return response.data;
  }

  // Get admin's polls
  async getAdminPolls(adminId) {
    const response = await api.get(`/admin/${adminId}/polls`);
    return response.data;
  }

  // Get admin's active polls
  async getActiveAdminPolls(adminId) {
    const response = await api.get(`/admin/${adminId}/polls/active`);
    return response.data;
  }

  // Update poll
  async updatePoll(adminId, pollId, pollData) {
    const response = await api.put(`/admin/${adminId}/polls/${pollId}`, pollData);
    return response.data;
  }

  // Deactivate poll
  async deactivatePoll(adminId, pollId) {
    const response = await api.patch(`/admin/${adminId}/polls/${pollId}/deactivate`);
    return response.data;
  }

  // Activate poll
  async activatePoll(adminId, pollId) {
    const response = await api.patch(`/admin/${adminId}/polls/${pollId}/activate`);
    return response.data;
  }

  // Delete poll
  async deletePoll(adminId, pollId) {
    const response = await api.delete(`/admin/${adminId}/polls/${pollId}`);
    return response.data;
  }

  // Get poll results (admin view)
  async getPollResults(pollId) {
    const response = await api.get(`/admin/polls/${pollId}/results`);
    return response.data;
  }

  // Get poll options
  async getPollOptions(pollId) {
    const response = await api.get(`/admin/polls/${pollId}/options`);
    return response.data;
  }
}

const adminService = new AdminService();
export default adminService;
