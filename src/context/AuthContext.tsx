'use client'

import React, { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({
    children,
    initialToken,
}: {
    children: React.ReactNode
    initialToken?: string | null
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken)
    const [token, setToken] = useState<string | null>(initialToken || null)
    const [walletConnect, setWalletConnect] = useState<boolean>(false)
    const router = useRouter()

    const login = (newToken: string) => {
        setToken(newToken)
        setIsAuthenticated(true)
    }

    const walletConnected = (state: boolean) => {
        setWalletConnect(state)
    }

    const logout = () => {
        setWalletConnect(false)
        setToken(null)
        setIsAuthenticated(false)
        localStorage.removeItem('walletInfo')
        router.push('/')
        router.refresh()
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
                login,
                logout,
                walletConnected,
                walletConnect,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
