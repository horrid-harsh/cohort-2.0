import axios from 'axios'

// ─── Base instance — used by ALL feature API files ────────────────────────────
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,   // sends httpOnly cookies on every request
  timeout: 10000,
})

// ─── Response Interceptor — handles 401 → auto token refresh + retry ──────────
let isRefreshing = false
let failedQueue = []      // queues requests that came in while refresh was ongoing

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    // Only attempt refresh on 401 and if we haven't already retried
    // Also, DON'T attempt refresh for the refresh-token endpoint itself!
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {

      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => axiosInstance(originalRequest))
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axiosInstance.post('/auth/refresh-token')
        processQueue(null)
        return axiosInstance(originalRequest)   // retry original request
      } catch (refreshError) {
        processQueue(refreshError)
        // Refresh failed — user needs to log in again
        // Dispatch a custom event so the Redux store can clear auth state
        window.dispatchEvent(new CustomEvent('auth:session-expired'))
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
