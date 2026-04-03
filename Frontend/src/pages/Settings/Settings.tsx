import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const [isLightMode, setIsLightMode] = useState(false);
    
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loadingProfile, setLoadingProfile] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDisplayName(res.data.displayName);
                setEmail(res.data.email);
                
                const themeVal = res.data.theme === 'light';
                setIsLightMode(themeVal);
                if (themeVal) {
                    document.body.classList.add('theme-light');
                } else {
                    document.body.classList.remove('theme-light');
                }
            } catch (error) {
                toast.error("Lỗi khi tải thông tin hồ sơ.");
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);

    const toggleTheme = async () => {
        const isLight = document.body.classList.toggle('theme-light');
        setIsLightMode(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:5000/api/user/theme", { theme: isLight ? 'light' : 'dark' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Cập nhật giao diện thành công.");
        } catch (error) {
            toast.error("Lỗi khi cập nhật giao diện.");
        }
    };

    const handleUpdateProfile = async () => {
        if (!displayName.trim() || !email.trim()) return toast.error("Vui lòng không để trống thông tin.");
        const token = localStorage.getItem("token");
        try {
            await axios.put("http://localhost:5000/api/user/profile", { displayName, email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Cập nhật hồ sơ thành công.");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Lỗi cập nhật hồ sơ");
        }
    }

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) return toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu.");
        if (newPassword !== confirmPassword) return toast.error("Mật khẩu xác nhận không khớp.");
        
        const token = localStorage.getItem("token");
        try {
            await axios.put("http://localhost:5000/api/user/password", { currentPassword, newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Cập nhật mật khẩu thành công.");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Lỗi cập nhật mật khẩu");
        }
    }

    const handleExportData = async () => {
        const token = localStorage.getItem("token");
        try {
            const toastId = toast.loading("Đang xuất dữ liệu...");
            const res = await axios.get("http://localhost:5000/api/user/export", {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'PKG_Brain_Backup.json');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.dismiss(toastId);
            toast.success("Xuất dữ liệu thành công!");
        } catch (error) {
            toast.error("Lỗi khi xuất dữ liệu.");
        }
    }

    const handleDeleteAccount = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!")) return;
        if (!window.confirm("CẢNH BÁO: Toàn bộ dữ liệu ghi chú và liên kết sẽ bị xóa vĩnh viễn. Tiếp tục?")) return;
        
        const token = localStorage.getItem("token");
        try {
            await axios.delete("http://localhost:5000/api/user/account", {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem("token");
            toast.success("Tài khoản đã được xóa.");
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            toast.error("Không thể xóa tài khoản: " + error.response?.data?.error);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <header className="main__header" style={{ flexShrink: 0 }}>
                <div className="main__title-group">
                    <h1 className="main__title">Cài đặt</h1>
                    <p className="main__subtitle">
                        Tùy chỉnh thông tin cá nhân, giao diện hệ thống và quản lý tài khoản.
                    </p>
                </div>
            </header>

            <section className="main__content settings-layout" aria-label="Settings content" style={{ flexGrow: 1, overflowY: 'auto' }}>
                <section aria-label="Profile settings" className="card" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Hồ sơ cá nhân</h2>
                            <p className="card__subtitle">
                                Thông tin định danh trên hệ thống.
                            </p>
                        </div>
                    </header>
                    {loadingProfile ? (
                        <div style={{ color: 'var(--accent)', animation: 'pulse 1s infinite' }}>Đang tải...</div>
                    ) : (
                        <>
                            <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="avatar-preview" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', boxShadow: '0 0 20px rgba(88, 102, 255, 0.4)' }}>
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ảnh đại diện được tạo tự động từ ký tự đầu tiên trong Tên hiển thị.</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="display-name">Tên hiển thị</label>
                                <input
                                    id="display-name"
                                    type="text"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Địa chỉ Email</label>
                                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            
                            <button className="btn btn--primary" type="button" onClick={handleUpdateProfile} style={{ marginBottom: '2rem' }}>Lưu thông tin hồ sơ</button>

                            <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1rem 0' }} />

                            <div className="form-group">
                                <label htmlFor="current-password">Mật khẩu hiện tại</label>
                                <input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Nhập mật khẩu hiện tại để xác minh" />
                            </div>
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="password">Mật khẩu mới</label>
                                    <input id="password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label htmlFor="password-confirm">Xác nhận mật khẩu mới</label>
                                    <input id="password-confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới" />
                                </div>
                            </div>

                            <button className="btn btn--ghost" type="button" onClick={handleUpdatePassword}>Đổi mật khẩu</button>
                        </>
                    )}
                </section>

                <section aria-label="Display & danger zone" className="card">
                    <article className="card card--soft" style={{ marginBottom: '1.5rem', border: '1px solid rgba(88, 102, 255, 0.2)' }}>
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">Cài đặt giao diện</h2>
                                <p className="card__subtitle">
                                    Chuyển đổi giữa chế độ Rõ ràng và Tối tùy biến. Thay đổi sẽ lưu lại ngay.
                                </p>
                            </div>
                        </header>
                        <div className="form-row" style={{ alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <p className="card__meta" style={{ color: 'var(--text-light)', fontWeight: 'bold' }}>Chế độ sáng (Light Mode)</p>
                                <p className="card__meta">
                                    Sử dụng màu nền sáng. Phù hợp cho việc sử dụng vào ban ngày.
                                </p>
                            </div>
                            <div 
                                className="toggle" 
                                id="theme-toggle" 
                                aria-hidden="true"
                                onClick={toggleTheme}
                                style={{ cursor: 'pointer', background: isLightMode ? '#5866ff' : 'rgba(255,255,255,0.1)' }}
                            >
                                <div 
                                    className="toggle__knob"
                                    style={{
                                        transform: isLightMode ? 'translateX(24px)' : 'none',
                                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: isLightMode ? '#fff' : '#888'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </article>

                    <article className="danger-zone" aria-label="Danger zone" style={{ border: '1px solid rgba(255, 51, 102, 0.3)', background: 'linear-gradient(135deg, rgba(255,51,102,0.05) 0%, rgba(26,26,26,1) 100%)' }}>
                        <header className="card__header">
                            <div>
                                <h2 className="card__title" style={{ color: 'var(--accent)' }}>Vùng Quản Trị Hệ Thống Nâng Cao</h2>
                                <p className="card__subtitle" style={{ color: 'rgba(255,51,102,0.7)' }}>
                                    Các tác vụ yêu cầu độ cẩn trọng cao. 
                                </p>
                            </div>
                        </header>
                        <p className="card__meta" style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--accent)', paddingLeft: '1rem', color: '#ccc' }}>
                            **XUẤT DỮ LIỆU BẢO LƯU (EXPORT):** Nén và xuất toàn bộ hệ thống lưu trữ bao gồm Ghi chú và Liên kết định dạng JSON phục vụ backup và di chuyển máy chủ.
                        </p>
                        <div className="form-row" style={{ marginTop: '0.7rem' }}>
                            <button className="btn" type="button" onClick={handleExportData} style={{ background: '#222', border: '1px solid #444', color: '#fff', flex: 1 }}>Xuất Dữ Liệu Lưu Trữ</button>
                            <button className="btn" type="button" onClick={handleDeleteAccount} style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 0 15px rgba(255,51,102,0.4)', flex: 1 }}>
                                Xóa Tài Khoản Vĩnh Viễn
                            </button>
                        </div>
                    </article>
                </section>
            </section>
        </div>
    );
}
