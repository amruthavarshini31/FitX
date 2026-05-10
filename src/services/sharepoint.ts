const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const sharepointService = {
  // Users Profile (Mocked in Frontend as it's not implemented in Backend)
  getUserProfile: async (userId: string) => {
    return new Promise((resolve) => setTimeout(() => resolve({ id: userId, height: 180, weight: 75, goalSteps: 10000, goalCalories: 2500 }), 300));
  },
  
  // Workouts List
  getWorkouts: async (userId: string) => {
    const response = await fetch(`${API_URL}/workouts`, { headers: getAuthHeaders() });
    return await response.json();
  },
  saveWorkout: async (workoutData: any) => {
    const response = await fetch(`${API_URL}/workouts`, { 
      method: 'POST', 
      headers: getAuthHeaders(),
      body: JSON.stringify(workoutData)
    });
    return await response.json();
  },

  // DietLogs List
  getDietLogs: async (userId: string) => {
    const response = await fetch(`${API_URL}/diet`, { headers: getAuthHeaders() });
    return await response.json();
  },
  saveDietLog: async (dietData: any) => {
    const response = await fetch(`${API_URL}/diet`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dietData)
    });
    return await response.json();
  },

  // Steps List
  getSteps: async (userId: string) => {
    const response = await fetch(`${API_URL}/steps`, { headers: getAuthHeaders() });
    return await response.json();
  },

  // Water
  getWater: async (userId: string) => {
    const response = await fetch(`${API_URL}/water`, { headers: getAuthHeaders() });
    return await response.json();
  },
  saveWater: async (userId: string, glasses: number) => {
    const response = await fetch(`${API_URL}/water`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ glasses })
    });
    return await response.json();
  },

  // Calories
  getCalories: async (userId: string) => {
    const response = await fetch(`${API_URL}/calories`, { headers: getAuthHeaders() });
    return await response.json();
  },

  // AI Chat
  chat: async (message: string) => {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    return await response.json();
  }
};
