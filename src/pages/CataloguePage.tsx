import { Link } from "react-router-dom";
import { useArticles } from "../hooks/useArticles";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export default function CataloguePage() {
  const { data: articles = [], isLoading, error } = useArticles();

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur de chargement</p>;

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Catalogue</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            className="rounded border p-4 hover:shadow"
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-48 w-full object-cover"
            />

            <h2 className="mt-2 font-semibold">{article.title}</h2>

            <p className="font-bold">{formatPrice(article.price)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}