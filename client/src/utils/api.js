// API Utility for HAU Eco-Quest
const API_URL = '/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function to create headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['x-auth-token'] = token;
    }
  }

  return headers;
};

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: 'Network error' };
    }
    throw new Error(errorData.error || errorData.msg || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Auth APIs
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });
    return handleApiResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });
    return handleApiResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  requestPartnerAccess: async () => {
    const response = await fetch(`${API_URL}/auth/request-partner-access`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },
};

// User APIs
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleApiResponse(response);
  },

  getLeaderboard: async (department = 'all') => {
    const params = new URLSearchParams();
    if (department && department !== 'all') {
      params.append('department', department);
    }
    const response = await fetch(`${API_URL}/users/leaderboard?${params}`, {
      headers: getHeaders(false),
    });
    return handleApiResponse(response);
  },

  getUserProfile: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: getHeaders(false),
    });
    return handleApiResponse(response);
  },

  getUserStats: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}/stats`, {
      headers: getHeaders(false),
    });
    return handleApiResponse(response);
  },

  deleteAccount: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },
};

// Quest APIs
export const questAPI = {
  getAllQuests: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/quests?${params}`, {
      headers: getHeaders(false),
    });
    return handleApiResponse(response);
  },

  getQuestById: async (questId) => {
    const response = await fetch(`${API_URL}/quests/${questId}`, {
      headers: getHeaders(false),
    });
    return handleApiResponse(response);
  },

  createQuest: async (questData) => {
    const response = await fetch(`${API_URL}/quests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(questData),
    });
    return handleApiResponse(response);
  },

  updateQuest: async (questId, questData) => {
    const response = await fetch(`${API_URL}/quests/${questId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(questData),
    });
    return handleApiResponse(response);
  },

  deleteQuest: async (questId) => {
    const response = await fetch(`${API_URL}/quests/${questId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  submitQuest: async (questId, formData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/quests/${questId}/submit`, {
      method: 'POST',
      headers: {
        'x-auth-token': token,
      },
      body: formData, // FormData for file upload
    });
    return handleApiResponse(response);
  },

  getMySubmissions: async () => {
    const response = await fetch(`${API_URL}/quests/submissions/my`, {
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  getPendingSubmissions: async () => {
    const response = await fetch(`${API_URL}/quests/submissions/pending`, {
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  reviewSubmission: async (submissionId, status, rejection_reason = '') => {
    const response = await fetch(`${API_URL}/quests/submissions/${submissionId}/review`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, rejection_reason }),
    });
    return handleApiResponse(response);
  },
};

// Post/Community APIs
export const postAPI = {
  getAllPosts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/posts?${params}`, {
      headers: getHeaders(false),
    });
    return handleApiResponse(response);
  },

  getPostById: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      headers: getHeaders(false),
    });
    return handleApiResponse(response);
  },

  createPost: async (postData) => {
    const token = getAuthToken();

    // If there's a file, use FormData, otherwise use JSON
    if (postData.photo) {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('category', postData.category);
      formData.append('tags', JSON.stringify(postData.tags));
      formData.append('image', postData.photo);

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'x-auth-token': token
        },
        body: formData
      });
      return handleApiResponse(response);
    } else {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData),
      });
      return handleApiResponse(response);
    }
  },

  updatePost: async (postId, postData) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(postData),
    });
    return handleApiResponse(response);
  },

  deletePost: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  likePost: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  commentOnPost: async (postId, text) => {
    const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    return handleApiResponse(response);
  },
};

// Admin APIs
export const adminAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleApiResponse(response);
  },

  approvePartner: async (userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  getPartnerRequests: async () => {
    const response = await fetch(`${API_URL}/admin/partner-requests`, {
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },
};

// Notification APIs
export const notificationAPI = {
  getNotifications: async () => {
    console.log('API: Getting notifications...');
    const response = await fetch(`${API_URL}/notifications`, {
      headers: getHeaders(),
    });
    console.log('API: Notifications response status:', response.status);
    const result = await handleApiResponse(response);
    console.log('API: Notifications result:', result);
    return result;
  },

  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },

  markAllAsRead: async () => {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleApiResponse(response);
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  quest: questAPI,
  post: postAPI,
  admin: adminAPI,
  notification: notificationAPI,
};

