export default function DashboardPageHeader({ title, description, actions }) {
    return (
        <div className="dashboard-page-header">
            <div>
                <h2 className="dashboard-page-title">{title}</h2>
                {description ? (
                    <p className="dashboard-page-description">{description}</p>
                ) : null}
            </div>

            {actions ? <div className="dashboard-page-actions">{actions}</div> : null}
        </div>
    );
}
