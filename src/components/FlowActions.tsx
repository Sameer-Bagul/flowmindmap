
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
    <div className="flex flex-col gap-2 bg-background/40 p-4 rounded-xl backdrop-blur-md border shadow-lg">
      <h3 className="font-semibold text-foreground/80 mb-2">Actions</h3>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="gap-2 justify-start w-full h-10">
            <Eraser className="h-4 w-4" />
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
