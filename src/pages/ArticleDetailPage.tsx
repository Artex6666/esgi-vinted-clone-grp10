import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

export default function ArticleDetailPage() {
  const { id } = useParams();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", id],
    queryFn: () => api.get<Article>(`/api/articles/${id}`),
    enabled: !!id,
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error || !article) return <p>Article introuvable</p>;

  return (
    <main className="p-6">
      <Link to="/" className="text-blue-600 underline">
        Retour
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{article.title}</h1>

      <img
        src={article.imageUrl}
        alt={article.title}
        className="mt-4 w-full max-w-lg"
      />

      <p className="mt-4 text-xl font-bold">
        {formatPrice(article.price)}
      </p>

      <p className="mt-4">{article.description}</p>

      <p className="mt-4">Vendeur : {article.userName}</p>

      <p>Date : {formatDate(article.createdAt)}</p>
    </main>
  );
}