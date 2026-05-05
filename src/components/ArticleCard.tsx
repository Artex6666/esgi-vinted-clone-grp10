import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

type ArticleCardProps = {
  article: Article;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  onDeleteClick?: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function conditionLabel(value: string) {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value;
}

export function ArticleCard({
  article,
  isFavorite = false,
  onFavoriteClick,
  onDeleteClick,
}: ArticleCardProps) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="block overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md"
    >
      <div className="relative">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="h-64 w-full object-cover"
        />

        {onFavoriteClick && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onFavoriteClick();
            }}
            className="absolute right-3 top-3 rounded-full bg-white px-3 py-2 text-xl shadow hover:bg-gray-100"
            aria-label={
              isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
            }
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        )}
      </div>

      <div className="p-4">
        <h2 className="font-semibold">{article.title}</h2>

        <p className="mt-1 font-bold">{formatPrice(article.price)}</p>

        <p className="mt-2 text-sm text-gray-600">
          {categoryLabel(article.category)} · {conditionLabel(article.condition)}
        </p>

        <p className="text-sm text-gray-600">
          Taille : {article.size}
        </p>

        <p className="text-sm text-gray-500">
          Vendeur : {article.userName}
        </p>

        {onDeleteClick && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDeleteClick();
            }}
            className="mt-3 w-full rounded border border-red-500 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Supprimer
          </button>
        )}
      </div>
    </Link>
  );
}