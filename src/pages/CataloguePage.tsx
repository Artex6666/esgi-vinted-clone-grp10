import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";
import { ArticleCard } from "../components/ArticleCard";
import { useFavorites } from "../hooks/useFavorites";

type Filters = {
  search: string;
  category: string;
  condition: string;
  priceMin: string;
  priceMax: string;
  sort: string;
};

export default function CataloguePage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    condition: "",
    priceMin: "",
    priceMax: "",
    sort: "date_desc",
  });

  const {
    data: articles = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["articles", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.condition) params.set("condition", filters.condition);
      if (filters.priceMin) params.set("priceMin", filters.priceMin);
      if (filters.priceMax) params.set("priceMax", filters.priceMax);
      if (filters.sort) params.set("sort", filters.sort);
      const query = params.toString();
      return api.get<Article[]>(`/api/articles${query ? `?${query}` : ""}`);
    },
    placeholderData: keepPreviousData,
  });

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const favoriteIds = favorites.map((article) => article.id);

  function handleFilterChange(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

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

      <section className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <select
          value={filters.condition}
          onChange={(e) => handleFilterChange("condition", e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">Tous les états</option>
          {CONDITIONS.map((cond) => (
            <option key={cond.value} value={cond.value}>
              {cond.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Prix min"
          value={filters.priceMin}
          onChange={(e) => handleFilterChange("priceMin", e.target.value)}
          className="w-28 rounded border px-3 py-2 text-sm"
          min={0}
        />
        <input
          type="number"
          placeholder="Prix max"
          value={filters.priceMax}
          onChange={(e) => handleFilterChange("priceMax", e.target.value)}
          className="w-28 rounded border px-3 py-2 text-sm"
          min={0}
        />
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="date_desc">Plus récent</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </section>

      {isFetching && !isLoading && (
        <p className="mb-4 text-sm text-gray-400">Mise à jour...</p>
      )}

      {articles.length === 0 ? (
        <p className="text-gray-500">Aucun article ne correspond à votre recherche.</p>
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