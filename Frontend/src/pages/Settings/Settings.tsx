import { useState, useEffect } from 'react';

export default function Settings() {
    const [isLightMode, setIsLightMode] = useState(false);

    useEffect(() => {
        setIsLightMode(document.body.classList.contains('theme-light'));
    }, []);

    const toggleTheme = () => {
        const isLight = document.body.classList.toggle('theme-light');
        setIsLightMode(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };

    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">Settings</h1>
                    <p className="main__subtitle">
                        Cài đặt tài khoản, giao diện và vùng nguy hiểm (Danger Zone).
                    </p>
                </div>
            </header>

            <section className="main__content settings-layout" aria-label="Settings content">
                {/* Left column: profile & preferences */}
                <section aria-label="Profile settings" className="card">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Thông tin cá nhân</h2>
                            <p className="card__subtitle">
                                Cập nhật avatar, tên hiển thị, email và mật khẩu.
                            </p>
                        </div>
                    </header>
                    <div className="form-row">
                        <div className="avatar-preview" aria-label="Avatar preview">U</div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="avatar-upload">Avatar</label>
                            <input id="avatar-upload" type="file" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="display-name">Tên hiển thị</label>
                        <input
                            id="display-name"
                            type="text"
                            placeholder="Nhập tên bạn muốn hiển thị..."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="you@secondbrain.app" />
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="password">Mật khẩu mới</label>
                            <input id="password" type="password" placeholder="••••••••" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="password-confirm">Nhập lại mật khẩu</label>
                            <input
                                id="password-confirm"
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button className="btn btn--primary" type="button">Lưu thay đổi</button>
                </section>

                {/* Right column: theme + danger zone */}
                <section aria-label="Display & danger zone" className="card">
                    <article className="card card--soft" style={{ marginBottom: '1rem' }}>
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">Giao diện</h2>
                                <p className="card__subtitle">
                                    Toggle mô phỏng chuyển đổi Light / Dark mode (chưa có JS).
                                </p>
                            </div>
                        </header>
                        <div className="form-row" style={{ alignItems: 'center' }}>
                            <div>
                                <p className="card__meta">Light / Dark mode</p>
                                <p className="card__meta">
                                    PKG ưu tiên dark mode để tập trung hơn khi làm việc dài.
                                </p>
                            </div>
                            <div 
                                className="toggle" 
                                id="theme-toggle" 
                                aria-hidden="true"
                                onClick={toggleTheme}
                                style={{ cursor: 'pointer' }}
                            >
                                <div 
                                    className="toggle__knob"
                                    style={{
                                        transform: isLightMode ? 'translateX(24px)' : 'none',
                                        transition: 'transform 0.2s ease',
                                        background: isLightMode ? '#5866ff' : '#f4f4ff'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </article>

                    <article className="danger-zone" aria-label="Danger zone">
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">Danger Zone</h2>
                                <p className="card__subtitle">
                                    Các thao tác quan trọng: export dữ liệu, xóa tài khoản.
                                </p>
                            </div>
                        </header>
                        <p className="card__meta">
                            Hãy thận trọng khi thao tác ở khu vực này. Mặc dù ở bản HTML/CSS này
                            chỉ là placeholder, nhưng trong app thực tế đây sẽ là các hành động
                            không thể hoàn tác.
                        </p>
                        <div className="form-row" style={{ marginTop: '0.7rem' }}>
                            <button className="btn btn--ghost" type="button">Export data</button>
                            <button className="btn btn--danger" type="button">
                                Xóa tài khoản
                            </button>
                        </div>
                    </article>
                </section>
            </section>
        </>
    );
}
