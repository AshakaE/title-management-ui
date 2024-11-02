import { AuthProvider } from '%/context/AuthContext'
import { cookies } from 'next/headers'
import './globals.css'
import WalletComponent from '../components/wallet/WalletComponent'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || null

    return (
        <html lang='en'>
            <body className='bg-gray-900 h-screen'>
                <AuthProvider initialToken={token}>
                    <WalletComponent />
                    <main className='container min-w-full h-[calc(100vh-10vh)] bg-gray-100'>
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    )
}
