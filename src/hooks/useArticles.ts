import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";

export function useArticles() {
    return useQuery({
        queryKey: ["articles"],
        queryFn: () => api.get<Article[]>("/api/articles"),
    });
}