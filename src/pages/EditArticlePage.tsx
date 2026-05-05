import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article, ArticleFormData } from "../types/article";
import { ArticleForm } from "../components/ArticleForm";
import { useCurrentUserId } from "../hooks/useCurrentUserId";

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();

  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => api.get<Article>(`/api/articles/${id}`),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (payload: ArticleFormData) =>
      api.put<Article>(`/api/articles/${id}`, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", updated.id] });
      navigate(`/articles/${updated.id}`);
    },
  });

  if (isLoading) {
    return <p>Chargement de l'annonce...</p>;
  }

  if (error || !article) {
    return (
      <main>
        <p className="text-red-600">Article introuvable.</p>
        <Link to="/" className="text-blue-600 underline">
          Retour au catalogue
        </Link>
      </main>
    );
  }

  if (article.userId !== userId) {
    return (
      <main>
        <p className="text-red-600">
          Vous n'êtes pas le propriétaire de cette annonce.
        </p>
        <Link to="/my-articles" className="text-blue-600 underline">
          Retour à mes annonces
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold">Modifier l'annonce</h1>

      <ArticleForm
        initialValues={{
          title: article.title,
          description: article.description,
          price: article.price,
          category: article.category,
          size: article.size,
          condition: article.condition,
          imageUrl: article.imageUrl,
        }}
        submitLabel="Enregistrer"
        pendingLabel="Enregistrement..."
        isPending={mutation.isPending}
        error={mutation.error}
        onSubmit={(values) => mutation.mutate(values)}
      />
    </main>
  );
}
