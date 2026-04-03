import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { triggerAuthModal } from '../../components/common/AuthModal';

interface LinkedNote {
    _id: string;
    title: string;
}

export default function Editor() {
    const [searchParams] = useSearchParams();
    const noteId = searchParams.get('id');
    const navigate = useNavigate();

    // Form state
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    // Backlinks: ghi chú KHÁC trỏ ĐẾN ghi chú này
    const [backlinks, setBacklinks] = useState<any[]>([]);

    // Outgoing links: ghi chú này LIÊN KẾT ĐẾN ghi chú khác
    const [outgoingLinks, setOutgoingLinks] = useState<LinkedNote[]>([]);

    // Dropdown: tất cả ghi chú để chọn
    const [allNotes, setAllNotes] = useState<LinkedNote[]>([]);
    const [selectedNoteForLink, setSelectedNoteForLink] = useState('');

    // Metadata
    const [metaInfo, setMetaInfo] = useState<{ id?: string, updated?: string }>({});

    // Load ghi chú hiện tại + backlinks + outgoing links
    useEffect(() => {
        if (noteId) {
            const fetchNote = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return;
                    const [noteRes, backlinksRes, outlinksRes] = await Promise.all([
                        axios.get(`http://localhost:5000/api/note/detail/${noteId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        axios.get(`http://localhost:5000/api/note/backlinks/${noteId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        axios.get(`http://localhost:5000/api/note/outlinks/${noteId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    ]);
                    
                    setTitle(noteRes.data.title);
                    setContent(noteRes.data.content);
                    setTags(noteRes.data.tags.join(', '));
                    setMetaInfo({
                        id: noteRes.data._id,
                        updated: new Date(noteRes.data.updatedAt).toLocaleString()
                    });
                    setBacklinks(backlinksRes.data);

                    // Chuyển outgoing links thành danh sách LinkedNote
                    const outNotes: LinkedNote[] = outlinksRes.data
                        .filter((l: any) => l.targetNoteId)
                        .map((l: any) => ({
                            _id: l.targetNoteId._id,
                            title: l.targetNoteId.title
                        }));
                    setOutgoingLinks(outNotes);
                } catch (error: any) {
                    toast.error("Không thể tải nội dung ghi chú: " + (error.response?.data?.error || "Lỗi truy xuất hệ thống."));
                }
            };
            fetchNote();
        }
    }, [noteId]);

    // Load tất cả ghi chú để làm menu Dropdown
    useEffect(() => {
        const fetchAllNotes = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get("http://localhost:5000/api/note?limit=1000", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.getNotes) {
                    setAllNotes(res.data.getNotes.map((n: any) => ({ _id: n._id, title: n.title })));
                }
            } catch {}
        };
        fetchAllNotes();
    }, []);

    // Thêm liên kết đến một ghi chú khác
    const handleAddLink = () => {
        if (!selectedNoteForLink) {
            toast.error("Vui lòng chọn một ghi chú từ danh sách!");
            return;
        }
        // Không cho link đến chính mình
        if (selectedNoteForLink === noteId) {
            toast.error("Không thể liên kết đến chính ghi chú này.");
            return;
        }
        // Không cho trùng
        if (outgoingLinks.some(l => l._id === selectedNoteForLink)) {
            toast.error("Ghi chú này đã có trong danh sách liên kết.");
            return;
        }
        const selectedNote = allNotes.find(n => n._id === selectedNoteForLink);
        if (selectedNote) {
            setOutgoingLinks(prev => [...prev, selectedNote]);
            setSelectedNoteForLink('');
            toast.success(`Đã thêm liên kết đến "${selectedNote.title}"`);
        }
    };

    // Xóa một liên kết đi
    const handleRemoveLink = (targetId: string) => {
        setOutgoingLinks(prev => prev.filter(l => l._id !== targetId));
    };

    // Xóa ghi chú
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) return triggerAuthModal();
        
        if (!noteId) return;
        const accept = window.confirm("CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn ghi chú và không thể phục hồi. Bạn có chắc chắn muốn tiếp tục?");
        if (!accept) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/note/deleteNote/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Xóa ghi chú thành công.");
            navigate("/explorer");
        } catch (error: any) {
            toast.error("Xóa thất bại: " + (error.response?.data?.error || "Lỗi hệ thống máy chủ."));
        }
    };

    // Lưu ghi chú + đồng bộ liên kết
    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) return triggerAuthModal();
        
        if (!title.trim()) return toast.error("Vui lòng nhập tiêu đề cho ghi chú.");
        
        setLoading(true);
        try {
            const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
            const linkIds = outgoingLinks.map(l => l._id);
            const payload = { title, content, tags: tagsArray, links: linkIds };

            if (noteId) {
                await axios.put(`http://localhost:5000/api/note/editsNote/${noteId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Cập nhật ghi chú thành công.");
            } else {
                const res = await axios.post("http://localhost:5000/api/note/newNote", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Tạo ghi chú mới thành công.");
                navigate(`/editor?id=${res.data.newNote._id}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.response?.data?.error || "Lỗi kết nối máy chủ khi lưu.");
        } finally {
            setLoading(false);
        }
    };

    // Lọc dropdown: chỉ hiện những note chưa được link và không phải chính mình
    const availableNotes = allNotes.filter(n => 
        n._id !== noteId && !outgoingLinks.some(l => l._id === n._id)
    );

    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">{noteId ? "Chỉnh sửa ghi chú" : "Tạo ghi chú mới"}</h1>
                    <p className="main__subtitle">Trình soạn thảo nội dung với hệ thống liên kết tri thức.</p>
                </div>
                <div className="main__header-actions">
                    <Link to="/explorer" className="btn btn--ghost">Quay lại danh sách</Link>
                    {noteId && (
                        <button className="btn" type="button" onClick={handleDelete} style={{ background: '#d32f2f', color: '#fff', border: 'none', marginLeft: '0.5rem' }}>
                            Xóa ghi chú
                        </button>
                    )}
                    <button className="btn btn--primary" type="button" onClick={handleSave} disabled={loading} style={{ marginLeft: '0.5rem' }}>
                        {loading ? "Đang xử lý..." : "Lưu ghi chú"}
                    </button>
                </div>
            </header>

            <section className="main__content" aria-label="Note editor layout">
                <div className="editor-layout editor-layout--three">
                    
                    {/* CỘT TRÁI: Thông tin ghi chú + Quản lý liên kết */}
                    <aside className="editor-pane">
                        <article className="card card--soft">
                            <header className="card__header">
                                <h2 className="card__title">Thông tin ghi chú</h2>
                            </header>
                            <div className="form-group" style={{marginTop: '1rem'}}>
                                <label>Tiêu đề ghi chú</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder="Nhập tiêu đề..." 
                                />
                            </div>
                            <div className="form-group">
                                <label>Thẻ phân loại (ngăn cách bằng dấu phẩy)</label>
                                <input 
                                    type="text" 
                                    value={tags} 
                                    onChange={(e) => setTags(e.target.value)} 
                                    placeholder="Ví dụ: công việc, học tập, PKM..." 
                                />
                            </div>
                            {noteId && (
                                <div className="form-group" style={{ background: '#1c1c1e', padding: '10px', borderRadius: '8px' }}>
                                    <label>Siêu dữ liệu hệ thống</label>
                                    <p className="card__meta">
                                        Cập nhật lần cuối: <span style={{color: 'white'}}>{metaInfo.updated}</span><br />
                                        Mã ID nội bộ: <span style={{color: '#999'}}>{metaInfo.id}</span>
                                    </p>
                                </div>
                            )}
                        </article>

                        {/* QUẢN LÝ LIÊN KẾT ĐI (Outgoing Links) */}
                        <article className="card card--soft" style={{ marginTop: '1rem' }}>
                            <header className="card__header">
                                <h2 className="card__title">🔗 Liên kết đến ghi chú khác</h2>
                            </header>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <select
                                        style={{ 
                                            flex: 1, 
                                            padding: '0.5rem', 
                                            background: '#111', 
                                            color: '#fff', 
                                            border: '1px solid #333', 
                                            borderRadius: '6px', 
                                            outline: 'none',
                                            fontSize: '0.9rem'
                                        }}
                                        value={selectedNoteForLink}
                                        onChange={e => setSelectedNoteForLink(e.target.value)}
                                    >
                                        <option value="">-- Chọn ghi chú --</option>
                                        {availableNotes.map(n => (
                                            <option key={n._id} value={n._id}>{n.title}</option>
                                        ))}
                                    </select>
                                    <button 
                                        className="btn btn--primary" 
                                        type="button" 
                                        onClick={handleAddLink}
                                        style={{ padding: '0.5rem 0.8rem', whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                                    >
                                        + Thêm
                                    </button>
                                </div>

                                {/* Danh sách các note đã liên kết */}
                                {outgoingLinks.length === 0 ? (
                                    <p style={{ fontStyle: 'italic', color: '#888', fontSize: '0.85rem' }}>
                                        Chưa có liên kết nào. Chọn một ghi chú từ menu phía trên và bấm "+ Thêm" để tạo liên kết.
                                    </p>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {outgoingLinks.map(link => (
                                            <li key={link._id} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.5rem 0.6rem',
                                                marginBottom: '0.4rem',
                                                background: 'rgba(255,51,102,0.06)',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(255,51,102,0.15)',
                                                transition: 'all 0.2s ease'
                                            }}>
                                                <span 
                                                    style={{ color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
                                                    onClick={() => navigate(`/editor?id=${link._id}`)}
                                                >
                                                    🔗 {link.title}
                                                </span>
                                                <button 
                                                    onClick={() => handleRemoveLink(link._id)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#d32f2f',
                                                        cursor: 'pointer',
                                                        fontSize: '1.1rem',
                                                        padding: '0 0.3rem',
                                                        lineHeight: 1
                                                    }}
                                                    title="Gỡ liên kết"
                                                >
                                                    ✕
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.8rem' }}>
                                    💡 Lưu ý: Bấm "Lưu ghi chú" để các liên kết được lưu vào hệ thống.
                                </p>
                            </div>
                        </article>
                    </aside>

                    {/* CỘT GIỮA: Vùng soạn thảo nội dung */}
                    <section className="editor-pane">
                        <div className="editor-surface">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Viết nội dung ghi chú của bạn tại đây..."
                                style={{ 
                                    width: '100%', 
                                    height: '600px', 
                                    padding: '1rem', 
                                    background: 'transparent', 
                                    color: '#e4e4e7', 
                                    border: 'none', 
                                    outline: 'none', 
                                    resize: 'none', 
                                    fontFamily: 'inherit', 
                                    fontSize: '1rem',
                                    lineHeight: '1.6'
                                }}
                            />
                        </div>
                    </section>

                    {/* CỘT PHẢI: Backlinks (ghi chú khác trỏ đến đây) */}
                    <aside className="editor-pane">
                        <article className="card card--soft">
                            <header className="card__header">
                                <h2 className="card__title">Liên kết trỏ đến (Backlinks)</h2>
                            </header>
                            <div style={{padding: '1.2rem', color: '#ccc'}}>
                                {backlinks.length === 0 ? (
                                    <p style={{fontStyle: 'italic', color: '#888', fontSize: '0.9rem'}}>
                                        Chưa có ghi chú nào liên kết đến ghi chú này.
                                    </p>
                                ) : (
                                    <ul style={{ paddingLeft: '1rem', listStyleType: 'disc' }}>
                                        {backlinks.map((link) => (
                                            <li key={link._id} style={{ marginBottom: '1rem' }}>
                                                <span style={{color:'var(--accent)', marginRight:'5px'}}>🔗</span>
                                                <a href={`/editor?id=${link.sourceNoteId?._id}`} style={{ color: 'var(--text-color)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    {link.sourceNoteId?.title || "Ghi chú ẩn (Lỗi dữ liệu)"}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </article>
                    </aside>

                </div>
            </section>
        </>
    );
}
