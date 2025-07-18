import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface JsonViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  title?: string;
}

export function JsonViewer({ open, onOpenChange, data, title = "API Response" }: JsonViewerProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast({
        title: "Copied to clipboard",
        description: "JSON response has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center space-x-1"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto">
          <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-x-auto">
            <code className="text-gray-700">
              {JSON.stringify(data, null, 2)}
            </code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
