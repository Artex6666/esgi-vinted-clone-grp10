import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

type FormState = {
  title: string;
  description: string;
  price: string;
  category: string;
  size: string;
  condition: string;
  imageUrl: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  title: "",
  description: "",
  price: "",
  category: "",
  size: "",
  condition: "",
  imageUrl: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  const title = form.title.trim();
  if (title.length < 3 || title.length > 100) {
    errors.title = "Le titre doit contenir entre 3 et 100 caractères.";
  }

  const description = form.description.trim();
  if (description.length < 10 || description.length > 1000) {
    errors.description =
      "La description doit contenir entre 10 et 1000 caractères.";
  }

  const price = Number(form.price);
  if (!form.price || Number.isNaN(price) || price <= 0) {
    errors.price = "Le prix doit être un nombre supérieur à 0.";
  }

  if (!CATEGORIES.some((c) => c.id === form.category)) {
    errors.category = "Sélectionnez une catégorie.";
  }

  if (!form.size.trim()) {
    errors.size = "La taille est obligatoire.";
  }

  if (!CONDITIONS.some((c) => c.value === form.condition)) {
    errors.condition = "Sélectionnez un état.";
  }

  if (!form.imageUrl.trim()) {
    errors.imageUrl = "L'URL de l'image est obligatoire.";
  } else {
    try {
      new URL(form.imageUrl);
    } catch {
      errors.imageUrl = "L'URL de l'image n'est pas valide.";
    }
  }

  return errors;
}

export default function PublishPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: Omit<FormState, "price"> & { price: number }) =>
      api.post<Article>("/api/articles", payload),
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      navigate(`/articles/${article.id}`);
    },
  });

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    mutation.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      size: form.size.trim(),
      condition: form.condition,
      imageUrl: form.imageUrl.trim(),
    });
  }

  const inputClass =
    "w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold">Publier une annonce</h1>

      <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            className={inputClass}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            className={inputClass}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Prix (€)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min={0}
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              className={inputClass}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="size" className="mb-1 block text-sm font-medium">
              Taille
            </label>
            <input
              id="size"
              type="text"
              placeholder="XS, M, 42..."
              value={form.size}
              onChange={(e) => setField("size", e.target.value)}
              className={inputClass}
            />
            {errors.size && (
              <p className="mt-1 text-sm text-red-600">{errors.size}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium"
            >
              Catégorie
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              className={inputClass}
            >
              <option value="">— Choisir —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="condition"
              className="mb-1 block text-sm font-medium"
            >
              État
            </label>
            <select
              id="condition"
              value={form.condition}
              onChange={(e) => setField("condition", e.target.value)}
              className={inputClass}
            >
              <option value="">— Choisir —</option>
              {CONDITIONS.map((cond) => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </select>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium">
            URL de l'image
          </label>
          <input
            id="imageUrl"
            type="url"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => setField("imageUrl", e.target.value)}
            className={inputClass}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
          )}
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600">
            Erreur lors de la publication : {mutation.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-full bg-teal-600 px-6 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Publication..." : "Publier"}
        </button>
      </form>
    </main>
  );
}
