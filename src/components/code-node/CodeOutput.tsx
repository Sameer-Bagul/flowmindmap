import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeOutputProps {
  isOpen: boolean;
  onClose: () => void;
  output: string;
}

export const CodeOutput = ({ isOpen, onClose, output }: CodeOutputProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle>Code Output</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border border-zinc-700 p-4">
          <pre className="font-mono text-sm">{output}</pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};