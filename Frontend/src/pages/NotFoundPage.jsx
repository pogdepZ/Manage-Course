import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <h2>Page not found</h2>
          <p>The route you requested does not exist.</p>
        </div>
      </header>
      <Link to="/app/dashboard" className="primary-button link-button">
        Back to Dashboard
      </Link>
    </section>
  );
}
