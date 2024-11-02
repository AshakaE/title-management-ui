interface Window {
    ethereum: any
}

interface WalletProps {
    address?: string
    balance?: string
    chainId?: string
    network?: string
}

interface AuthContextProps {
    isAuthenticated: boolean
    token: string | null
    login: (token: string) => void
    logout: () => void
    walletConnect: boolean
    walletConnected: (state: boolean) => void
}
