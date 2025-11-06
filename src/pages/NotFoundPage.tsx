import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section-container text-center">
      <h2 className="text-4xl font-bold text-dancheongNavy">404</h2>
      <p className="mt-4 text-slate-600">
        La page que vous recherchez n&apos;existe pas encore. Rejoignez-nous sur la page d&apos;accueil pour explorer la Corée.
      </p>
      <div className="mt-6">
        <Link to="/" className="primary-button">
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}
