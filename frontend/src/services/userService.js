import api from './api';

class UserService {
  // User registration
  async registerUser(userData) {
    const response = await api.post('/user/register', userData);
    return response.data;
  }

  // Get user by ID
  async getUserById(userId) {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  }

  // Update user
  async updateUser(userId, userData) {
    const response = await api.put(`/user/${userId}`, userData);
    return response.data;
  }

  // Get active polls
  async getActivePolls() {
    const response = await api.get('/user/polls/active');
    return response.data;
  }

  // Get poll by ID
  async getPollById(pollId) {
    const response = await api.get(`/user/polls/${pollId}`);
    return response.data;
  }

  // Get poll options
  async getPollOptions(pollId) {
    const response = await api.get(`/user/polls/${pollId}/options`);
    return response.data;
  }

  // Submit vote
  async submitVote(userId, pollId, optionId) {
    const response = await api.post(`/user/${userId}/polls/${pollId}/vote`, {
      optionId: optionId
    });
    return response.data;
  }

  // Check if user has voted
  async hasUserVoted(userId, pollId) {
    const response = await api.get(`/user/${userId}/polls/${pollId}/voted`);
    return response.data;
  }

  // Get poll results
  async getPollResults(pollId) {
    const response = await api.get(`/user/polls/${pollId}/results`);
    return response.data;
  }
}

const userService = new UserService();
export default userService;
