import apiClient from '%/utils/apiClient'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> },
) {
    const { uuid } = await params

    try {
        const { data } = await apiClient.delete(`/title/${uuid}`)

        return NextResponse.json(data)
    } catch (error: Error | any) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
