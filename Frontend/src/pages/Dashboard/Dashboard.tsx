import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">User Dashboard</h1>
                    <p className="main__subtitle">
                        Tổng quan "bộ não thứ hai" của bạn: ghi chú, liên kết và gợi ý khám phá.
                    </p>
                </div>
                <div className="main__header-actions">
                    <Link to="/editor" className="btn btn--primary">New note</Link>
                </div>
            </header>

            <section className="main__content" aria-label="User dashboard content">
                <section aria-label="Personal statistics" className="grid grid--stats-4">
                    <article className="card stats-card">
                        <div className="stats-card__label">Tổng số ghi chú</div>
                        <div className="stats-card__value">342</div>
                        <div className="stats-card__delta stats-card__delta--up">
                            ▲ +8 tuần này
                        </div>
                    </article>
                    <article className="card stats-card">
                        <div className="stats-card__label">Số lượng liên kết</div>
                        <div className="stats-card__value">1,248</div>
                        <div className="stats-card__delta stats-card__delta--up">
                            ▲ +74 tuần này
                        </div>
                    </article>
                    <article className="card stats-card">
                        <div className="stats-card__label">Ghi chú đang active</div>
                        <div className="stats-card__value">12</div>
                        <div className="stats-card__delta stats-card__delta--up">
                            ▲ Session hiện tại
                        </div>
                    </article>
                    <article className="card stats-card">
                        <div className="stats-card__label">Ngày streak</div>
                        <div className="stats-card__value">27</div>
                        <div className="stats-card__delta stats-card__delta--up">
                            ▲ PKG consistency
                        </div>
                    </article>
                </section>

                <section className="dashboard-section" aria-label="Notes overview">
                    <article className="card">
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">Ghi chú tạo gần đây</h2>
                                <p className="card__subtitle">
                                    Những note bạn vừa tạo / chỉnh sửa gần đây nhất.
                                </p>
                            </div>
                            <span className="badge">Recent notes</span>
                        </header>
                        <ul className="list">
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Graph thinking for PKM</p>
                                    <p className="list-item__meta">
                                        Sửa 5 phút trước · Tag: thinking, pkm
                                    </p>
                                </div>
                                <span className="tag">3 backlinks</span>
                            </li>
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Obsidian → PKG migration checklist</p>
                                    <p className="list-item__meta">
                                        Tạo 2 giờ trước · Tag: migration, obsidian
                                    </p>
                                </div>
                                <span className="tag--muted tag">1 backlink</span>
                            </li>
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Weekly review 2026-03-15</p>
                                    <p className="list-item__meta">
                                        Sửa 1 ngày trước · Tag: review, weekly
                                    </p>
                                </div>
                                <span className="tag">7 backlinks</span>
                            </li>
                        </ul>
                    </article>

                    <article className="card">
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">Ghi chú đã lâu không mở</h2>
                                <p className="card__subtitle">
                                    Những mảnh kiến thức có thể đang bị "lãng quên".
                                </p>
                            </div>
                            <span className="badge">Revive knowledge</span>
                        </header>
                        <ul className="list">
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Books to revisit: Systems thinking</p>
                                    <p className="list-item__meta">
                                        Lần cuối mở: 120 ngày trước · Tag: reading
                                    </p>
                                </div>
                                <span className="tag--muted tag">0 backlinks</span>
                            </li>
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Early PKG architecture ideas</p>
                                    <p className="list-item__meta">
                                        Lần cuối mở: 90 ngày trước · Tag: architecture
                                    </p>
                                </div>
                                <span className="tag">4 backlinks</span>
                            </li>
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Brainstorm: research questions</p>
                                    <p className="list-item__meta">
                                        Lần cuối mở: 75 ngày trước · Tag: research
                                    </p>
                                </div>
                                <span className="tag--muted tag">2 backlinks</span>
                            </li>
                        </ul>
                    </article>
                </section>

                <section className="dashboard-section dashboard-section--single" aria-label="Link suggestions">
                    <article className="card">
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">Gợi ý liên kết</h2>
                                <p className="card__subtitle">
                                    Gợi ý mô phỏng cách PKG có thể đề xuất kết nối mới giữa các ghi chú.
                                </p>
                            </div>
                            <span className="badge">Mock suggestions</span>
                        </header>

                        <ul className="list">
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">
                                        Kết nối
                                        <strong>"Graph thinking for PKM"</strong>
                                        ↔
                                        <strong>"Systems thinking notes"</strong>
                                    </p>
                                    <p className="list-item__meta">
                                        Từ khóa chung: graph, systems, emergent structure.
                                    </p>
                                </div>
                                <span className="tag">Create link</span>
                            </li>
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">
                                        Kết nối
                                        <strong>"Obsidian → PKG migration checklist"</strong>
                                        ↔
                                        <strong>"PKG folder structure"</strong>
                                    </p>
                                    <p className="list-item__meta">
                                        Từ khóa chung: migration, vault, folder, links.
                                    </p>
                                </div>
                                <span className="tag">Create link</span>
                            </li>
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">
                                        Kết nối
                                        <strong>"Weekly review 2026-03-15"</strong>
                                        ↔
                                        <strong>"Review checklist template"</strong>
                                    </p>
                                    <p className="list-item__meta">
                                        Từ khóa chung: weekly review, reflection.
                                    </p>
                                </div>
                                <span className="tag--muted tag">Maybe later</span>
                            </li>
                        </ul>
                    </article>
                </section>
            </section>
        </>
    );
}