import { Link } from 'react-router-dom';

export default function Explorer() {
    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">Explorer</h1>
                    <p className="main__subtitle">
                        Kho lưu trữ toàn bộ ghi chú trong PKG của bạn.
                    </p>
                </div>
                <div className="main__header-actions">
                    <Link to="/editor" className="btn btn--primary">New note</Link>
                </div>
            </header>

            <section className="main__content" aria-label="Explorer content">
                <article className="card">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Bộ lọc & tìm kiếm</h2>
                            <p className="card__subtitle">
                                Lọc theo tags, sắp xếp theo ngày để duyệt nhanh kho ghi chú.
                            </p>
                        </div>
                    </header>
                    <div className="filter-bar">
                        <div className="filter-bar__search">
                            <input
                                type="search"
                                placeholder="Tìm theo tiêu đề, nội dung..."
                                aria-label="Search notes"
                            />
                        </div>
                        <div className="filter-bar__controls">
                            <select aria-label="Filter by tag">
                                <option>Filter by tag</option>
                                <option>pkm</option>
                                <option>research</option>
                                <option>idea</option>
                            </select>
                            <select aria-label="Sort by">
                                <option>Sort by date (newest)</option>
                                <option>Sort by date (oldest)</option>
                                <option>Sort by backlinks</option>
                            </select>
                            <button className="btn btn--ghost" type="button">Reset</button>
                        </div>
                    </div>
                </article>

                <article className="card">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Danh sách ghi chú</h2>
                            <p className="card__subtitle">
                                Dạng bảng mô phỏng để quản lý note: tiêu đề, tags, ngày sửa, backlinks.
                            </p>
                        </div>
                        <span className="badge">Table view</span>
                    </header>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" aria-label="Note list table">
                            <thead>
                                <tr>
                                    <th scope="col">Tiêu đề</th>
                                    <th scope="col">Tags</th>
                                    <th scope="col">Ngày sửa</th>
                                    <th scope="col">Backlinks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Graph thinking for PKM</td>
                                    <td>pkm, graph</td>
                                    <td>5 phút trước</td>
                                    <td>6</td>
                                </tr>
                                <tr>
                                    <td>Obsidian → PKG migration checklist</td>
                                    <td>migration, obsidian</td>
                                    <td>2 giờ trước</td>
                                    <td>1</td>
                                </tr>
                                <tr>
                                    <td>Weekly review 2026-03-15</td>
                                    <td>review, weekly</td>
                                    <td>1 ngày trước</td>
                                    <td>7</td>
                                </tr>
                                <tr>
                                    <td>Research: second brain tools</td>
                                    <td>research, tools</td>
                                    <td>4 ngày trước</td>
                                    <td>3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </article>

                <article className="card">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Dạng lưới (Grid cards)</h2>
                            <p className="card__subtitle">
                                Một cách khác để duyệt nhanh các ghi chú, giống gallery.
                            </p>
                        </div>
                        <span className="badge">Grid view</span>
                    </header>
                    <div className="note-grid" aria-label="Note grid">
                        <div className="card card--soft">
                            <div className="card__header">
                                <h3 className="card__title">Daily log - 2026-03-16</h3>
                                <span className="tag--muted tag">daily</span>
                            </div>
                            <p className="card__meta">
                                Lần sửa gần nhất: 2 giờ trước · 2 backlinks
                            </p>
                        </div>
                        <div className="card card--soft">
                            <div className="card__header">
                                <h3 className="card__title">Reading notes: "How to take smart notes"</h3>
                                <span className="tag">reading</span>
                            </div>
                            <p className="card__meta">
                                Lần sửa gần nhất: 3 ngày trước · 5 backlinks
                            </p>
                        </div>
                        <div className="card card--soft">
                            <div className="card__header">
                                <h3 className="card__title">Brainstorm: PKG features</h3>
                                <span className="tag--muted tag">idea</span>
                            </div>
                            <p className="card__meta">
                                Lần sửa gần nhất: 1 tuần trước · 4 backlinks
                            </p>
                        </div>
                    </div>
                </article>
            </section>
        </>
    );
}
