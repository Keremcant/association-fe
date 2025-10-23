import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================npm rju
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})


// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {

  // Retrieve token from localStorage
  const token = useCookie('associationToken').value

  // If token is found
  if (token) {
    // Get request headers and if headers is undefined assign blank object
    config.headers = config.headers || {}

    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.Authorization = token ? `Bearer ${token}` : ''
  }

  // Return modified config
  return config
})

// ℹ️ Add response interceptor to handle 401 response
axiosIns.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 500 || error.response.status === 400 || error.response.status === 404 || error.response.status === 403
        || error.response.status === 401 || error.response.status === 460) {

      return error.response
    }
  },
)
export default axiosIns
