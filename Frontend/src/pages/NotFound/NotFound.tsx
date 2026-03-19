import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <main className="not-found-page">
            <section className="not-found-card" aria-labelledby="not-found-title">
                <p className="badge">Personal Knowledge Graph</p>
                <h1 id="not-found-title" className="not-found-code">404</h1>
                <p className="not-found-message">
                    Không tìm thấy trang bạn yêu cầu. Có thể liên kết đã bị thay đổi hoặc ghi
                    chú đã được di chuyển trong graph của bạn.
                </p>
                <Link to="/" className="btn btn--primary">Quay lại Dashboard</Link>
            </section>
        </main>
    );
}
