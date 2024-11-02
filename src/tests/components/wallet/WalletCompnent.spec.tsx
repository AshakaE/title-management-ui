import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { ethers } from 'ethers'
import { useAuth } from '%/context/AuthContext'
import axios from 'axios'
import WalletComponent from '%/components/wallet/WalletComponent'

vi.mock('ethers')
vi.mock('axios')
vi.mock('%/context/AuthContext')

const localStorageMock = (() => {
    let store: { [key: string]: string } = {}
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString()
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('WalletComponent', () => {
    const mockWalletInfo = {
        address: '0x123...456',
        balance: '1.5',
        chainId: '1',
        network: 'mainnet',
    }

    const mockEthereum = {
        request: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.clear()

        vi.mocked(useAuth).mockReturnValue({
            walletConnected: vi.fn(),
            isAuthenticated: false,
            logout: vi.fn(),
        } as unknown as AuthContextProps)

        Object.defineProperty(window, 'ethereum', {
            value: mockEthereum,
            writable: true,
        })
    })

    it('renders initial state correctly', () => {
        render(<WalletComponent />)

        expect(screen.getByText('🔴')).toBeInTheDocument()
        expect(screen.getByText('0x....')).toBeInTheDocument()
        expect(screen.getByText('Connect wallet')).toBeInTheDocument()
        expect(screen.queryByText('Sign out')).not.toBeInTheDocument()
    })

    it('loads wallet info from localStorage on mount', async () => {
        localStorageMock.setItem('walletInfo', JSON.stringify(mockWalletInfo))
        const mockWalletConnected = vi.fn()
        vi.mocked(useAuth).mockReturnValue({
            walletConnected: mockWalletConnected,
            isAuthenticated: false,
            logout: vi.fn(),
        } as unknown as AuthContextProps)

        render(<WalletComponent />)

        await waitFor(() => {
            expect(mockWalletConnected).toHaveBeenCalledWith(true)
            expect(screen.getByText('🟢')).toBeInTheDocument()
            expect(screen.getByText(mockWalletInfo.address)).toBeInTheDocument()
        })
    })

    it('connects to MetaMask successfully', async () => {
        const mockProvider = {
            getBalance: vi.fn().mockResolvedValue(ethers.parseEther('1.5')),
            getNetwork: vi
                .fn()
                .mockResolvedValue({ chainId: 1, name: 'mainnet' }),
        }
        vi.mocked(ethers.BrowserProvider).mockImplementation(
            () => mockProvider as any,
        )
        mockEthereum.request.mockResolvedValueOnce(['0x123...456'])

        const mockWalletConnected = vi.fn()
        vi.mocked(useAuth).mockReturnValue({
            walletConnected: mockWalletConnected,
            isAuthenticated: false,
            logout: vi.fn(),
        } as unknown as AuthContextProps)

        render(<WalletComponent />)

        const connectButton = screen.getByText('Connect wallet')
        fireEvent.click(connectButton)

        await waitFor(() => {
            expect(mockWalletConnected).toHaveBeenCalledWith(true)
            expect(localStorage.getItem('walletInfo')).toBeTruthy()
        })
    })

    it('handles MetaMask connection error', async () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
        mockEthereum.request.mockRejectedValueOnce(new Error('User rejected'))

        render(<WalletComponent />)

        const connectButton = screen.getByText('Connect wallet')
        await fireEvent.click(connectButton)

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith(
                expect.stringContaining('Error connecting to MetaMask'),
            )
        })

        alertMock.mockRestore()
    })

    it('disconnects from MetaMask successfully', async () => {
        localStorageMock.setItem('walletInfo', JSON.stringify(mockWalletInfo))
        const mockWalletConnected = vi.fn()
        vi.mocked(useAuth).mockReturnValue({
            walletConnected: mockWalletConnected,
            isAuthenticated: false,
            logout: vi.fn(),
        } as unknown as AuthContextProps)

        render(<WalletComponent />)

        const disconnectButton = await screen.findByText('Disconnect wallet')
        fireEvent.click(disconnectButton)

        await waitFor(() => {
            expect(mockWalletConnected).toHaveBeenCalledWith(false)
            expect(localStorage.getItem('walletInfo')).toBeNull()
        })
    })

    it('handles sign out process', async () => {
        const mockLogout = vi.fn()
        vi.mocked(useAuth).mockReturnValue({
            walletConnected: vi.fn(),
            isAuthenticated: true,
            logout: mockLogout,
        } as unknown as AuthContextProps)
        vi.mocked(axios.post).mockResolvedValueOnce({})

        render(<WalletComponent />)

        const signOutButton = screen.getByText('Sign out')
        fireEvent.click(signOutButton)

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/logout')
            expect(mockLogout).toHaveBeenCalled()
        })
    })

    it('shows MetaMask not installed alert', async () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
        Object.defineProperty(window, 'ethereum', {
            value: undefined,
            writable: true,
        })

        render(<WalletComponent />)

        const connectButton = screen.getByText('Connect wallet')
        fireEvent.click(connectButton)

        expect(alertMock).toHaveBeenCalledWith('MetaMask not installed')
        alertMock.mockRestore()
    })

    it('displays wallet connection status correctly', () => {
        localStorageMock.setItem('walletInfo', JSON.stringify(mockWalletInfo))

        render(<WalletComponent />)

        const statusIndicator = screen.getByText('🟢')
        expect(statusIndicator).toBeInTheDocument()
        expect(screen.getByText(mockWalletInfo.address)).toBeInTheDocument()
    })

    it('shows sign out button only when authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({
            walletConnected: vi.fn(),
            isAuthenticated: true,
            logout: vi.fn(),
        } as unknown as AuthContextProps)

        render(<WalletComponent />)

        expect(screen.getByText('Sign out')).toBeInTheDocument()
    })
})
