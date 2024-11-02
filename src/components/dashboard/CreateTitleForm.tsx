import { useAuth } from '%/context/AuthContext'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CreateTitleForm({ onSuccess }: any) {
    const router = useRouter()
    const { logout } = useAuth()
    const [title, setTitle] = useState('')
    const [subject, setSubject] = useState('')

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('/api/dashboard', {
                title,
                subject,
            })

            onSuccess()
            setTitle('')
            setSubject('')
        } catch (error: Error | any) {
            if (error.status === 401) {
                logout()
                router.push('/')
                router.refresh()
            }
            console.log(error.status)
        }
    }

    return (
        <form onSubmit={handleCreate} className='space-y-4'>
            <div className='space-y-2'>
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Title'
                    className='w-full p-3 border rounded-lg focus:ring-1 focus:ring-gray-700 focus:outline-none'
                />
            </div>

            <div className='space-y-2'>
                <textarea
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder='Subject'
                    rows={4}
                    className='w-full p-3 border rounded-lg focus:ring-1 focus:ring-gray-700 focus:outline-none'
                />
            </div>

            <button
                type='submit'
                className='w-full bg-black text-white p-3 rounded-lg hover:bg-gray-900 
                 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 
                 focus:ring-black focus:outline-none'
            >
                Create Title
            </button>
        </form>
    )
}
