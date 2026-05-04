import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { ArticleCard } from "../components/ArticleCard";
import { useFavorites } from "../hooks/useFavorites";

export default function CataloguePage() {
  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: () => api.get<Article[]>("/api/articles"),
  });

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const favoriteIds = favorites.map((article) => article.id);

  function handleFavoriteClick(articleId: string) {
    if (favoriteIds.includes(articleId)) {
      removeFavorite.mutate(articleId);
    } else {
      addFavorite.mutate(articleId);
    }
  }

  if (isLoading) {
    return <p className="p-6">Chargement des articles...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-600">
        Erreur lors du chargement des articles.
      </p>
    );
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Catalogue</h1>

      {articles.length === 0 ? (
        <p>Aucun article disponible.</p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorite={favoriteIds.includes(article.id)}
              onFavoriteClick={() => handleFavoriteClick(article.id)}
            />
          ))}
        </section>
      )}
    </main>
  );
}