import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ComparisonResult } from "@/lib/types";
import { Loader2, AlertTriangle, Search, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Compare() {
  const [searchQuery, setSearchQuery] = useState("");
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get session ID
  const sessionId = localStorage.getItem('sessionId') || `session-${Date.now()}-${Math.random()}`;
  if (!localStorage.getItem('sessionId')) {
    localStorage.setItem('sessionId', sessionId);
  }

  const compareMutation = useMutation({
    mutationFn: async (item: string) => {
      const response = await apiRequest('POST', '/api/compare', { item });
      return response.json();
    },
    onSuccess: (data: ComparisonResult) => {
      setComparisonResult(data);
    },
    onError: () => {
      toast({
        title: "Comparison failed",
        description: "Failed to generate comparison prices. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ item, planet, price }: { item: string, planet: string, price: string }) => {
      // Create a virtual product for the searched item
      const virtualProduct = {
        id: `search-${Date.now()}-${Math.random()}`,
        name: item,
        price: price,
        image: planet === "Moon" ? "🌙" : 
              planet === "Space Station" ? "🛰️" :
              planet === "Mars" ? "🔴" :
              planet === "Venus" ? "🟡" :
              planet === "Mercury" ? "🟤" :
              planet === "Jupiter" ? "🟠" :
              planet === "Saturn" ? "🪐" :
              planet === "Uranus" ? "🩵" :
              planet === "Neptune" ? "🔵" :
              planet === "Pluto" ? "🟣" : "🌍",
        description: `Custom ${item} delivery to ${planet}`,
        planet: planet,
        breakdown: {
          "Base Item Price": `₹${Math.floor(parseInt(price.replace(/[₹,]/g, '')) * 0.1).toLocaleString('en-IN')}`,
          "Cosmic Delivery": `₹${Math.floor(parseInt(price.replace(/[₹,]/g, '')) * 0.9).toLocaleString('en-IN')}`
        },
        isExclusive: 0
      };

      const response = await apiRequest('POST', '/api/cart', { 
        productId: virtualProduct.id, 
        sessionId,
        virtualProduct
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to cart!",
        description: "Item added to your cosmic cart.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
    onError: () => {
      toast({
        title: "Cart error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCompare = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "No item entered",
        description: "Please enter an item to compare!",
        variant: "destructive",
      });
      return;
    }
    compareMutation.mutate(searchQuery.trim());
  };

  return (
    <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4 space-font">Interplanetary Price Comparison</h2>
        <p className="text-slate-300 text-center mb-12 max-w-2xl mx-auto">
          Compare the astronomical costs of delivering items across different planets!
        </p>
        
        <Card className="cosmic-bg cosmic-border mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Input
                placeholder="Enter any Earth item to compare prices across planets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cosmic-bg cosmic-border focus:border-cyan-400"
                onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
              />
              
              <Button
                onClick={handleCompare}
                disabled={compareMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-600/80 hover:to-cyan-500/80 text-white font-semibold py-3 transition-all duration-300"
              >
                {compareMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Compare Prices Across Planets
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {comparisonResult && (
          <div>
            <h4 className="text-xl font-semibold mb-6 text-cyan-400 capitalize">
              Price Comparison: {comparisonResult.item}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(comparisonResult.prices).map(([planet, price]) => (
                <Card key={planet} className="cosmic-bg cosmic-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-lg font-semibold capitalize">{planet}</h5>
                      <div className="text-2xl">
                        {planet === "Moon" ? "🌙" : 
                         planet === "Space Station" ? "🛰️" :
                         planet === "Mars" ? "🔴" :
                         planet === "Venus" ? "🟡" :
                         planet === "Mercury" ? "🟤" :
                         planet === "Jupiter" ? "🟠" :
                         planet === "Saturn" ? "🪐" :
                         planet === "Uranus" ? "🩵" :
                         planet === "Neptune" ? "🔵" :
                         planet === "Pluto" ? "🟣" : "🌍"}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-orange-500 mb-2">{price}</p>
                    {planet === "Space Station" && (
                      <p className="text-xs text-green-400 mb-2">⚡ Special Space Station Discount!</p>
                    )}
                    <p className="text-sm text-slate-400 mb-3">Including all cosmic fees</p>
                    <Button
                      onClick={() => addToCartMutation.mutate({ 
                        item: comparisonResult.item, 
                        planet, 
                        price 
                      })}
                      disabled={addToCartMutation.isPending}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-600/80 hover:to-blue-500/80 text-white text-sm"
                      size="sm"
                    >
                      {addToCartMutation.isPending ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-3 h-3 mr-1" />
                      )}
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-yellow-600/20 border border-yellow-600/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-200">
                    Prices subject to change based on solar wind conditions, meteor shower intensity, and alien diplomatic relations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
