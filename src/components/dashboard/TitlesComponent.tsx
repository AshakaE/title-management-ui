import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '%/context/AuthContext'
import { CreateTitleForm } from './CreateTitleForm'

interface TitleProps {
    createdAt: string
    updatedAt: string
    uuid: string
    subject: string
    title: string
}

export default function TitlesComponent() {
    const { walletConnect } = useAuth()
    const [titles, setTitles] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const fetchTitles = async () => {
        const { data } = await axios.get('/api/dashboard')
        setTitles(data)
    }

    useEffect(() => {
        fetchTitles()
    }, [])

    const handleDelete = async (uuid: string) => {
        if (window.confirm('Are you sure you want to delete this title?')) {
            try {
                await axios.delete(`/api/dashboard/${uuid}`)
                fetchTitles() 
            } catch (error) {
                alert('Error deleting title')
                console.error('Error:', error)
            }
        }
    }

    return (
        <>
            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md m-4 relative'>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
                        >
                            ✕
                        </button>

                        <h2 className='text-xl font-semibold mb-4 text-black'>
                            Create New Title
                        </h2>

                        <CreateTitleForm
                            onSuccess={() => {
                                setIsModalOpen(false)
                                fetchTitles() 
                            }}
                        />
                    </div>
                </div>
            )}
            <div
                className='space-y-6 w-full max-h-[600px] overflow-y-auto shadow-inner bg-gray-200 border 
  border-gray-200 
  rounded-lg px-4'
            >
                {titles.map((title: TitleProps) => (
                    <div
                        key={title.uuid}
                        className='p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200'
                    >
                        <div className='flex justify-between items-start'>
                            <div className='space-y-2'>
                                <h3 className='text-2xl font-semibold text-gray-800'>
                                    title | {title.title}
                                </h3>
                                <h4 className='text-xl text-gray-800'>
                                    {title.subject && `subject | ${title.subject} `}
                                </h4>
                                <p className='text-sm text-gray-500'>
                                   created | {new Date(
                                        title.createdAt,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <button
                                disabled={!walletConnect}
                                onClick={() => handleDelete(title.uuid)}
                                className={`
                                p-3
                                rounded-lg
                                text-white
                                ${
                                    !walletConnect
                                        ? 'bg-red-100 cursor-not-allowed opacity-75'
                                        : 'bg-red-500 hover:bg-red-900'
                                }
                                `}
                            >
                                Delete title
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                disabled={!walletConnect}
                onClick={() => setIsModalOpen(true)}
                className={`
          p-4
          w-[15%]
          my-2
          rounded-lg
          text-white
          ${
              !walletConnect
                  ? 'bg-gray-400 cursor-not-allowed opacity-75'
                  : 'bg-black hover:bg-gray-800'
          }
        `}
            >
                Add title
            </button>
        </>
    )
}
