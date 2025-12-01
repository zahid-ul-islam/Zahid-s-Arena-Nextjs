"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IProduct } from "@/models/Product";

const LEAGUES_AND_TEAMS = {
  "Premier League": [
    "Arsenal",
    "Aston Villa",
    "Bournemouth",
    "Brentford",
    "Brighton & Hove Albion",
    "Chelsea",
    "Crystal Palace",
    "Everton",
    "Fulham",
    "Ipswich Town",
    "Leicester City",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Newcastle United",
    "Nottingham Forest",
    "Southampton",
    "Tottenham Hotspur",
    "West Ham United",
    "Wolverhampton Wanderers",
  ],
  "La Liga": [
    "Athletic Club",
    "Atletico Madrid",
    "Barcelona",
    "Girona",
    "Real Betis",
    "Real Madrid",
    "Real Sociedad",
    "Sevilla",
    "Valencia",
    "Villarreal",
  ],
  "Serie A": [
    "AC Milan",
    "AS Roma",
    "Atalanta",
    "Bologna",
    "Fiorentina",
    "Inter Milan",
    "Juventus",
    "Lazio",
    "Napoli",
  ],
  Bundesliga: [
    "Bayer Leverkusen",
    "Bayern Munich",
    "Borussia Dortmund",
    "Eintracht Frankfurt",
    "RB Leipzig",
    "Stuttgart",
  ],
  "Ligue 1": ["AS Monaco", "Lille", "Lyon", "Marseille", "PSG"],
  International: [
    "Argentina",
    "Belgium",
    "Brazil",
    "Croatia",
    "England",
    "Germany",
    "Italy",
    "Netherlands",
    "Portugal",
    "Spain",
    "France",
  ],
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
  image: z.string().min(1, "Image is required"),
  productType: z.enum(["kit", "football", "shoes", "equipment"]),
  category: z.string().optional(),
  team: z.string().optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof schema>;

interface ProductFormProps {
  initialData?: IProduct & { _id: string };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: initialData
      ? {
          ...initialData,
          category: initialData.category || undefined,
          team: initialData.team || undefined,
          brand: initialData.brand || undefined,
          size: initialData.size || undefined,
          color: initialData.color || undefined,
        }
      : {
          productType: "kit",
          isFeatured: false,
          isNewArrival: false,
        },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string>(initialData?.image || "");
  const router = useRouter();

  const productType = watch("productType");

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Failed to save product");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Product Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Type</label>
        <select
          {...register("productType")}
          className="w-full p-2 rounded border border-border bg-background"
        >
          <option value="kit">Football Kit</option>
          <option value="football">Football</option>
          <option value="shoes">Shoes</option>
          <option value="equipment">Equipment</option>
        </select>
        {errors.productType && (
          <p className="text-red-500 text-xs mt-1">
            {errors.productType.message}
          </p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          {...register("name")}
          className="w-full p-2 rounded border border-border bg-background"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full p-2 rounded border border-border bg-background"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full p-2 rounded border border-border bg-background"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            {...register("stock")}
            className="w-full p-2 rounded border border-border bg-background"
          />
          {errors.stock && (
            <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              setPreview(base64);
              setValue("image", base64);
            };
            reader.readAsDataURL(file);
          }}
          className="w-full p-2 rounded border border-border bg-background"
        />
        <input type="hidden" {...register("image")} />
        {preview && (
          <div className="relative mt-2 h-32 w-32">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="rounded border object-cover"
            />
          </div>
        )}
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
        )}
      </div>

      {/* Conditional Fields for Kit */}
      {productType === "kit" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Category (League)
            </label>
            <select
              {...register("category")}
              onChange={(e) => {
                setValue("category", e.target.value);
                setValue("team", ""); // Reset team when league changes
              }}
              className="w-full p-2 rounded border border-border bg-background"
            >
              <option value="">Select League</option>
              {Object.keys(LEAGUES_AND_TEAMS).map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Team</label>
            <select
              {...register("team")}
              className="w-full p-2 rounded border border-border bg-background"
              disabled={!watch("category")}
            >
              <option value="">Select Team</option>
              {watch("category") &&
                LEAGUES_AND_TEAMS[
                  watch("category") as keyof typeof LEAGUES_AND_TEAMS
                ]?.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
            </select>
            {errors.team && (
              <p className="text-red-500 text-xs mt-1">{errors.team.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Conditional Fields for Other Products */}
      {productType !== "kit" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              {...register("brand")}
              placeholder="e.g., Nike, Adidas, Puma"
              className="w-full p-2 rounded border border-border bg-background"
            />
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">
                {errors.brand.message}
              </p>
            )}
          </div>

          {productType === "shoes" && (
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <input
                {...register("size")}
                placeholder="e.g., 42, 9.5"
                className="w-full p-2 rounded border border-border bg-background"
              />
              {errors.size && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.size.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              {...register("color")}
              placeholder="e.g., White, Black, Red"
              className="w-full p-2 rounded border border-border bg-background"
            />
            {errors.color && (
              <p className="text-red-500 text-xs mt-1">
                {errors.color.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Featured & New Arrival */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("isFeatured")}
          id="isFeatured"
          className="w-4 h-4"
        />
        <label htmlFor="isFeatured" className="text-sm font-medium">
          Featured Product
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("isNewArrival")}
          id="isNewArrival"
          className="w-4 h-4"
        />
        <label htmlFor="isNewArrival" className="text-sm font-medium">
          New Arrival
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
