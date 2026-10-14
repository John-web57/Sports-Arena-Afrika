/**
 * Sports Arena Afrika - API Client
 * Connects the React Reader Frontend to the Spring Boot REST API
 */

const defaultApiHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const API_BASE_URLS = configuredApiUrl
  ? [configuredApiUrl]
  : [`http://${defaultApiHost}:8080/api`, `http://${defaultApiHost}:18081/api`, `http://${defaultApiHost}:18082/api`];
let activeApiBaseUrl = null;

async function fetchApi(endpoint, options = {}) {
  const candidates = activeApiBaseUrl
    ? [activeApiBaseUrl, ...API_BASE_URLS.filter(url => url !== activeApiBaseUrl)]
    : API_BASE_URLS;
  let lastError;
  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, { ...options, credentials: 'include' });
      activeApiBaseUrl = baseUrl;
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  const tried = candidates.join(', ');
  throw new Error(`Failed to fetch from the API (${tried}). Start the backend or set VITE_API_URL. ${lastError?.message || ''}`.trim());
}

async function request(endpoint, options = {}) {
  const { throwErrors = false, ...fetchOptions } = options;
  try {
    const headers = { 'Content-Type': 'application/json', ...fetchOptions.headers };

    const response = await fetchApi(endpoint, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      let detail = '';
      try {
        const body = await response.json();
        detail = body.detail || body.message || body.error || '';
      } catch { /* The server may return an empty or non-JSON error. */ }
      throw new Error(`API error: ${response.status} ${response.statusText}${detail ? `: ${detail}` : ''}`);
    }

    if (response.status === 204) return true;
    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') ? await response.json() : true;
  } catch (error) {
    if (throwErrors) throw error;
    console.warn(`[Sports Arena Afrika API] Offline or unreachable at ${endpoint}:`, error.message);
    return null;
  }
}

export const api = {
  // Articles
  getTopNews: () => request('/articles/top-news'),
  getBreakingNews: () => request('/articles/breaking'),
  getArticles: () => request('/articles'),
  getEditorialArticles: () => request('/articles/manage'),
  getMyArticles: () => request('/articles/mine'),
  searchArticles: (query) => request(`/articles/search?q=${encodeURIComponent(query)}`),
  getArticleBySlug: (slug) => request(`/articles/${slug}`),
  createArticle: (data) => request('/articles', { method: 'POST', body: JSON.stringify(data) }),
  updateArticle: (id, data) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  publishArticle: (id) => request(`/articles/${id}/publish`, { method: 'PUT' }),
  submitArticleForReview: (id) => request(`/articles/${id}/submit-review`, { method: 'PUT' }),
  approveArticle: (id) => request(`/articles/${id}/approve`, { method: 'PUT' }),
  deleteArticle: (id) => request(`/articles/${id}`, { method: 'DELETE' }),
  uploadImage: async (file) => {
    const form = new FormData();
    form.append('file', file);
    const response = await fetchApi('/media/image', { method: 'POST', body: form });
    if (!response.ok) {
      let detail = '';
      try {
        const body = await response.json();
        detail = body.detail || body.message || body.error || '';
      } catch { /* Some gateway errors have no JSON body. */ }
      throw new Error(detail || `Media upload failed (${response.status} ${response.statusText})`);
    }
    return response.json();
  },

  // Users Management
  getUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  createUser: (userData) => request('/users', { method: 'POST', body: JSON.stringify(userData), throwErrors: true }),
  updateUser: (id, userData) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(userData), throwErrors: true }),
  updateUserPassword: (id, password) => request(`/users/${id}/password`, { method: 'PUT', body: JSON.stringify({ password }) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),


  // Discussions & Comments
  getTrendingDiscussions: () => request('/discussions'),
  likeDiscussion: (id) => request(`/discussions/${id}/like`, { method: 'POST' }),
  addComment: (id, commentData) =>
    request(`/discussions/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),

  // Opinion Polls
  getActivePoll: () => request('/polls/active'),
  votePoll: (pollId, optionId) =>
    request(`/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    }),

  // Categories & Auth
  getCategories: () => request('/categories'),
  getWebsiteAppearance: () => request('/settings/appearance', { cache: 'no-store' }),
  saveWebsiteAppearance: (settings) => request('/settings/appearance', { method: 'PUT', body: JSON.stringify(settings), throwErrors: true }),
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

export default api;
