'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '%/context/AuthContext'
import TitlesComponent from '%/components/dashboard/TitlesComponent'

export default function TitlePage() {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/')
            router.refresh()
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) return null


    return (
        <div className='bg-gray-100 w-full flex flex-col items-center'>
            <h1 className='text-2xl font-bold mb-4 text-gray-900 text-center bg-gray-200 p-4 mx-6 rounded-md'>
                TITLE MANAGEMENT
            </h1>
            <TitlesComponent />
        </div>
    )
}
