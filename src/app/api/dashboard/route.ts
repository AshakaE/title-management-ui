import apiClient from '%/utils/apiClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const { data } = await apiClient.get('/title')

        return NextResponse.json(data)
    } catch (error: Error | any) {
        const { message, messages } = error.response.data
        return NextResponse.json(
            { error: messages || message },
            { status: error.status },
        )
    }
}
export async function POST(request: NextRequest) {
    const body = await request.json()
    try {
        const { data } = await apiClient.post('/title', { ...body })

        return NextResponse.json(data)
    } catch (error: Error | any) {
        const { message, messages } = error.response.data
        return NextResponse.json(
            { error: messages || message },
            { status: error.status },
        )
    }
}
