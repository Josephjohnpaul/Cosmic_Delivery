import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { ClientAPI } from "./api";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  try {
    // Handle client-side API requests
    if (url === "/api/cart" && method === "POST") {
      return await ClientAPI.addToCart(data as any);
    } else if (url === "/api/cart/virtual" && method === "POST") {
      const { virtualProduct, sessionId } = data as any;
      return await ClientAPI.addVirtualToCart(virtualProduct, sessionId);
    } else if (url.startsWith("/api/cart/") && method === "DELETE") {
      const pathParts = url.split("/");
      const sessionId = pathParts[3];
      const productId = pathParts[4];
      return await ClientAPI.removeFromCart(sessionId, productId);
    } else if (url === "/api/search" && method === "POST") {
      const { item, planet, agency } = data as any;
      return await ClientAPI.searchProduct(item, planet, agency);
    }
    
    throw new Error(`Unknown API request: ${method} ${url}`);
  } catch (error: any) {
    throw new Error(error?.message || "An unknown error occurred");
  }
}

export const getQueryFn: <T>(options: {
  on401: "returnNull" | "throw";
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    try {
      // Handle client-side API calls
      if (url === "/api/products") {
        return await ClientAPI.getProducts() as T;
      } else if (url === "/api/products/exclusive") {
        return await ClientAPI.getExclusiveProducts() as T;
      } else if (url.startsWith("/api/cart/")) {
        const sessionId = url.split("/api/cart/")[1];
        return await ClientAPI.getCartItems(sessionId) as T;
      }
      
      throw new Error(`Unknown API endpoint: ${url}`);
    } catch (error: any) {
      if (unauthorizedBehavior === "returnNull") {
        return null as T;
      }
      throw new Error(error?.message || "An unknown error occurred");
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
