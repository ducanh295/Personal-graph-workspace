import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/note/search?q=${encodeURIComponent(query)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data);
            } catch (error) {
                toast.error("Lỗi thực hiện tìm kiếm.");
            } finally {
                setLoading(false);
            }
        }, 400); // Tối ưu: Đợi 400ms sau khi ngừng gõ mới bắn cục API (Debounce)
        
        return () => clearTimeout(timer);
    }, [query]);

    // Format snippet hiển thị highlight từ khoá nhẹ nhàng
    const renderSnippet = (content: string, q: string) => {
        if (!content) return "";
        const index = content.toLowerCase().indexOf(q.toLowerCase());
        if (index === -1) return content.slice(0, 100) + '...';
        
        const start = Math.max(0, index - 40);
        const end = Math.min(content.length, index + q.length + 40);
        
        const snippet = content.slice(start, end);
        const parts = snippet.split(new RegExp(`(${q})`, 'gi'));

        return (
            <>
                {start > 0 && "..."}
                {parts.map((p, i) => 
                    p.toLowerCase() === q.toLowerCase() ? <b key={i} style={{ color: 'var(--accent)', backgroundColor: 'rgba(255,51,102,0.1)' }}>{p}</b> : p
                )}
                {end < content.length && "..."}
            </>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">Tìm kiếm</h1>
                    <p className="main__subtitle">
                        Tìm kiếm toàn văn bản trong toàn bộ hệ thống tri thức.
                    </p>
                </div>
            </header>

            <section className="main__content" aria-label="Search content">
                <section className="search-hero" aria-label="Primary search bar">
                    <input
                        type="search"
                        className="search-input-large"
                        placeholder="Nhập từ khóa tìm kiếm..."
                        aria-label="Full-text search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </section>

                <section className="card" aria-label="Search results" style={{ marginTop: '2rem' }}>
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Kết quả tìm kiếm</h2>
                            <p className="card__subtitle">
                                {loading ? "Đang xử lý..." : `Tìm thấy ${results.length} kết quả phù hợp.`}
                            </p>
                        </div>
                    </header>
                    <div className="search-results" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {!loading && results.length === 0 && query.trim() !== '' && (
                            <p style={{ color: '#a1a1aa', padding: '1rem', fontStyle: 'italic' }}>Không tìm thấy kết quả nào phù hợp với từ khóa của bạn.</p>
                        )}
                        {!loading && results.length === 0 && query.trim() === '' && (
                            <p style={{ color: '#555', padding: '1rem' }}>Nhập từ khóa vào ô tìm kiếm ở trên để bắt đầu.</p>
                        )}
                        {results.map((note) => (
                            <article 
                                key={note._id} 
                                className="search-result card card--soft"
                                style={{ 
                                    cursor: 'pointer', 
                                    transition: 'all 0.2s ease',
                                    border: '1px solid transparent'
                                }}
                                onClick={() => navigate(`/editor?id=${note._id}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.transform = 'none';
                                }}
                            >
                                <h3 className="search-result__title" style={{ color: 'var(--text-light)', marginBottom: '0.4rem', fontSize: '1.1rem' }}>
                                    {renderSnippet(note.title, query)}
                                </h3>
                                <p className="search-result__snippet" style={{ color: 'var(--text-muted)' }}>
                                    {renderSnippet(note.content, query)}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </div>
    );
}
