import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface StatItem {
    label: string;
    value: number;
    delta: string;
}

interface NoteItem {
    _id: string;
    title: string;
    updatedAt: string;
    tags: string[];
    backlinks: number;
}

interface LinkSuggestion {
    source: { _id: string; title: string };
    target: { _id: string; title: string };
    sharedTags: string[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<StatItem[]>([]);
    const [recentNotes, setRecentNotes] = useState<NoteItem[]>([]);
    const [forgottenNotes, setForgottenNotes] = useState<NoteItem[]>([]);
    const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingContent, setLoadingContent] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch Stats
        axios.get("http://localhost:5000/api/note/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setStats(res.data);
            setLoadingStats(false);
        }).catch(() => toast.error("Lỗi tải dữ liệu thống kê."));

        // Fetch Dynamic Content
        axios.get("http://localhost:5000/api/note/dashboard/content", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setRecentNotes(res.data.recentNotes);
            setForgottenNotes(res.data.forgottenNotes);
            setSuggestions(res.data.linkSuggestions);
            setLoadingContent(false);
        }).catch(() => toast.error("Lỗi tải nội dung bảng điều khiển."));

    }, []); //[]: chỉ được múc data 1 lần lúc mới vào web, nếu thiếu -> server sẽ gọi data nhiều -> hỏng

    const formatDate = (ds: string) => {
        const d = new Date(ds);
        return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <header className="main__header" style={{ flexShrink: 0 }}>
                <div className="main__title-group">
                    <h1 className="main__title">Bảng điều khiển</h1>
                    <p className="main__subtitle">
                        Tổng quan "hệ thống tri thức" của bạn được cập nhật trực tiếp.
                    </p>
                </div>
                <div className="main__header-actions">
                    <Link to="/editor" className="btn btn--primary" style={{ boxShadow: '0 0 15px rgba(255, 51, 102, 0.4)' }}>
                        Thêm ghi chú mới
                    </Link>
                </div>
            </header>

            <section className="main__content" aria-label="User dashboard content" style={{ flexGrow: 1, padding: '0 2rem 2rem 2rem', overflowY: 'auto' }}>
                {/* Dãi Cảm Biến Cảm Xúc Thống Kê */}
                <section aria-label="Personal statistics" className="grid grid--stats-4">
                    {loadingStats ? (
                        Array(4).fill(0).map((_, i) => (
                            <article key={i} className="card stats-card" style={{ opacity: 0.5, animation: 'pulse 1.5s infinite' }}>
                                <div className="stats-card__label">Đang tải...</div>
                                <div className="stats-card__value">-</div>
                            </article>
                        ))
                    ) : (
                        stats.map((item, index) => (
                            <article key={index} className="card stats-card" style={{ borderTop: `2px solid ${index % 2 === 0 ? 'var(--accent)' : 'var(--primary)'}` }}>
                                <div className="stats-card__label">{item.label}</div>
                                <div className="stats-card__value">{item.value}</div>
                                <div className="stats-card__delta stats-card__delta--up">
                                    {item.delta}
                                </div>
                            </article>
                        ))
                    )}
                </section>

                <section className="dashboard-section" aria-label="Notes overview">
                    {/* KHỐI 1: TỐP MỚI NHẤT */}
                    <article className="card">
                        <header className="card__header">
                            <div>
                                <h2 className="card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--accent)' }}>●</span> Cập nhật gần đây
                                </h2>
                                <p className="card__subtitle">
                                    Danh sách 5 ghi chú vừa được chỉnh sửa hoặc thêm mới.
                                </p>
                            </div>
                            <span className="badge">Mới nhất</span>
                        </header>
                        <ul className="list">
                            {loadingContent ? <div style={{ padding: '1rem', color: '#888' }}>Đang tải dữ liệu...</div> : recentNotes.length === 0 ? <p style={{ padding: '1rem', color: '#888' }}>Chưa có dữ liệu</p> : recentNotes.map(n => (
                                <li className="list-item" key={n._id} style={{ cursor: 'pointer', transition: 'background 0.2s', padding: '0.8rem' }} onClick={() => navigate(`/editor?id=${n._id}`)} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <div>
                                        <p className="list-item__title">{n.title}</p>
                                        <p className="list-item__meta">
                                            Lưu lúc: {formatDate(n.updatedAt)} {n.tags.length > 0 && `· Tag: ${n.tags.join(', ')}`}
                                        </p>
                                    </div>
                                    <span className={n.backlinks > 0 ? "tag" : "tag--muted tag"}>
                                        {n.backlinks} liên kết tới
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </article>

                    {/* KHỐI 2: TỐP LÃNG QUÊN */}
                    <article className="card">
                        <header className="card__header">
                            <div>
                                <h2 className="card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: '#5866ff' }}>●</span> Ghi chú ít tương tác
                                </h2>
                                <p className="card__subtitle">
                                    Những ghi chú đã lâu không được truy cập.
                                </p>
                            </div>
                            <span className="badge" style={{ backgroundColor: 'rgba(88, 102, 255, 0.2)', color: '#5866ff' }}>Cũ nhất</span>
                        </header>
                        <ul className="list">
                            {loadingContent ? <div style={{ padding: '1rem', color: '#888' }}>Đang tải dữ liệu...</div> : forgottenNotes.length === 0 ? <p style={{ padding: '1rem', color: '#888' }}>Bạn đang tương tác và bảo trì mạng lưới rất tốt.</p> : forgottenNotes.map(n => (
                                <li className="list-item" key={n._id} style={{ cursor: 'pointer', transition: 'background 0.2s', padding: '0.8rem' }} onClick={() => navigate(`/editor?id=${n._id}`)} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <div>
                                        <p className="list-item__title">{n.title}</p>
                                        <p className="list-item__meta">
                                            Cập nhật lần cuối: {formatDate(n.updatedAt)} {n.tags.length > 0 && `· Thẻ: ${n.tags.join(', ')}`}
                                        </p>
                                    </div>
                                    <span className={n.backlinks > 0 ? "tag" : "tag--muted tag"}>
                                        {n.backlinks} liên kết tới
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </article>
                </section>

                <section className="dashboard-section dashboard-section--single" aria-label="Link suggestions">
                    {/* KHỐI TÁC CHIẾN GỢI Ý LOGIC THÔNG MINH */}
                    <article className="card card--soft" style={{ border: '1px solid rgba(255, 51, 102, 0.15)' }}>
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">Đề xuất liên kết mới</h2>
                                <p className="card__subtitle">
                                    Hệ thống phát hiện các ghi chú có chung từ khoá nhưng chưa được liên kết với nhau.
                                </p>
                            </div>
                            <span className="badge" style={{ backgroundColor: '#ff3366', color: '#fff' }}>Hành động</span>
                        </header>

                        <ul className="list">
                            {loadingContent ? <div style={{ padding: '1rem', color: '#888' }}>Đang phân tích...</div> : suggestions.length === 0 ? <p style={{ padding: '1rem', color: '#888' }}>Chưa phát hiện được liên kết khả thi.</p> : suggestions.map((s, idx) => (
                                <li className="list-item" key={idx}>
                                    <div>
                                        <p className="list-item__title">
                                            Gợi ý kết nối
                                            <strong style={{ color: 'var(--accent)', cursor: 'pointer', margin: '0 0.4rem' }} onClick={() => navigate(`/editor?id=${s.source._id}`)}>"{s.source.title}"</strong>
                                            <span style={{ fontSize: '1.2rem', color: '#fff' }}>↔</span>
                                            <strong style={{ color: 'var(--primary)', cursor: 'pointer', margin: '0 0.4rem' }} onClick={() => navigate(`/editor?id=${s.target._id}`)}>"{s.target.title}"</strong>
                                        </p>
                                        <p className="list-item__meta" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                            <span style={{ background: '#222', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>Từ khoá chung:</span>
                                            {s.sharedTags.map(t => <b key={t} style={{ color: '#fff' }}>#{t}</b>)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </article>
                </section>
            </section>
        </div>
    );
}