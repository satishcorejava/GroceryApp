import { useState, useEffect } from "react";
import { productsApi } from "../services/api";
import { Product } from "../data/products";

interface UseProductsOptions {
  category?: string;
  subcategory?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useProducts(options?: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productsApi.getAll({
          page: options?.page || 1,
          limit: options?.limit || 20,
          category: options?.category,
          subcategory: options?.subcategory,
          search: options?.search,
        });

        setProducts(response.data);
        setTotal(response.total);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load products";
        setError(errorMessage);
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [options?.category, options?.subcategory, options?.search, options?.page, options?.limit]);

  return {
    products,
    isLoading,
    error,
    total,
  };
}

export function useProductDetail(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await productsApi.getById(productId);
        setProduct(data);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load product";
        setError(errorMessage);
        console.error("Failed to load product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    isLoading,
    error,
  };
}
