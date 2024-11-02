'use client'
import { useState } from 'react'
import axios from 'axios'
import { setAuthCookie } from '%/app/actions/auth'
import { useAuth } from '%/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
    const { login } = useAuth()
    const [isLogin, setLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const endpoint = isLogin ? '/api/login' : '/api/register'
        const payload = isLogin
            ? { email, password }
            : { username, email, password }

        try {
            const response = await axios(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(payload),
            })
            const { data } = response
            if (isLogin && data.token) {
                await setAuthCookie(data.token)
                login(data.token)
                router.push('/dashboard')
                router.refresh()
            }
            if (!isLogin && !data.user) {
                setEmail('')
                setUsername('')
                setPassword('')
                setLogin(false)
            } else {
                router.refresh()
            }
        } catch (error: any) {
            setError(error.response?.data?.error || 'An error occurred')
        }
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLogin((prev) => !prev)
    }

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <form
                onSubmit={handleSubmit}
                className='p-6 bg-white shadow-md rounded-lg w-full max-w-md'
            >
                <h2 className='text-2xl font-semibold text-center mb-6 text-gray-700'>
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                {error && (
                    <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
                        {error}
                    </div>
                )}
                {!isLogin && (
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        className='w-full p-3 mb-4 border rounded-md text-gray-900'
                        required
                    />
                )}
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                    className='w-full p-3 mb-4 border rounded-md text-gray-900'
                    required
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    className='w-full p-3 mb-4 border rounded-md text-gray-900'
                    required
                />
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600'
                >
                    {isLogin ? 'Login' : 'Register'}
                </button>
                <p className='text-center mt-4 text-gray-400'>
                    {isLogin
                        ? "Don't have an account? "
                        : 'Already have an account? '}
                    <button
                        type='button'
                        onClick={(e) => handleLogin(e)}
                        className='text-blue-500 underline'
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </form>
        </div>
    )
}
