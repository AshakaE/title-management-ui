import axios from 'axios'
import { cookies } from 'next/headers'

const apiClient = axios.create({
    baseURL: process.env.API_URL,
    headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(
    async (config) => {
        const cookieStore = await cookies()
        const cookieData  = cookieStore.get('token')

        if (cookieData && cookieData.value) {
            config.headers['Authorization'] = cookieData.value
        }
        return config
    },
    (error) => Promise.reject(error),
)

export default apiClient
