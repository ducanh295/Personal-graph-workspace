export default function Admin() {
    return (
        <>
            <header className="main__header">
                <div className="main__title-group">
                    <h1 className="main__title">System Admin Dashboard</h1>
                    <p className="main__subtitle">
                        Tổng quan hoạt động toàn hệ thống Personal Knowledge Graph.
                    </p>
                </div>
                <div className="main__header-actions">
                    <button className="btn btn--ghost" type="button">Export report</button>
                    <button className="btn btn--primary" type="button">New admin action</button>
                </div>
            </header>

            <section className="main__content" aria-label="Admin overview">
                <section aria-label="System statistics" className="grid grid--stats-4">
                    <article className="card stats-card">
                        <div className="stats-card__label">Tổng số User</div>
                        <div className="stats-card__value">12,480</div>
                        <div className="stats-card__delta stats-card__delta--up">
                            ▲ +320 tuần này
                        </div>
                    </article>
                    <article className="card stats-card">
                        <div className="stats-card__label">Tổng số Note</div>
                        <div className="stats-card__value">842,193</div>
                        <div className="stats-card__delta stats-card__delta--up">
                            ▲ +18,204 tuần này
                        </div>
                    </article>
                    <article className="card stats-card">
                        <div className="stats-card__label">Lưu lượng truy cập</div>
                        <div className="stats-card__value">1.2M</div>
                        <div className="stats-card__delta stats-card__delta--up">
                            ▲ +8.3% so với tuần trước
                        </div>
                    </article>
                    <article className="card stats-card">
                        <div className="stats-card__label">Tỉ lệ lỗi hệ thống</div>
                        <div className="stats-card__value">0.14%</div>
                        <div className="stats-card__delta stats-card__delta--down">
                            ▼ -0.03% tuần này
                        </div>
                    </article>
                </section>

                <section className="grid grid--2" aria-label="Charts and user management">
                    <article className="card">
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">User mới đăng ký</h2>
                                <p className="card__subtitle">Biểu đồ mô phỏng 7 ngày gần nhất</p>
                            </div>
                            <span className="badge">Mock chart / CSS-only</span>
                        </header>
                        <div className="chart" aria-hidden="true">
                            <div className="chart__bar" style={{ height: '40%' }}></div>
                            <div className="chart__bar chart__bar--muted" style={{ height: '60%' }}></div>
                            <div className="chart__bar" style={{ height: '55%' }}></div>
                            <div className="chart__bar chart__bar--muted" style={{ height: '70%' }}></div>
                            <div className="chart__bar" style={{ height: '65%' }}></div>
                            <div className="chart__bar chart__bar--muted" style={{ height: '80%' }}></div>
                            <div className="chart__bar" style={{ height: '75%' }}></div>
                        </div>
                        <div className="chart__label-row">
                            <span>Hôm nay</span>
                            <span>7 ngày</span>
                        </div>
                    </article>

                    <article className="card">
                        <header className="card__header">
                            <div>
                                <h2 className="card__title">Tóm tắt bảo mật</h2>
                                <p className="card__subtitle">Giám sát nhanh các rủi ro phổ biến</p>
                            </div>
                        </header>
                        <ul className="list">
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Tài khoản bị đánh dấu bất thường</p>
                                    <p className="list-item__meta">
                                        5 tài khoản có hành vi đăng nhập lạ trong 24h qua.
                                    </p>
                                </div>
                                <span className="tag--danger tag">Cần xem</span>
                            </li>
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Bản sao lưu gần nhất</p>
                                    <p className="list-item__meta">Hoàn thành 3 giờ trước · không lỗi.</p>
                                </div>
                                <span className="tag">OK</span>
                            </li>
                            <li className="list-item">
                                <div>
                                    <p className="list-item__title">Phiên bản schema dữ liệu</p>
                                    <p className="list-item__meta">
                                        PKG Schema v3.4 · tất cả node đã migrate.
                                    </p>
                                </div>
                                <span className="tag--muted tag">Stable</span>
                            </li>
                        </ul>
                    </article>
                </section>

                <section aria-label="User management" className="card">
                    <header className="card__header">
                        <div>
                            <h2 className="card__title">Quản lý người dùng</h2>
                            <p className="card__subtitle">
                                Bảng mô phỏng dữ liệu người dùng: ID, Email, Role, Trạng thái.
                            </p>
                        </div>
                        <button className="btn btn--ghost" type="button">Thêm user</button>
                    </header>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" aria-label="User Management Table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#00123</td>
                                    <td>alice@pkg.app</td>
                                    <td>Admin</td>
                                    <td><span className="status-pill status-pill--active">Active</span></td>
                                    <td>
                                        <button type="button" className="btn btn--ghost">Edit</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#00456</td>
                                    <td>bob@example.com</td>
                                    <td>User</td>
                                    <td><span className="status-pill status-pill--active">Active</span></td>
                                    <td>
                                        <button type="button" className="btn btn--ghost">Edit</button>
                                        <button type="button" className="btn btn--danger">Ban</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#00789</td>
                                    <td>charlie@test.dev</td>
                                    <td>User</td>
                                    <td><span className="status-pill status-pill--banned">Banned</span></td>
                                    <td>
                                        <button type="button" className="btn btn--ghost">Unban</button>
                                        <button type="button" className="btn btn--danger">Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#01024</td>
                                    <td>daisy@knowledge.ai</td>
                                    <td>Moderator</td>
                                    <td><span className="status-pill status-pill--active">Active</span></td>
                                    <td>
                                        <button type="button" className="btn btn--ghost">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </section>
        </>
    );
}
