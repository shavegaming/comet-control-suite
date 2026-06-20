import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="w-64 bg-gray-900 border-r border-cyan-900/30 p-6 flex flex-col gap-4">
                        <h1 className="text-2xl font-bold text-cyan-400 mb-8">☄️ Comet Suite</h1>
                        <nav className="flex flex-col gap-2">
                            <a href="/" className="p-2 hover:bg-cyan-900/20 rounded">Dashboard</a>
                            <a href="/executor" className="p-2 hover:bg-cyan-900/20 rounded">Executor</a>
                            <a href="/logs" className="p-2 hover:bg-cyan-900/20 rounded">Action Logs</a>
                            <a href="/settings" className="p-2 hover:bg-cyan-900/20 rounded">Blacklist</a>
                        </nav>
                    </aside>
                    <main className="flex-1 p-8">{children}</main>
                </div>
            </body>
        </html>
    );
}
