export default function PublicFooter({ contact }) {
    const year = new Date().getFullYear();

    return (
        <footer className="public-footer">
            <div className="public-shell public-footer-inner">
                <p className="public-footer-copy">
                    © {year} Guillaume Juste. Built with Laravel and React.
                </p>

                <div className="public-footer-links" aria-label="Social links">
                    {contact?.linkedin && (
                        <a href={contact.linkedin} target="_blank" rel="noreferrer">
                            LinkedIn
                        </a>
                    )}
                    {contact?.github && (
                        <a href={contact.github} target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                    )}
                    {contact?.email && <a href={`mailto:${contact.email}`}>Email</a>}
                </div>
            </div>
        </footer>
    );
}
