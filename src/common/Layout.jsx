import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { LogoutModal } from '../models/AllModels';
import { useLogout } from '../Api/Api';

function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const nav = useNavigate();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout(
        () => {
            setLogoutOpen(false);
            toast.success('Signed out. See you soon.');
            nav('/');
        },
        () => toast.error("Couldn't sign out right now.")
    );

    const closeMobile = () => setMobileOpen(false);

    return (
        <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'var(--bg)' }}>
            {/* Desktop sidebar */}
            {isDesktop && (
                <Box
                    component="aside"
                    sx={{
                        width: 'var(--sidebar-width)',
                        flexShrink: 0,
                        borderRight: '1px solid var(--border)',
                        bgcolor: 'var(--surface)',
                        position: 'sticky',
                        top: 0,
                        height: '100dvh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Sidebar />
                </Box>
            )}

            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={closeMobile}
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 'min(280px, 80vw)',
                        bgcolor: 'var(--surface)',
                        borderRight: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-xl)',
                    },
                }}
            >
                <Sidebar onNavigate={closeMobile} />
            </Drawer>

            {/* Main column */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    height: '100dvh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Navbar onMenuClick={() => setMobileOpen(true)} onLogoutClick={() => setLogoutOpen(true)} />

                <Box
                    className="milo-page"
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        px: { xs: 2, sm: 3, md: 4.5 },
                        py: { xs: 2.5, md: 3.5 },
                        pb: { xs: '84px', md: 4.5 },
                    }}
                >
                    <Outlet />
                </Box>

                {/* Mobile bottom navigation */}
                {!isDesktop && <BottomNav />}
            </Box>

            <LogoutModal
                open={logoutOpen}
                onClose={() => setLogoutOpen(false)}
                onConfirm={() => logoutMutate()}
                isPending={isLoggingOut}
            />
        </Box>
    );
}

export default Layout;
