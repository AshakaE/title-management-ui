import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '%/context/AuthContext'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}))

const localStorageMock = {
    removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('AuthContext and AuthProvider', () => {
    const mockRouter = {
        push: vi.fn(),
        refresh: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useRouter).mockReturnValue(
            mockRouter as unknown as AppRouterInstance,
        )
    })

    describe('AuthProvider', () => {
        it('initializes with no token', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            )

            const { result } = renderHook(() => useAuth(), { wrapper })

            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.token).toBeNull()
            expect(result.current.walletConnect).toBe(false)
        })

        it('initializes with provided token', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider initialToken='test-token'>
                    {children}
                </AuthProvider>
            )

            const { result } = renderHook(() => useAuth(), { wrapper })

            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.token).toBe('test-token')
        })

        it('handles login correctly', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            )

            const { result } = renderHook(() => useAuth(), { wrapper })

            act(() => {
                result.current.login('new-token')
            })

            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.token).toBe('new-token')
        })

        it('handles wallet connection state', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            )

            const { result } = renderHook(() => useAuth(), { wrapper })

            act(() => {
                result.current.walletConnected(true)
            })

            expect(result.current.walletConnect).toBe(true)
        })

        it('handles logout correctly', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider initialToken='test-token'>
                    {children}
                </AuthProvider>
            )

            const { result } = renderHook(() => useAuth(), { wrapper })

            act(() => {
                result.current.logout()
            })

            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.token).toBeNull()
            expect(result.current.walletConnect).toBe(false)
            expect(localStorageMock.removeItem).toHaveBeenCalledWith(
                'walletInfo',
            )
            expect(mockRouter.push).toHaveBeenCalledWith('/')
            expect(mockRouter.refresh).toHaveBeenCalled()
        })
    })

    describe('useAuth Hook', () => {
        it('throws error when useAuth is used outside AuthProvider', () => {
            assert.throws(() => {
                const { result } = renderHook(() => useAuth())
                result.current
            }, 'useAuth must be used within an AuthProvider')
        })

        it('provides all required methods and properties', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            )

            const { result } = renderHook(() => useAuth(), { wrapper })

            expect(result.current).toHaveProperty('isAuthenticated')
            expect(result.current).toHaveProperty('token')
            expect(result.current).toHaveProperty('login')
            expect(result.current).toHaveProperty('logout')
            expect(result.current).toHaveProperty('walletConnected')
            expect(result.current).toHaveProperty('walletConnect')
        })
    })

    describe('AuthProvider Integration', () => {
        it('maintains state through multiple actions', () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            )

            const { result } = renderHook(() => useAuth(), { wrapper })

            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.walletConnect).toBe(false)


            act(() => {
                result.current.walletConnected(true)
            })
            expect(result.current.walletConnect).toBe(true)


            act(() => {
                result.current.login('test-token')
            })
            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.token).toBe('test-token')

            act(() => {
                result.current.logout()
            })
            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.token).toBeNull()
            expect(result.current.walletConnect).toBe(false)
        })

        it('renders children with context', () => {
            const TestComponent = () => {
                const { isAuthenticated } = useAuth()
                return (
                    <div>
                        {isAuthenticated
                            ? 'Authenticated'
                            : 'Not Authenticated'}
                    </div>
                )
            }

            const { getByText } = render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>,
            )

            expect(getByText('Not Authenticated')).toBeInTheDocument()
        })
    })
})
