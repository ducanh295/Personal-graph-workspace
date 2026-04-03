import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const triggerAuthModal = () => {
    window.dispatchEvent(new Event('show-auth-modal'));
};

const AuthModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Lắng nghe lệnh triệu tập từ mọi nơi
    useEffect(() => {
        const handleShow = () => setIsOpen(true);
        window.addEventListener('show-auth-modal', handleShow);
        return () => window.removeEventListener('show-auth-modal', handleShow);
    }, []);

    // A11y: Bấm phím Escape thì tắt bảng
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0, // Top 0, left 0, right 0, bottom 0
            zIndex: 9999, // Phủ lên tất cả (navbar/sidebar)
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)', // Glassmorphism Standard
            overscrollBehavior: 'contain' // Tránh vụ cuộn con chuột tuột xuống màn hình cha
        }}>
            {/* Hộp Modal */}
            <div 
                role="dialog" 
                aria-modal="true" 
                aria-labelledby="auth-modal-title"
                style={{
                    background: '#1c1c1e', // Màu Vercel Dark Modal
                    border: '1px solid #333',
                    borderRadius: '12px',
                    padding: '2.5rem 2rem',
                    width: '90%',
                    maxWidth: '420px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 1)',
                    transform: 'translateY(0)', // Animate chuẩn vị trí
                    opacity: 1
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
                    {/* Icon Ô khóa rỉ máu */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: '#3f1a1a', // Nền đỏ thẫm báo hiểm
                        color: '#ef4444',
                        marginBottom: '0.2rem'
                    }}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h2 id="auth-modal-title" style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 600 }}>
                        Thiếu Quyền Truy Cập
                    </h2>
                    
                    <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Hệ thống phát hiện bạn đang trong <b>Chế độ Khách</b>. Để thực hiện các thao tác viết, sửa đổi, và quản lý kho dữ liệu PKG, xin vui lòng đăng nhập vào hệ thống!
                    </p>

                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', width: '100%' }}>
                        <button 
                            onClick={() => setIsOpen(false)}
                            style={{
                                flex: 2,
                                padding: '0.7rem 1rem',
                                border: '1px solid #3f3f46',
                                background: 'transparent',
                                color: '#e4e4e7',
                                borderRadius: '8px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#27272a'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/login');
                            }}
                            style={{
                                flex: 3,
                                padding: '0.7rem 1rem',
                                border: '1px solid transparent',
                                background: 'var(--accent, #3b82f6)',
                                color: '#fff',
                                borderRadius: '8px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Đăng Nhập 🔑
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
