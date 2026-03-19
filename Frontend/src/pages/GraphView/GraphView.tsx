export default function GraphView() {
    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">Graph View</h1>
                    <p className="main__subtitle">
                        Mạng lưới tri thức cá nhân của bạn – phiên bản placeholder cho tích hợp D3.js sau này.
                    </p>
                </div>
                <div className="main__header-actions">
                    <button className="btn btn--ghost" type="button">Center on current note</button>
                </div>
            </header>

            <section className="main__content" aria-label="Graph canvas">
                <article className="graph-canvas">
                    <p className="graph-placeholder-text">
                        <strong>Interactive Knowledge Graph Placeholder (D3.js integration)</strong><br /><br />
                        Khu vực này được thiết kế để render đồ thị tương tác của các ghi chú trong
                        hệ thống Personal Knowledge Graph (PKG). Ở bản HTML/CSS này, đây là một
                        canvas giả lập để sau này gắn JavaScript/D3.js vào.
                    </p>

                    <div className="graph-controls" aria-label="Graph controls">
                        <button
                            className="graph-controls__button"
                            type="button"
                            aria-label="Zoom in"
                        >
                            +
                        </button>
                        <button
                            className="graph-controls__button"
                            type="button"
                            aria-label="Zoom out"
                        >
                            −
                        </button>
                        <button
                            className="graph-controls__button"
                            type="button"
                            aria-label="Filter nodes"
                        >
                            ⚲
                        </button>
                    </div>
                </article>
            </section>
        </>
    );
}
