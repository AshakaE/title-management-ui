import { NextResponse } from 'next/server'
import apiClient from '%/utils/apiClient'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const { data } = await apiClient.post('/auth/login', { ...body })

        return NextResponse.json(data)
    } catch (error: Error | any) {
        if (error.response && error.response.data) {
            const { message, messages } = error.response.data
            return NextResponse.json(
                { error: messages || message },
                { status: error.status },
            )
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
