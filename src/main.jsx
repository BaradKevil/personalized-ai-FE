import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ThemeModeProvider } from './themeMode'
import ErrorBoundary from './common/ErrorBoundary'

const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={client}>
                <ThemeModeProvider>
                    <App />
                </ThemeModeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>,
)
