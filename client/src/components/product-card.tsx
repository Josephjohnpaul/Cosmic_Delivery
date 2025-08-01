import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import { Info, ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const isExclusive = product.isExclusive === 1;

  return (
    <Card className="group cosmic-bg cosmic-border transition-all duration-300 cosmic-hover">
      <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center h-48">
        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </div>
        {isExclusive && (
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
            EXCLUSIVE
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className={`text-2xl font-bold ${isExclusive ? 'text-green-400' : 'text-orange-500'}`}>
            {product.price}
          </span>
          <Badge variant="secondary" className="cosmic-bg">
            {product.planet}
          </Badge>
        </div>
        <div className="space-y-2">
          <Button
            onClick={() => onViewDetails(product)}
            variant="outline"
            className="w-full cosmic-bg cosmic-border hover:bg-slate-600"
          >
            <Info className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button
            onClick={() => onAddToCart(product)}
            className={`w-full transition-all duration-300 ${
              isExclusive 
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-500/80 hover:to-green-600/80' 
                : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-500/80 hover:to-purple-600/80'
            }`}
          >
            {isExclusive ? <Star className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
