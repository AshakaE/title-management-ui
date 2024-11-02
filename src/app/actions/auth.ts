'use server'

import { cookies } from 'next/headers'

export async function setAuthCookie(token: string) {
    (await cookies()).set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    })
}

export async function removeAuthCookie() {
    (await cookies()).delete('token')
}
