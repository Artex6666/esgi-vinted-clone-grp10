import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function conditionLabel(value: string) {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value;
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

      <p className="mt-4 whitespace-pre-line">{article.description}</p>

      <dl className="mt-6 grid max-w-lg grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-gray-500">Catégorie</dt>
        <dd>{categoryLabel(article.category)}</dd>

        <dt className="text-gray-500">État</dt>
        <dd>{conditionLabel(article.condition)}</dd>

        <dt className="text-gray-500">Taille</dt>
        <dd>{article.size}</dd>

        <dt className="text-gray-500">Vendeur</dt>
        <dd>{article.userName}</dd>

        <dt className="text-gray-500">Publié le</dt>
        <dd>{formatDate(article.createdAt)}</dd>
      </dl>
    </main>
  );
}