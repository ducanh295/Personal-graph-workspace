import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface NoteItem {
    _id: string;
    title: string;
    tags: string[];
    updatedAt: string;
}

export default function Explorer() {
    const [notes, setNotes] = useState<NoteItem[]>([]);
    const [filterText, setFilterText] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }
                const res = await axios.get("http://localhost:5000/api/note?limit=50", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.data && res.data.getNotes) {
                    setNotes(res.data.getNotes);
                }
                setLoading(false);
            } catch (error: any) {
                toast.error("Lỗi khi tải danh sách ghi chú: " + (error.response?.data?.message || "Lỗi mạng hoặc máy chủ."));
                setLoading(false);
            }
        }
        fetchNotes();
    }, []);

    // Lấy tất cả tags duy nhất để làm dropdown
    const allTags = [...new Set(notes.flatMap(n => n.tags))];

    // Lọc theo text + tag
    const filteredNotes = notes
        .filter(n => 
            n.title.toLowerCase().includes(filterText.toLowerCase()) || 
            n.tags.some(tag => tag.toLowerCase().includes(filterText.toLowerCase()))
        )
        .filter(n => !filterTag || n.tags.includes(filterTag));

    // Sắp xếp
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        if (sortBy === 'oldest') return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    const handleReset = () => {
        setFilterText('');
        setFilterTag('');
        setSortBy('newest');
    };

    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">Khám phá</h1>
                    <p className="main__subtitle">Kho lưu trữ toàn bộ ghi chú trong hệ thống PKG của bạn.</p>
                </div>
                <div className="main__header-actions">
                    <Link to="/editor" className="btn btn--primary">Thêm ghi chú mới</Link>
                </div>
            </header>

            <section className="main__content" aria-label="Explorer content">
                {/* BỘ LỌC & TÌM KIẾM */}
                <article className="card">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Bộ lọc &amp; tìm kiếm</h2>
                            <p className="card__subtitle">
                                Lọc theo thẻ, sắp xếp theo ngày để duyệt nhanh kho ghi chú.
                            </p>
                        </div>
                    </header>
                    <div className="filter-bar">
                        <div className="filter-bar__search">
                            <input 
                                type="search" 
                                placeholder="Tìm theo tiêu đề, nội dung..." 
                                aria-label="Search notes"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </div>
                        <div className="filter-bar__controls">
                            <select 
                                aria-label="Lọc theo thẻ"
                                value={filterTag}
                                onChange={(e) => setFilterTag(e.target.value)}
                            >
                                <option value="">Lọc theo thẻ</option>
                                {allTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                            <select 
                                aria-label="Sắp xếp"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Sắp xếp: Mới nhất</option>
                                <option value="oldest">Sắp xếp: Cũ nhất</option>
                                <option value="title">Sắp xếp: Theo tên</option>
                            </select>
                            <button className="btn btn--ghost" type="button" onClick={handleReset}>Đặt lại</button>
                        </div>
                    </div>
                </article>

                {/* BẢNG DANH SÁCH GHI CHÚ */}
                <article className="card">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Danh sách ghi chú</h2>
                            <p className="card__subtitle">
                                Quản lý ghi chú theo dạng bảng: tiêu đề, thẻ phân loại, ngày cập nhật.
                            </p>
                        </div>
                        <span className="badge">Dạng bảng</span>
                    </header>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" aria-label="Danh sách ghi chú">
                            <thead>
                                <tr>
                                    <th scope="col">Tiêu đề</th>
                                    <th scope="col">Thẻ phân loại</th>
                                    <th scope="col">Ngày cập nhật</th>
                                    <th scope="col" style={{textAlign: "center"}}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={4} style={{textAlign: 'center', color: 'var(--accent)'}}>⚡ Đang tải dữ liệu, vui lòng chờ...</td></tr>
                                ) : sortedNotes.length === 0 ? (
                                    <tr><td colSpan={4} style={{textAlign: 'center'}}>Không có ghi chú nào phù hợp với bộ lọc hiện tại.</td></tr>
                                ) : (
                                    sortedNotes.map(n => (
                                        <tr key={n._id}>
                                            <td 
                                                style={{fontWeight: "bold", cursor: "pointer", color: "var(--accent)"}} 
                                                onClick={() => navigate(`/editor?id=${n._id}`)}
                                            >
                                                {n.title}
                                            </td>
                                            <td>{n.tags.join(', ')}</td>
                                            <td>{new Date(n.updatedAt).toLocaleString('vi-VN')}</td>
                                            <td style={{textAlign: "center"}}>
                                                <button className="btn btn--primary" onClick={() => navigate(`/editor?id=${n._id}`)}>Chỉnh sửa</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </article>

                {/* DẠNG LƯỚI (GRID CARDS) */}
                <article className="card">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Dạng lưới</h2>
                            <p className="card__subtitle">
                                Duyệt nhanh các ghi chú theo dạng thẻ trực quan.
                            </p>
                        </div>
                        <span className="badge">Dạng thẻ</span>
                    </header>
                    <div className="note-grid" aria-label="Note grid">
                        {loading ? (
                            <div style={{ padding: '1rem', color: '#888' }}>Đang tải dữ liệu...</div>
                        ) : sortedNotes.length === 0 ? (
                            <div style={{ padding: '1rem', color: '#888' }}>Không có ghi chú nào.</div>
                        ) : (
                            sortedNotes.map(n => (
                                <div 
                                    className="card card--soft" 
                                    key={n._id}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => navigate(`/editor?id=${n._id}`)}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    <div className="card__header">
                                        <h3 className="card__title">{n.title}</h3>
                                        {n.tags.length > 0 && (
                                            <span className="tag">{n.tags[0]}</span>
                                        )}
                                    </div>
                                    <p className="card__meta">
                                        Cập nhật lần cuối: {new Date(n.updatedAt).toLocaleString('vi-VN')}
                                        {n.tags.length > 1 && ` · Thẻ: ${n.tags.slice(1).join(', ')}`}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </article>
            </section>
        </>
    );
}
