import { Link } from 'react-router-dom';

export default function Login() {
    return (
        <main className="auth-page">
            <section className="auth-card" aria-label="Authentication">
                <header className="auth-card__header">
                    <div style={{ textAlign: 'left', marginBottom: '0.8rem' }}>
                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
                            ← Quay lại
                        </Link>
                    </div>
                    <h1 className="auth-card__title">Personal Knowledge Graph</h1>
                    <p className="auth-card__subtitle">
                        Cổng vào ứng dụng PKG – nơi lưu trữ "bộ não thứ hai" của bạn.
                    </p>
                </header>

                <input type="radio" name="auth-tab" id="tab-login" defaultChecked style={{ display: 'none' }} />
                <input type="radio" name="auth-tab" id="tab-register" style={{ display: 'none' }} />

                <div className="auth-tabs" role="tablist">
                    <label htmlFor="tab-login" role="tab" aria-selected="true">Login</label>
                    <label htmlFor="tab-register" role="tab" aria-selected="false">Register</label>
                </div>

                <div className="auth-panels">
                    <div className="auth-panel--login" role="tabpanel">
                        <div className="form-group">
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="you@secondbrain.app"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="login-password">Mật khẩu</label>
                            <input id="login-password" type="password" placeholder="••••••••" />
                        </div>
                        <div className="form-row" style={{ justifyContent: 'space-between' }}>
                            <span className="card__meta">Quên mật khẩu?</span>
                            <Link to="/" className="btn btn--primary">Đăng nhập</Link>
                        </div>
                    </div>

                    <div className="auth-panel--register" role="tabpanel">
                        <div className="form-group">
                            <label htmlFor="register-name">Tên hiển thị</label>
                            <input
                                id="register-name"
                                type="text"
                                placeholder="Tên bạn muốn hiển thị trong PKG..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="register-email">Email</label>
                            <input
                                id="register-email"
                                type="email"
                                placeholder="you@secondbrain.app"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="register-password">Mật khẩu</label>
                                <input
                                    id="register-password"
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="register-password-confirm">Nhập lại mật khẩu</label>
                                <input
                                    id="register-password-confirm"
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button className="btn btn--primary" type="button" style={{ width: '100%' }}>
                            Tạo tài khoản
                        </button>
                    </div>
                </div>

                <footer style={{ marginTop: '1rem' }}>
                    <p className="card__meta">
                        Bằng việc tiếp tục, bạn đồng ý với "second brain" được lưu trữ trong PKG
                        trên thiết bị của bạn.
                    </p>
                </footer>
            </section>
        </main>
    );
}