export default function StatCard({ label, value, icon: Icon }) {
    return (
        <article className="dashboard-stat-card">
            <div className="dashboard-stat-header">
                <p className="dashboard-stat-label">{label}</p>
                {Icon ? <Icon size={16} aria-hidden="true" /> : null}
            </div>
            <p className="dashboard-stat-value">{value}</p>
        </article>
    );
}
