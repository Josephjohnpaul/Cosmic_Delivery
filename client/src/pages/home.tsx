import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import SearchSection from "@/components/search-section";
import SunEasterEgg from "@/components/sun-easter-egg";
import { useToast } from "@/hooks/use-toast";

interface HomeProps {
  sessionId: string;
  onSunSelected: () => void;
}

export default function Home({ sessionId, onSunSelected }: HomeProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
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
      const product = products.find(p => p.id === productId);
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
          <div className="text-4xl mb-4 animate-spin">🚀</div>
          <p className="text-slate-300">Loading cosmic inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 cosmic-gradient animate-float space-font">
          Welcome to Cosmic Delivery
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
          The galaxy's most ridiculously expensive delivery service! Get Earth items delivered to any planet at astronomically high prices!
        </p>
        
        <SearchSection onSunSelected={onSunSelected} />
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12 space-font">Featured Cosmic Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
