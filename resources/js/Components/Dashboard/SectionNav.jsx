export default function SectionNav({ sections, activeSectionId = null }) {
    const handleJump = (event, id) => {
        event.preventDefault();

        const target = document.getElementById(id);
        if (!target) {
            return;
        }

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });

        window.history.replaceState(null, '', `#${id}`);
    };

    return (
        <nav className="dashboard-section-nav" aria-label="Homepage settings sections">
            <p className="dashboard-section-nav-title">Sections</p>
            <ul>
                {sections.map((section) => (
                    <li key={section.id}>
                        <a
                            href={`#${section.id}`}
                            onClick={(event) => handleJump(event, section.id)}
                            className={
                                activeSectionId === section.id
                                    ? 'is-active'
                                    : undefined
                            }
                            aria-current={
                                activeSectionId === section.id
                                    ? 'location'
                                    : undefined
                            }
                        >
                            {section.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
