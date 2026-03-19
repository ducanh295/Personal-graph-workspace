import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
    return (
        <div className="app">
            <Sidebar />
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
}