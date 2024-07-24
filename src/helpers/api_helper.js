import axios from "axios"
import { isValidToken } from "../auth/utils"

// apply base url for axios
const API_URL = process.env.REACT_APP_SERVER_API_URL

const instance = axios.create({ baseURL: API_URL })

instance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default instance;

export async function get(url, config = {}) {
  return await instance
    .get(url, { ...config })
    .then(response => response)
    .catch(err => {
      if(err.code === 'ERR_NETWORK') return err.code
      return err.response
    })
}

export async function post(url, data, config = {}) {
  return instance
    .post(url, data, { ...config })
    .then(response => response)
    .catch(err => {
      if(err.code === 'ERR_NETWORK') return err.code
      return err.response
    })
}

export async function postMultipart(url, data, config = {}) {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
  if(accessToken && isValidToken(accessToken)) {
    return instance
      .post(url, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${accessToken}`
        },
      })
      .then(response => response)
      .catch(err => {
        if(err.code === 'ERR_NETWORK') return err.code
        return err.response
      })
  }
}

export async function put(url, data, config = {}) {
  return instance
    .put(url, { ...data }, { ...config })
    .then(response => response)
    .catch(err => {
      if(err.code === 'ERR_NETWORK') return err.code
      return err.response
    })
}

export async function del(url, config = {}) {
  return await instance
    .delete(url, { ...config })
    .then(response => response)
    .catch(err => {
      if(err.code === 'ERR_NETWORK') return err.code
      return err.response
    })
}
