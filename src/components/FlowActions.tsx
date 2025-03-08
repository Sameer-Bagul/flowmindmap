import { Button } from "@/components/ui/button";
import { Trash2, Eraser } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useFlowStore } from "@/store/flowStore";

export const FlowActions = () => {
  const { setNodes, setEdges } = useReactFlow();
  const { setElements } = useFlowStore();

  const clearFlow = () => {
    setNodes([]);
    setEdges([]);
    setElements([], []);
    toast.success('Flow cleared successfully');
  };

  return (
    <div className="flex gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="lg" className="gap-2">
            <Eraser className="h-5 w-5" />
            Clear Canvas
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear entire flow?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove all nodes and connections from your flow. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearFlow}>Clear All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};