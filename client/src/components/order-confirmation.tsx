import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface OrderConfirmationProps {
  isOpen: boolean;
  onBackHome: () => void;
}

export default function OrderConfirmation({ isOpen, onBackHome }: OrderConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg cosmic-bg cosmic-border text-center">
        <div className="text-6xl mb-6 animate-float">🚀</div>
        <h3 className="text-2xl font-bold mb-4 text-cyan-400 space-font">
          Order Launched Successfully!
        </h3>
        <p className="text-slate-300 mb-6">
          Your items are now on their ridiculously expensive journey through space! 
          Expect delivery in 2-847 Earth days depending on planetary alignment.
        </p>
        <div className="cosmic-bg rounded-lg p-4 mb-6 cosmic-border">
          <p className="text-sm text-slate-400">
            Order ID: <span className="text-cyan-400 font-mono">#COSMIC-2024-XYZ</span>
          </p>
          <p className="text-sm text-slate-400">
            Estimated Total Travel Distance: <span className="text-white">2.4 billion km</span>
          </p>
        </div>
        <Button
          onClick={onBackHome}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-500/80 hover:to-purple-600/80 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Homepage
        </Button>
      </DialogContent>
    </Dialog>
  );
}
