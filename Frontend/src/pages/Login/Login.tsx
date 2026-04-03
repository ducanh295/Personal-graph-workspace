import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const [isLoginTab, setIsLoginTab] = useState(true);

    // Login states
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register states
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regPasswordConfirm, setRegPasswordConfirm] = useState('');

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // XỬ LÝ NỔ SÚNG API ĐĂNG NHẬP
    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) return toast.error("Vui lòng nhập đầy đủ Email và Mật khẩu.");
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email: loginEmail,
                password: loginPassword
            });

            // 🔥 ĐÂY MỚI LÀ LÚC CẤT TOKEN THẬT SỰ VÀO KÉT SẮT NÀY SẾP:
            localStorage.setItem("token", res.data.token);

            toast.success("Đăng nhập thành công!");
            navigate("/");

        } catch (error: any) {
            console.error("Lỗi đăng nhập:", error);
            toast.error(error.response?.data?.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
    };

    // XỬ LÝ NỔ SÚNG API ĐĂNG KÝ
    const handleRegister = async () => {
        if (regPassword !== regPasswordConfirm) return toast.error("Mật khẩu xác nhận không khớp.");
        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/auth/register", {
                displayName: regName,
                email: regEmail,
                password: regPassword
            });
            toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
            setIsLoginTab(true);
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            toast.error(error.response?.data?.message || error.response?.data?.error || "Đăng ký thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page" style={{ position: 'relative' }}>
            {/* Nút thoát thân lùi lại */}
            <Link 
                to="/" 
                style={{ position: 'absolute', top: '1.8rem', left: '2.5rem', color: '#a1a1aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s', padding: '0.5rem' }} 
                onMouseOver={e => e.currentTarget.style.color = '#fff'} 
                onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}
            >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại trang chủ
            </Link>

            <section className="auth-card" aria-label="Authentication">
                <header className="auth-card__header">
                    <h1 className="auth-card__title">Personal Knowledge Graph</h1>
                    <p className="auth-card__subtitle">Đăng nhập vào hệ thống quản lý tri thức cá nhân của bạn.</p>
                </header>

                <div className="auth-tabs" role="tablist">
                    <label
                        role="tab"
                        aria-selected={isLoginTab}
                        onClick={() => setIsLoginTab(true)}
                        style={isLoginTab ? { background: 'linear-gradient(120deg, #5866ff, #7b4dff)', color: '#f5f5ff' } : {}}
                    >
                        Đăng nhập
                    </label>
                    <label
                        role="tab"
                        aria-selected={!isLoginTab}
                        onClick={() => setIsLoginTab(false)}
                        style={!isLoginTab ? { background: 'linear-gradient(120deg, #5866ff, #7b4dff)', color: '#f5f5ff' } : {}}
                    >
                        Đăng ký tài khoản
                    </label>
                </div>

                <div className="auth-panels">
                    {isLoginTab ? (
                        <div className="auth-panel--login" style={{ display: 'block' }}>
                            <div className="form-group">
                                <label>Địa chỉ Email</label>
                                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="email@example.com" />
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label>Mật khẩu</label>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={loginPassword} 
                                    onChange={e => setLoginPassword(e.target.value)} 
                                    placeholder="••••••••" 
                                    style={{ width: '100%', paddingRight: '2.5rem' }} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    style={{ position: 'absolute', right: '0.8rem', top: '1.9rem', color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                                    title={showPassword ? "Ẩn Mật khẩu" : "Hiện Mật khẩu"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            <div className="form-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                <span className="card__meta" style={{ cursor: 'pointer' }} onClick={() => toast("Tính năng khôi phục mật khẩu đang được phát triển.")}>
                                    Quên mật khẩu?
                                </span>
                                <button className="btn btn--primary" type="button" onClick={handleLogin} disabled={loading}>
                                    {loading ? "Đang xử lý..." : "Đăng Nhập"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-panel--register" style={{ display: 'block' }}>
                            <div className="form-group">
                                <label>Tên hiển thị</label>
                                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Nhập tên của bạn" />
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ Email</label>
                                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="email@example.com" />
                            </div>
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 1, position: 'relative' }}>
                                    <label>Mật khẩu</label>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={regPassword} 
                                        onChange={e => setRegPassword(e.target.value)} 
                                        placeholder="••••••••" 
                                        style={{ width: '100%', paddingRight: '2.5rem' }} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        style={{ position: 'absolute', right: '0.8rem', top: '1.9rem', color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                                        title={showPassword ? "Ẩn Mật khẩu" : "Hiện Mật khẩu"}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                <div className="form-group" style={{ flex: 1, position: 'relative' }}>
                                    <label>Xác nhận Mật khẩu</label>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={regPasswordConfirm} 
                                        onChange={e => setRegPasswordConfirm(e.target.value)} 
                                        placeholder="••••••••" 
                                        style={{ width: '100%', paddingRight: '2.5rem' }} 
                                    />
                                </div>
                            </div>
                            <button className="btn btn--primary" type="button" style={{ width: '100%', marginTop: '1rem' }} onClick={handleRegister} disabled={loading}>
                                {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                            </button>
                        </div>
                    )}
                </div>

                <footer style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p className="card__meta">
                        Bằng việc tiếp tục, bạn đồng ý lưu trữ dữ liệu cá nhân trên máy chủ PKG.
                    </p>
                </footer>
            </section>
        </main>
    );
}