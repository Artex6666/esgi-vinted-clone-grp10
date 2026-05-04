import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";

export function useFavorites() {
    const queryClient = useQueryClient();

    const favoritesQuery = useQuery({
        queryKey: ["favorites"],
        queryFn: () => api.get<Article[]>("/api/favorites"),
    });

    const addFavorite = useMutation({
        mutationFn: (articleId: string) => {
            return api.post(`/api/favorites/${articleId}`, {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });

    const removeFavorite = useMutation({
        mutationFn: (articleId: string) => {
            return api.delete(`/api/favorites/${articleId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });

    return {
        favorites: favoritesQuery.data ?? [],
        isLoading: favoritesQuery.isLoading,
        error: favoritesQuery.error,
        addFavorite,
        removeFavorite,
    };
}