import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/lib/types";
import { ShoppingCart, Star } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  const isExclusive = product.isExclusive === 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto cosmic-bg cosmic-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold space-font">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="w-full h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-8xl">
                {product.image}
              </div>
            </div>
            <p className="text-slate-300">{product.description}</p>
          </div>
          
          <div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-3 text-cyan-400">Cost Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(product.breakdown).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-slate-600 last:border-b-0">
                    <span className="text-slate-300">{key}:</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Price:</span>
                <span className={isExclusive ? 'text-green-400' : 'text-orange-500'}>
                  {product.price}
                </span>
              </div>
            </div>
            
            <Button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className={`w-full transition-all duration-300 transform hover:scale-105 ${
                isExclusive 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-500/80 hover:to-green-600/80' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-500/80 hover:to-purple-600/80'
              }`}
            >
              {isExclusive ? <Star className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
