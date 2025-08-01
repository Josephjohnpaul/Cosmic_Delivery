import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SunEasterEggProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SunEasterEgg({ isOpen, onClose }: SunEasterEggProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-yellow-600 to-orange-600 border border-yellow-400/50 text-center">
        <div className="text-6xl mb-6 animate-glow">☀️</div>
        <h3 className="text-2xl font-bold mb-4 text-white space-font">INCREDIBLE!</h3>
        <p className="text-yellow-100 mb-6">
          You're the first person EVER to survive selecting the Sun as a delivery destination! 
          Our entire solar delivery team has been... well... incinerated.
        </p>
        <div className="bg-orange-700/50 rounded-lg p-4 mb-6">
          <p className="text-yellow-100 font-semibold">🔥 EXCLUSIVE OFFER 🔥</p>
          <p className="text-sm text-yellow-200">
            Join Cosmic Delivery as our new Solar Operations Manager! Requirements: Must be 
            fireproof and have a melting point above 5,778K.
          </p>
        </div>
        <Button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          🔥 I'll Consider It!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
