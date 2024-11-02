import { NextResponse } from 'next/server'
import apiClient from '%/utils/apiClient'

export async function POST(request: Request) {
    try {
        const body = await request.json()

         const response = await apiClient.post('/auth/register', { ...body })

        return NextResponse.json(response)
    } catch (error: Error | any) {
        const { message, messages } = error.response.data

        return NextResponse.json(
            { error: messages || message },
            { status: error.status },
        )
    }
}
