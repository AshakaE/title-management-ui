/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAuth } from '%/context/AuthContext'
import axios from 'axios'

const WALLET_INFO_KEY = 'walletInfo'

export default function WalletComponent() {
    const { walletConnected, isAuthenticated, logout } = useAuth()
    const [accountData, setAccountData] = useState<WalletProps | undefined>({})


    useEffect(() => {
        const storedWalletInfo = localStorage.getItem(WALLET_INFO_KEY)
        if (storedWalletInfo) {
            walletConnected(true)
            setAccountData(JSON.parse(storedWalletInfo) as WalletProps)
        }
    }, [walletConnected])


    const connectToMetaMask = useCallback(async () => {
        const ethereum = window.ethereum
        if (!ethereum) return alert('MetaMask not installed')

        try {
            const [address] = await ethereum.request({
                method: 'eth_requestAccounts',
            })
            const provider = new ethers.BrowserProvider(ethereum)
            const balance = await provider.getBalance(address)
            const network = await provider.getNetwork()

            const walletData: WalletProps = {
                address,
                balance: ethers.formatEther(balance),
                chainId: network.chainId.toString(),
                network: network.name,
            }

            setAccountData(walletData)
            localStorage.setItem(WALLET_INFO_KEY, JSON.stringify(walletData))
            walletConnected(true)
        } catch (error: any) {
            alert(`Error connecting to MetaMask: ${error?.message || error}`)
        }
    }, [walletConnected])


    const disconnectMetaMask = useCallback(async () => {
        const ethereum = window.ethereum
        if (!ethereum) return alert('MetaMask not installed')

        try {
            await ethereum.request({
                method: 'wallet_revokePermissions',
                params: [{ eth_accounts: {} }],
            })
            localStorage.removeItem(WALLET_INFO_KEY)
            walletConnected(false)
            setAccountData({})
        } catch (error: any) {
            alert(
                `Error disconnecting from MetaMask: ${error?.message || error}`,
            )
        }
    }, [walletConnected])


    const signOut = useCallback(async () => {
        const ethereum = window.ethereum
        if (ethereum) {
            await ethereum.request({
                method: 'wallet_revokePermissions',
                params: [{ eth_accounts: {} }],
            })
        }

        await axios.post('/api/logout')

        setAccountData({})
        logout()
    }, [logout])


    return (
        <div className='flex flex-col before:from-white after:from-sky-200 h-[10vh]'>
            <div className='flex bg-gray-100 flex-1 justify-center items-center p-4'>
                <div className='flex-1 px-2 mx-2 text-black'>
                    {accountData?.address ? '🟢 ' : '🔴 '}
                    <span>{accountData?.address ?? '0x....'}</span>
                </div>
                <div className='flex gap-x-3'>
                    {accountData?.address ? (
                        <button
                            onClick={disconnectMetaMask}
                            className='bg-black hover:bg-gray-800 text-white p-4 rounded-lg'
                        >
                            Disconnect wallet
                        </button>
                    ) : (
                        <button
                            onClick={connectToMetaMask}
                            className='bg-black hover:bg-gray-800 text-white p-4 rounded-lg'
                        >
                            Connect wallet
                        </button>
                    )}
                    {isAuthenticated && (
                        <button
                            onClick={signOut}
                            className='bg-black hover:bg-gray-800 text-white p-4 rounded-lg'
                        >
                            Sign out
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

