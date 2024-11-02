import { removeAuthCookie, setAuthCookie } from '%/app/actions/auth'
import { describe, it, vi, expect } from 'vitest'

vi.mock('next/headers', () => {
    const cookieStore = {
        set: vi.fn(),
        delete: vi.fn(),
    }

    return {
        cookies: vi.fn().mockResolvedValue(cookieStore),
    }
})

describe('Auth Cookie Functions', () => {
    it('sets the auth cookie with correct options', async () => {
        const mockToken = 'test-token'
        const cookieStore = await import('next/headers').then((mod) =>
            mod.cookies(),
        )

        await setAuthCookie(mockToken)

        expect(cookieStore.set).toHaveBeenCalledWith('token', mockToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })
    })

    it('removes the auth cookie', async () => {
        const cookieStore = await import('next/headers').then((mod) =>
            mod.cookies(),
        )

        await removeAuthCookie()

        expect(cookieStore.delete).toHaveBeenCalledWith('token')
    })
})
