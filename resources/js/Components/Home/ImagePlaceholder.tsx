export default function ImagePlaceholder({ variant = 'featured', label = '' }) {
    return (
        <div className={`image-placeholder image-placeholder-${variant}`} aria-hidden="true">
            {label ? <span>{label}</span> : null}
        </div>
    );
}
