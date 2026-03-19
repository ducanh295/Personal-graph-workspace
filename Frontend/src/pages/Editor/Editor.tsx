export default function Editor() {
    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">Note Editor</h1>
                    <p className="main__subtitle">
                        Soạn thảo nội dung và xem các liên kết liên quan tới ghi chú này.
                    </p>
                </div>
                <div className="main__header-actions">
                    <button className="btn btn--ghost" type="button">Preview</button>
                    <button className="btn btn--primary" type="button">Save note</button>
                </div>
            </header>

            <section className="main__content" aria-label="Note editor layout">
                <div className="editor-layout editor-layout--three">
                    {/* Left meta column */}
                    <aside className="editor-pane" aria-label="Note meta">
                        <article className="card card--soft">
                            <header className="card__header">
                                <div>
                                    <h2 className="card__title">Thông tin ghi chú</h2>
                                    <p className="card__subtitle">Meta data cơ bản</p>
                                </div>
                            </header>
                            <div className="form-group">
                                <label htmlFor="note-title">Tiêu đề ghi chú</label>
                                <input
                                    id="note-title"
                                    type="text"
                                    name="title"
                                    placeholder="Nhập tiêu đề cho ghi chú..."
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="note-tags">Tags</label>
                                <input
                                    id="note-tags"
                                    type="text"
                                    name="tags"
                                    placeholder="Ví dụ: pkm, graph, design"
                                />
                            </div>
                            <div className="form-group">
                                <label>Meta data</label>
                                <p className="card__meta">
                                    Ngày tạo: <strong>2026-03-16</strong><br />
                                    Ngày sửa gần nhất: <strong>2026-03-16 · 21:00</strong><br />
                                    ID node: <strong>note-graph-001</strong>
                                </p>
                            </div>
                        </article>
                    </aside>

                    {/* Main editor column */}
                    <section className="editor-pane" aria-label="Main note editor">
                        <div className="editor-toolbar">
                            <div className="editor-toolbar__left">
                                <span className="badge">Markdown-like editor</span>
                                <span className="card__meta">
                                    Dùng <code>#</code>, <code>-</code>, <code>**bold**</code>...
                                </span>
                            </div>
                            <div className="editor-toolbar__right">
                                <span className="card__meta">~1.240 words · 6 backlinks</span>
                            </div>
                        </div>

                        <div
                            className="editor-surface"
                            contentEditable={true}
                            role="textbox"
                            aria-multiline="true"
                            aria-label="Note content"
                        >
                            <p># Graph thinking for PKM</p>
                            <p>
                                Đây là khu vực soạn thảo mô phỏng markdown cho ghi chú của bạn.
                                Hãy tưởng tượng nội dung này đang được render như trong một app PKM
                                hiện đại (Obsidian / Notion style).
                            </p>
                            <p>
                                - Ý tưởng chính 1<br />
                                - Ý tưởng chính 2<br />
                                - Liên kết tới [[Một ghi chú khác]]
                            </p>
                            <p>
                                Bạn có thể dùng đoạn văn, danh sách, trích dẫn, tiêu đề và liên kết
                                nội bộ để mô tả "graph" kiến thức của mình.
                            </p>
                        </div>
                    </section>

                    {/* Right backlinks column */}
                    <aside className="editor-pane" aria-label="Backlinks panel">
                        <article className="card card--soft">
                            <header className="card__header">
                                <div>
                                    <h2 className="card__title">Backlinks</h2>
                                    <p className="card__subtitle">
                                        Những ghi chú đang trỏ tới ghi chú hiện tại.
                                    </p>
                                </div>
                                <span className="badge">6 items</span>
                            </header>
                            <ul className="backlinks-list">
                                <li>
                                    <p className="list-item__title">Weekly review 2026-03-15</p>
                                    <p className="list-item__meta">
                                        Đoạn trích: "...tập trung nhiều hơn vào
                                        <strong>graph thinking</strong> thay vì danh sách tuyến tính..."
                                    </p>
                                </li>
                                <li>
                                    <p className="list-item__title">PKG architecture overview</p>
                                    <p className="list-item__meta">
                                        Đoạn trích: "...mỗi note là một node trong
                                        <strong>personal knowledge graph</strong>..."
                                    </p>
                                </li>
                                <li>
                                    <p className="list-item__title">Research: second brain tools</p>
                                    <p className="list-item__meta">
                                        Đoạn trích: "...Obsidian, Logseq, PKG là ví dụ về graph-based
                                        PKM..."
                                    </p>
                                </li>
                            </ul>
                        </article>
                    </aside>
                </div>
            </section>
        </>
    );
}
