import { describe, test, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '%/middleware'

vi.mock('next/server', async () => {
    const actual = await vi.importActual<typeof import('next/server')>(
        'next/server',
    )
    return {
        ...actual,
        NextResponse: {
            redirect: vi.fn(),
            next: vi.fn(),
        },
    }
})

describe('middleware', () => {
    const getRequest = (pathname: string, token?: string): NextRequest => {
        const url = `http://localhost${pathname}`
        return {
            nextUrl: { pathname, origin: 'http://localhost' },
            cookies: {
                get: vi.fn(() => (token ? { value: token } : undefined)),
            },
            url,
        } as unknown as NextRequest
    }

    const redirectMock = NextResponse.redirect 
    const nextMock = NextResponse.next 

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('redirects to login if token is missing and route is protected', () => {
        const request = getRequest('/protected-route')

        middleware(request)

        expect(redirectMock).toHaveBeenCalledWith(
            new URL('/?returnUrl=%2Fprotected-route', request.url),
        )
        expect(nextMock).not.toHaveBeenCalled()
    })

    test('allows access to public route without token', () => {
        const request = getRequest('/')

        middleware(request)

        expect(nextMock).toHaveBeenCalled()
        expect(redirectMock).not.toHaveBeenCalled()
    })

    test('redirects to home if token is present and route is public', () => {
        const request = getRequest('/', 'valid_token')

        middleware(request)

        expect(redirectMock).toHaveBeenCalledWith(new URL('/', request.url))
        expect(nextMock).not.toHaveBeenCalled()
    })

    test('allows access to protected route with token', () => {
        const request = getRequest('/protected-route', 'valid_token')

        middleware(request)

        expect(nextMock).toHaveBeenCalled()
        expect(redirectMock).not.toHaveBeenCalled()
    })
})
