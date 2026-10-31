const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export async function apiFetch(path, options = {}) {
  const { headers, ...rest } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    ...rest,
  })

  if (!response.ok) {
    let errorDetail = `API request failed (${response.status})`
    try {
      const errJson = await response.json()
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail)
      }
    } catch {
      // ignore json parse failure
    }
    const err = new Error(errorDetail)
    err.status = response.status
    throw err
  }

  return response.status === 204 ? null : response.json()
}

// Public APIs (preserved from Phase 8)
export const healthApi = { get: () => apiFetch('/api/health') }
export const projectsApi = { get: () => apiFetch('/api/projects') }
export const skillsApi = { get: (category) => apiFetch(`/api/skills${category ? `?category=${category}` : ''}`) }
export const experienceApi = { get: () => apiFetch('/api/experience') }
export const educationApi = { get: () => apiFetch('/api/education') }
export const certificationsApi = { get: () => apiFetch('/api/certifications') }
export const contactApi = {
  post: (data) =>
    apiFetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
}

// Admin APIs (Phase 9)
export const adminApi = {
  auth: {
    login: (credentials) =>
      apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }),
    me: () => apiFetch('/api/admin/me'),
    logout: () => apiFetch('/api/admin/logout', { method: 'POST' }),
    changePassword: (data) =>
      apiFetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  },

  dashboard: {
    getStats: () => apiFetch('/api/admin/dashboard'),
  },

  projects: {
    getAll: () => apiFetch('/api/admin/projects'),
    get: (id) => apiFetch(`/api/admin/projects/${id}`),
    create: (data) =>
      apiFetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiFetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    delete: (id) => apiFetch(`/api/admin/projects/${id}`, { method: 'DELETE' }),
  },

  skills: {
    getAll: () => apiFetch('/api/admin/skills'),
    get: (id) => apiFetch(`/api/admin/skills/${id}`),
    create: (data) =>
      apiFetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiFetch(`/api/admin/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    delete: (id) => apiFetch(`/api/admin/skills/${id}`, { method: 'DELETE' }),
  },

  experience: {
    getAll: () => apiFetch('/api/admin/experience'),
    get: (id) => apiFetch(`/api/admin/experience/${id}`),
    create: (data) =>
      apiFetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiFetch(`/api/admin/experience/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    delete: (id) => apiFetch(`/api/admin/experience/${id}`, { method: 'DELETE' }),
  },

  education: {
    getAll: () => apiFetch('/api/admin/education'),
    get: (id) => apiFetch(`/api/admin/education/${id}`),
    create: (data) =>
      apiFetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiFetch(`/api/admin/education/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    delete: (id) => apiFetch(`/api/admin/education/${id}`, { method: 'DELETE' }),
  },

  certifications: {
    getAll: () => apiFetch('/api/admin/certifications'),
    get: (id) => apiFetch(`/api/admin/certifications/${id}`),
    create: (data) =>
      apiFetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiFetch(`/api/admin/certifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    delete: (id) => apiFetch(`/api/admin/certifications/${id}`, { method: 'DELETE' }),
  },

  messages: {
    getAll: () => apiFetch('/api/admin/messages'),
    get: (id) => apiFetch(`/api/admin/messages/${id}`),
    updateStatus: (id, status) =>
      apiFetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }),
    reply: (id, data) =>
      apiFetch(`/api/admin/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    delete: (id) => apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' }),
  },
}
