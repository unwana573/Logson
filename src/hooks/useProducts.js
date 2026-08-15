import { useEffect, useRef, useState } from "react";
import { productService } from "../services/productService";

/**
 * Fetches products from the backend whenever `search` or `categoryId`
 * change. Debounces search input so we're not firing a request on every
 * keystroke -- this is what makes the search bar feel "functional" without
 * hammering the API.
 */
export function useProducts({ search, categoryId, debounceMs = 300 } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setLoading(true);
      setError(null);
      productService
        .list({ search, categoryId })
        .then(setProducts)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, debounceMs);

    return () => clearTimeout(timeoutRef.current);
  }, [search, categoryId, debounceMs]);

  return { products, loading, error };
}
