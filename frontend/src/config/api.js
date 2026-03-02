export const API_BASE_URL = '';

export const API_ENDPOINTS = {
  GET_TASKS: () => `${API_BASE_URL}/api/tasks`,
  POST_TASKS: () => `${API_BASE_URL}/api/tasks`,
  PUT_TASKS_ID: (id) => `${API_BASE_URL}/api/tasks/${id}`,
  DELETE_TASKS_ID: (id) => `${API_BASE_URL}/api/tasks/${id}`,
  PATCH_TASKS_ID_TOGGLE: (id) => `${API_BASE_URL}/api/tasks/${id}/toggle`
};