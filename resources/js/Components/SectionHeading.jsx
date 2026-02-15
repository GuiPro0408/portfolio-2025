export default function SectionHeading({
    eyebrow,
    title,
    description,
    align = 'left',
}) {
    const alignment = align === 'center' ? 'text-center' : 'text-left';

    return (
        <header className={`space-y-3 ${alignment}`}>
            {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
            <h2 className="section-title">{title}</h2>
            {description && <p className="section-description">{description}</p>}
        </header>
    );
}
