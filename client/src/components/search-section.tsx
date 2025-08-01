import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SearchResult } from "@/lib/types";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchSectionProps {
  onSunSelected: () => void;
}

export default function SearchSection({ onSunSelected }: SearchSectionProps) {
  const [query, setQuery] = useState("");
  const [planet, setPlanet] = useState("");
  const [agency, setAgency] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async (data: { query: string; planet: string; agency: string }) => {
      const response = await apiRequest('POST', '/api/search', data);
      return response.json();
    },
    onSuccess: (data: SearchResult) => {
      if (data.isSun) {
        onSunSelected();
        return;
      }
      setSearchResult(data);
    },
    onError: () => {
      toast({
        title: "Search failed",
        description: "Failed to get cosmic pricing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!query || !planet || !agency) {
      toast({
        title: "Missing information",
        description: "Please fill all search fields!",
        variant: "destructive",
      });
      return;
    }

    if (planet === "sun") {
      onSunSelected();
      return;
    }

    searchMutation.mutate({ query, planet, agency });
  };

  const handlePlanetChange = (value: string) => {
    setPlanet(value);
    if (value === "sun") {
      onSunSelected();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <Card className="cosmic-bg cosmic-border">
        <CardHeader>
          <CardTitle className="text-2xl space-font text-center">AI-Powered Cosmic Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search for any Earth item..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="cosmic-bg cosmic-border focus:border-cyan-400"
            />
            
            <Select value={planet} onValueChange={handlePlanetChange}>
              <SelectTrigger className="cosmic-bg cosmic-border focus:border-cyan-400">
                <SelectValue placeholder="Select Planet" />
              </SelectTrigger>
              <SelectContent className="cosmic-bg cosmic-border">
                <SelectItem value="mars">Mars</SelectItem>
                <SelectItem value="venus">Venus</SelectItem>
                <SelectItem value="jupiter">Jupiter</SelectItem>
                <SelectItem value="saturn">Saturn</SelectItem>
                <SelectItem value="neptune">Neptune</SelectItem>
                <SelectItem value="sun">The Sun ☀️</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={agency} onValueChange={setAgency}>
              <SelectTrigger className="cosmic-bg cosmic-border focus:border-cyan-400">
                <SelectValue placeholder="Select Agency" />
              </SelectTrigger>
              <SelectContent className="cosmic-bg cosmic-border">
                <SelectItem value="express">Cosmic Express</SelectItem>
                <SelectItem value="premium">Galactic Premium</SelectItem>
                <SelectItem value="budget">Space Budget</SelectItem>
                <SelectItem value="luxury">Luxury Interstellar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={searchMutation.isPending}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-500/80 hover:to-purple-600/80 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
          >
            {searchMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Get Cosmic Price
          </Button>
        </CardContent>
      </Card>

      {searchResult && (
        <Card className="mt-6 cosmic-bg cosmic-border">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400">Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="cosmic-bg rounded-lg p-4 mb-4 cosmic-border">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-lg font-semibold">{searchResult.item}</h5>
                <span className="text-2xl font-bold text-orange-500">{searchResult.price}</span>
              </div>
              <p className="text-sm text-slate-400">
                Delivery to {searchResult.planet} via {searchResult.agency}
              </p>
            </div>
            
            <div className="cosmic-bg rounded-lg p-4 cosmic-border">
              <h6 className="font-semibold mb-3 text-cyan-400">Cost Breakdown</h6>
              <div className="space-y-2">
                {Object.entries(searchResult.breakdown).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1">
                    <span className="text-slate-300">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
