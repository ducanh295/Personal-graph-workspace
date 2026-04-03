import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState({ displayName: 'Người dùng PKG', email: 'you@secondbrain.app' });

    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isLoggedIn) return; // Nếu chưa đăng nhập thì không gọi API
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserProfile({ displayName: res.data.displayName, email: res.data.email });
            } catch (error) {
                console.error("Lỗi đồng bộ Mini Profile", error);
            }
        };
        fetchProfile();
    }, [isLoggedIn]);

    return (
        <aside className="sidebar" aria-label="User navigation">
            <div className="sidebar__logo">
                <div className="sidebar__logo-mark">PK</div>
                <div className="sidebar__logo-text">
                    <span className="sidebar__logo-title">PKG Website</span>
                    <span className="sidebar__logo-subtitle">Personal graph workspace</span>
                </div>
            </div>

            <nav aria-label="Primary">
                <p className="sidebar__section-title">Tổng quan</p>
                <div className="sidebar__nav">
                    <Link to="/" className={`sidebar__link ${location.pathname === '/' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">🏠</span>
                        <span className="sidebar__link-label">Bảng điều khiển</span>
                    </Link>
                    <Link to="/editor" className={`sidebar__link ${location.pathname === '/editor' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">✏️</span>
                        <span className="sidebar__link-label">Soạn thảo</span>
                    </Link>
                    <Link to="/graph" className={`sidebar__link ${location.pathname === '/graph' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">🕸</span>
                        <span className="sidebar__link-label">Đồ thị liên kết</span>
                    </Link>
                    <Link to="/explorer" className={`sidebar__link ${location.pathname === '/explorer' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">📚</span>
                        <span className="sidebar__link-label">Khám phá</span>
                    </Link>
                    <Link to="/search" className={`sidebar__link ${location.pathname === '/search' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">🔍</span>
                        <span className="sidebar__link-label">Tìm kiếm</span>
                    </Link>
                </div>

                <p className="sidebar__section-title">Tài khoản</p>
                <div className="sidebar__nav">
                    <Link to="/settings" className={`sidebar__link ${location.pathname === '/settings' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">⚙️</span>
                        <span className="sidebar__link-label">Cài đặt hệ thống</span>
                    </Link>
                    {isLoggedIn ? (
                        <a href="#" className="sidebar__link" onClick={handleLogout}>
                            <span className="sidebar__link-icon">⏻</span>
                            <span className="sidebar__link-label">Đăng xuất</span>
                        </a>
                    ) : (
                        <Link to="/login" className="sidebar__link">
                            <span className="sidebar__link-icon">👤</span>
                            <span className="sidebar__link-label">Đăng nhập</span>
                        </Link>
                    )}
                </div>
            </nav>

            <div className="sidebar__footer">
                <div className="sidebar__user">
                    <div className="sidebar__user-avatar" style={{ textTransform: 'uppercase' }}>
                        {isLoggedIn && userProfile.displayName ? userProfile.displayName.charAt(0) : '?'}
                    </div>
                    <div className="sidebar__user-meta" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 'bold' }}>{isLoggedIn ? userProfile.displayName : 'Khách Dạo Chơi'}</span><br />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isLoggedIn ? userProfile.email : 'Chưa đăng nhập'}</span>
                    </div>
                </div>
                <div className="sidebar__mode-pill">
                    <span>☾</span>
                    <span>Giao diện tối • PKG</span>
                </div>
            </div>
        </aside>
    );
}