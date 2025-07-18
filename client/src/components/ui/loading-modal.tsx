import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Brain } from "lucide-react";

interface LoadingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoadingModal({ open, onOpenChange }: LoadingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <div className="flex flex-col items-center space-y-4 py-6">
          <div className="relative">
            <Brain className="h-12 w-12 text-primary" />
            <Loader2 className="absolute -top-1 -right-1 h-6 w-6 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Generating Response</h3>
            <p className="text-sm text-gray-600 mt-2">
              Please wait while we process your prompt...
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
