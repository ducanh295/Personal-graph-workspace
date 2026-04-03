import { useState, useEffect, useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './GraphView.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface GraphData {
    nodes: any[];
    links: any[];
}

export default function GraphView() {
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    const fgRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchGraphData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get("http://localhost:5000/api/note/graph/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGraphData(res.data);
        } catch (error: any) {
            toast.error("Lỗi tải đồ thị liên kết: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Auto-Resize để vừa khít Container Không Lòi Ra Ngoài
    useEffect(() => {
        const obs = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        if (containerRef.current) obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        fetchGraphData();
    }, []);

    const handleNodeClick = useCallback(
        (node: any) => {
            // Khi ấn phát bay qua Editor, đập màn nhện vào mặt
            navigate(`/editor?id=${node.id}`);
        },
        [navigate]
    );

    return (
        <div className="graph-page-wrapper">
            <header className="main__header graph-page-header">
                <div className="main__title-group">
                    <h1 className="main__title">Đồ thị liên kết</h1>
                    <p className="main__subtitle">
                        Mô phỏng không gian tri thức trực quan.
                    </p>
                </div>
                <div className="main__header-actions">
                    <button
                        className="btn btn--ghost"
                        type="button"
                        onClick={() => fgRef.current?.zoomToFit(400)}
                    >
                        Khớp khung hình
                    </button>
                    <button className="btn btn--primary" onClick={() => fetchGraphData()}>Tải lại đồ thị</button>
                </div>
            </header>

            <section className="main__content graph-page-content" aria-label="Graph canvas">
                <article ref={containerRef} className="graph-canvas-container">
                    {loading ? (
                        <div className="graph-loading-text">
                            Đang tải đồ thị...
                        </div>
                    ) : graphData.nodes.length === 0 ? (
                        <div className="graph-empty-text">Hệ thống chưa có đủ liên kết để vẽ đồ thị.</div>
                    ) : (
                        <ForceGraph2D
                            ref={fgRef}
                            graphData={graphData}
                            width={dimensions.width}
                            height={dimensions.height}
                            nodeRelSize={5}
                            // Kích cỡ Node
                            nodeVal={(node: any) => node.val}
                            // Render Các Hạt Chuyển Động (Particle) Chạy Nháy trên Dây Nối Link!
                            linkDirectionalParticles={3}
                            linkDirectionalParticleWidth={2}
                            linkDirectionalParticleSpeed={0.005}
                            linkWidth={1.5}
                            linkColor={() => 'rgba(255, 255, 255, 0.15)'}
                            onNodeClick={handleNodeClick}
                            nodeCanvasObject={(node: any, ctx, globalScale) => {
                                const label = node.name;
                                const fontSize = 13 / globalScale;
                                ctx.font = `500 ${fontSize}px "Inter", sans-serif`;

                                const r = Math.sqrt(node.val) * 3 + 2;
                                const color = node.val > 2 ? '#ff3366' : '#6d5dfc';

                                ctx.beginPath();
                                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
                                ctx.fillStyle = color;
                                ctx.shadowColor = color;
                                ctx.shadowBlur = 12 * globalScale;
                                ctx.fill();

                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                                ctx.shadowBlur = 0;
                                ctx.fillText(label, node.x, node.y + r + fontSize * 0.4);
                            }}
                        />
                    )}

                    {/* Chú thích đồ thị */}
                    <div className="graph-legend">
                        <p className="graph-legend-title">📌 Chú thích đồ thị</p>
                        <div className="graph-legend-item">
                            <span className="legend-dot red"></span>
                            <span>Ghi chú nổi bật (có liên kết trỏ đến)</span>
                        </div>
                        <div className="graph-legend-item">
                            <span className="legend-dot purple"></span>
                            <span>Ghi chú độc lập (chưa có liên kết)</span>
                        </div>
                        <p className="graph-legend-note">
                            Kích thước chấm = mức độ được tham chiếu.<br />
                            Nhấn vào chấm để mở ghi chú.
                        </p>
                    </div>
                </article>
            </section>
        </div>
    );
}
