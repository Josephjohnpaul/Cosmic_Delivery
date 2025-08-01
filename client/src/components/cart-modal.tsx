import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/lib/types";
import { Rocket, Trash2 } from "lucide-react";

interface CartModalProps {
  cartItems: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartModal({ cartItems, isOpen, onClose, onRemoveItem, onCheckout }: CartModalProps) {
  const calculateTotal = () => {
    // Simplified total calculation for demo
    return cartItems.length * 1234567;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto cosmic-bg cosmic-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold space-font">Cosmic Cart</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Your cosmic cart is empty!</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 cosmic-bg rounded-lg cosmic-border">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                    <div className="text-2xl">
                      {item.product.image}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <p className="text-sm text-slate-400">{item.product.planet}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.product.isExclusive === 1 ? 'text-green-400' : 'text-orange-500'}`}>
                      {item.product.price}
                    </p>
                    <Button
                      onClick={() => onRemoveItem(item.productId)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-orange-500">₹{calculateTotal().toLocaleString('en-IN')}</span>
              </div>
              
              <Button
                onClick={onCheckout}
                className="w-full solar-gradient hover:opacity-90 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Launch Order to Space!
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
