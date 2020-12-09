import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { getAccessToken, setAccessToken } from './session'

export interface ApiError extends AxiosError {
  response: AxiosResponse<{ code: string }>
}

const refreshAccessTokenIfNeeded = async () => {
  const accessToken = getAccessToken()

  if (!accessToken) {
    return
  }

  const exp = jwtDecode<JwtPayload>(accessToken).exp!

  if (Date.now() > exp * 1000) {
    const refreshTokenResponse = await axios({
      method: 'POST',
      url: process.env.API_ROOT! + '/refresh-token',
      withCredentials: true
    })

    setAccessToken(refreshTokenResponse.data.accessToken)
  }
}

export const request = async <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  await refreshAccessTokenIfNeeded()

  return axios({
    ...config,
    url: process.env.API_ROOT! + config.url,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${getAccessToken()}`
    },
    withCredentials: true
  })
}
