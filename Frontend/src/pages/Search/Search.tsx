export default function Search() {
    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">Search</h1>
                    <p className="main__subtitle">
                        Tìm kiếm toàn văn bản trong toàn bộ hệ thống PKG.
                    </p>
                </div>
            </header>

            <section className="main__content" aria-label="Search content">
                <section className="search-hero" aria-label="Primary search bar">
                    <input
                        type="search"
                        className="search-input-large"
                        placeholder="Gõ từ khóa để tìm kiếm trong 'bộ não thứ hai' của bạn..."
                        aria-label="Full-text search"
                    />
                </section>

                <section className="card" aria-label="Search results">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Kết quả tìm kiếm</h2>
                            <p className="card__subtitle">
                                Ví dụ mô phỏng: hiển thị tiêu đề ghi chú và đoạn trích có highlight
                                từ khóa.
                            </p>
                        </div>
                    </header>
                    <div className="search-results">
                        <article className="search-result">
                            <h3 className="search-result__title">Graph thinking for PKM</h3>
                            <p className="search-result__snippet">
                                "...thay vì danh sách tuyến tính, hãy hình dung
                                <b>graph</b> kiến thức như một mạng lưới nodes và edges..."
                            </p>
                        </article>
                        <article className="search-result">
                            <h3 className="search-result__title">
                                PKG architecture overview: core <b>graph</b> concepts
                            </h3>
                            <p className="search-result__snippet">
                                "...mỗi ghi chú trong PKG là một node trong <b>graph</b>; liên kết
                                hai chiều tạo thành cấu trúc bền vững..."
                            </p>
                        </article>
                        <article className="search-result">
                            <h3 className="search-result__title">
                                Research notes: tools for <b>graph</b>-based PKM
                            </h3>
                            <p className="search-result__snippet">
                                "...so sánh Obsidian, Logseq và PKG từ góc độ <b>graph</b> visibility
                                và UX..."
                            </p>
                        </article>
                    </div>
                </section>
            </section>
        </>
    );
}
