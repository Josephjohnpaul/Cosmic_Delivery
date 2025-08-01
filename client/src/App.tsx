import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import CartModal from "@/components/cart-modal";
import SunEasterEgg from "@/components/sun-easter-egg";
import OrderConfirmation from "@/components/order-confirmation";
import Home from "@/pages/home";
import Exclusive from "@/pages/exclusive";
import Compare from "@/pages/compare";
import NotFound from "@/pages/not-found";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CartItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

function Router() {
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSunEasterEggOpen, setIsSunEasterEggOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const { toast } = useToast();

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ['/api/cart', sessionId],
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest('DELETE', `/api/cart/${sessionId}/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', `/api/cart/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    setIsCartOpen(false);
    setIsOrderConfirmationOpen(true);
    clearCartMutation.mutate();
  };

  const handleBackHome = () => {
    setIsOrderConfirmationOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation 
        onCartClick={() => setIsCartOpen(true)} 
        sessionId={sessionId}
      />
      
      <main className="pt-16">
        <Switch>
          <Route path="/">
            <Home 
              sessionId={sessionId} 
              onSunSelected={() => setIsSunEasterEggOpen(true)}
            />
          </Route>
          <Route path="/exclusive">
            <Exclusive sessionId={sessionId} />
          </Route>
          <Route path="/compare">
            <Compare />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>

      <CartModal
        cartItems={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={(productId) => removeFromCartMutation.mutate(productId)}
        onCheckout={handleCheckout}
      />

      <SunEasterEgg
        isOpen={isSunEasterEggOpen}
        onClose={() => setIsSunEasterEggOpen(false)}
      />

      <OrderConfirmation
        isOpen={isOrderConfirmationOpen}
        onBackHome={handleBackHome}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
