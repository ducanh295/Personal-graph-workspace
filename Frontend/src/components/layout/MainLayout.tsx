import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
    return (
        <div className="app">
            <Sidebar />
            <main className="main" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}