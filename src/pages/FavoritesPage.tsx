import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { useFavorites } from "../hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, isLoading, error, removeFavorite } = useFavorites();

  if (isLoading) {
    return <p className="p-6">Chargement des favoris...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-600">
        Erreur lors du chargement des favoris.
      </p>
    );
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Mes favoris</h1>

      {favorites.length === 0 ? (
        <div className="rounded-lg border bg-white p-6">
          <p className="mb-4">Vous n’avez aucun favori pour le moment.</p>

          <Link to="/" className="text-blue-600 underline">
            Retour au catalogue
          </Link>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorite={true}
              onFavoriteClick={() => removeFavorite.mutate(article.id)}
            />
          ))}
        </section>
      )}
    </main>
  );
}