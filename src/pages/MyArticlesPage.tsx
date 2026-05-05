import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { useCurrentUserId } from "../hooks/useCurrentUserId";
import { ArticleCard } from "../components/ArticleCard";

export default function MyArticlesPage() {
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();

  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-articles", userId],
    queryFn: () => api.get<Article[]>(`/api/users/${userId}/articles`),
  });

  const deleteMutation = useMutation({
    mutationFn: (articleId: string) =>
      api.delete<unknown>(`/api/articles/${articleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-articles", userId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  function handleDelete(article: Article) {
    const ok = window.confirm(
      `Voulez-vous vraiment supprimer "${article.title}" ?`,
    );
    if (ok) {
      deleteMutation.mutate(article.id);
    }
  }

  if (isLoading) {
    return <p>Chargement de vos annonces...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        Erreur lors du chargement de vos annonces.
      </p>
    );
  }

  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold">Mes annonces</h1>

      {deleteMutation.isError && (
        <p className="mb-4 text-sm text-red-600">
          Erreur lors de la suppression : {deleteMutation.error.message}
        </p>
      )}

      {articles.length === 0 ? (
        <div className="rounded-lg border bg-white p-6">
          <p className="mb-4">Vous n'avez encore publié aucune annonce.</p>
          <Link
            to="/publish"
            className="rounded-full bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700"
          >
            Publier une annonce
          </Link>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onDeleteClick={() => handleDelete(article)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
