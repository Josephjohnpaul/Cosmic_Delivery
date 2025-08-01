import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import { useToast } from "@/hooks/use-toast";

interface ExclusiveProps {
  sessionId: string;
}

export default function Exclusive({ sessionId }: ExclusiveProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exclusiveProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/exclusive'],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest('POST', '/api/cart', {
        productId,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (_, productId) => {
      const product = exclusiveProducts.find(p => p.id === productId);
      toast({
        title: "Added to cart!",
        description: `${product?.name} has been added to your cosmic cart.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCartMutation.mutate(product.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⭐</div>
          <p className="text-slate-300">Loading exclusive cosmic items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4 space-font">Planet Exclusive Items</h2>
        <p className="text-slate-300 text-center mb-12 max-w-2xl mx-auto">
          Discover unique items found only on specific planets! These rare finds are priced reasonably compared to our Earth imports.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exclusiveProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
