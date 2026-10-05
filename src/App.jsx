import './App.css'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthGaurd, LogGaurd } from './common/Gaurd'
import Layout from './common/Layout'
import MiloCore from './components/milo/MiloCore'

const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Today = lazy(() => import('./pages/home/Today'))
const Chat = lazy(() => import('./pages/chat/Chat'))
const Tasks = lazy(() => import('./pages/tasks/Tasks'))
const Goals = lazy(() => import('./pages/goals/Goals'))
const Memory = lazy(() => import('./pages/memory/Memory'))
const Settings = lazy(() => import('./pages/settings/Settings'))
const Calendar = lazy(() => import('./pages/calendar/Calendar'))
const Reminders = lazy(() => import('./pages/reminders/Reminders'))
const Habits = lazy(() => import('./pages/habits/Habits'))
const Insights = lazy(() => import('./pages/insights/Insights'))
const Progress = lazy(() => import('./pages/progress/Progress'))
const Notifications = lazy(() => import('./pages/notifications/Notifications'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Scene = lazy(() => import('./shaders/Scene'))

const router = createBrowserRouter([
    {
        path: '/kibori',
        element: <Scene />,
    },
    {
        path: '/landing',
        element: <Scene />,
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: (
            <LogGaurd>
                <Login />
            </LogGaurd>
        ),
    },
    {
        path: '/register',
        element: (
            <LogGaurd>
                <Register />
            </LogGaurd>
        ),
    },
    {
        path: '/app',
        element: (
            <AuthGaurd>
                <Layout />
            </AuthGaurd>
        ),
        children: [
            { path: '', element: <Today /> },
            { path: 'chat', element: <Chat /> },
            { path: 'chat/:conversationId', element: <Chat /> },
            { path: 'tasks', element: <Tasks /> },
            { path: 'goals', element: <Goals /> },
            { path: 'memory', element: <Memory /> },
            { path: 'settings', element: <Settings /> },
            { path: 'calendar', element: <Calendar /> },
            { path: 'reminders', element: <Reminders /> },
            { path: 'habits', element: <Habits /> },
            { path: 'insights', element: <Insights /> },
            { path: 'progress', element: <Progress /> },
            { path: 'notifications', element: <Notifications /> },
        ],
    },
    {
        path: '/not-found',
        element: <NotFound />,
    },
    {
        path: '*',
        element: <Navigate to="/not-found" replace />,
    },
])

function App() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <RouterProvider router={router} />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                toastStyle={{ borderRadius: '8px', fontFamily: 'var(--font-sans)' }}
            />
        </Suspense>
    )
}

const LoadingScreen = () => (
    <div
        style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            background: 'var(--bg)',
            color: 'var(--ink-soft)',
        }}
    >
        <MiloCore state="thinking" size={58} />
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Waking up Milo…</span>
    </div>
)

export default App
