import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ComparisonResult } from "@/lib/types";
import { Loader2, AlertTriangle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Compare() {
  const [searchQuery, setSearchQuery] = useState("");
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const { toast } = useToast();

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
                    <h5 className="text-lg font-semibold mb-2 capitalize">{planet}</h5>
                    <p className="text-2xl font-bold text-orange-500 mb-2">{price}</p>
                    <p className="text-sm text-slate-400">Including all cosmic fees</p>
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
