import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article, ArticleFormData } from "../types/article";
import { ArticleForm } from "../components/ArticleForm";

export default function PublishPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ArticleFormData) =>
      api.post<Article>("/api/articles", payload),
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      navigate(`/articles/${article.id}`);
    },
  });

  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold">Publier une annonce</h1>

      <ArticleForm
        submitLabel="Publier"
        pendingLabel="Publication..."
        isPending={mutation.isPending}
        error={mutation.error}
        onSubmit={(values) => mutation.mutate(values)}
      />
    </main>
  );
}
