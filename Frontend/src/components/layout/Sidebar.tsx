import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar" aria-label="User navigation">
            <div className="sidebar__logo">
                <div className="sidebar__logo-mark">PK</div>
                <div className="sidebar__logo-text">
                    <span className="sidebar__logo-title">PKG</span>
                    <span className="sidebar__logo-subtitle">Personal graph workspace</span>
                </div>
            </div>

            <nav aria-label="Primary">
                <p className="sidebar__section-title">Overview</p>
                <div className="sidebar__nav">
                    <Link to="/" className={`sidebar__link ${location.pathname === '/' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">🏠</span>
                        <span className="sidebar__link-label">Dashboard</span>
                    </Link>
                    <Link to="/editor" className={`sidebar__link ${location.pathname === '/editor' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">✏️</span>
                        <span className="sidebar__link-label">Editor</span>
                    </Link>
                    <Link to="/graph" className={`sidebar__link ${location.pathname === '/graph' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">🕸</span>
                        <span className="sidebar__link-label">Graph View</span>
                    </Link>
                    <Link to="/explorer" className={`sidebar__link ${location.pathname === '/explorer' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">📚</span>
                        <span className="sidebar__link-label">Explorer</span>
                    </Link>
                    <Link to="/search" className={`sidebar__link ${location.pathname === '/search' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">🔍</span>
                        <span className="sidebar__link-label">Search</span>
                    </Link>
                </div>

                <p className="sidebar__section-title">Account</p>
                <div className="sidebar__nav">
                    <Link to="/settings" className={`sidebar__link ${location.pathname === '/settings' ? 'sidebar__link--active' : ''}`}>
                        <span className="sidebar__link-icon">⚙️</span>
                        <span className="sidebar__link-label">Settings</span>
                    </Link>
                    <Link to="/login" className="sidebar__link">
                        <span className="sidebar__link-icon">⏻</span>
                        <span className="sidebar__link-label">Sign out</span>
                    </Link>
                </div>
            </nav>

            <div className="sidebar__footer">
                <div className="sidebar__user">
                    <div className="sidebar__user-avatar">U</div>
                    <div className="sidebar__user-meta">
                        <span>PKG User</span><br />
                        <span>you@secondbrain.app</span>
                    </div>
                </div>
                <div className="sidebar__mode-pill">
                    <span>☾</span>
                    <span>Dark mode • PKG</span>
                </div>
            </div>
        </aside>
    );
}