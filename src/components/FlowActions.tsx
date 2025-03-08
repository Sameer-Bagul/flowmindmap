
import { Button } from "@/components/ui/button";
import { Trash2, Eraser, Undo, Redo } from "lucide-react";
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
  const { setElements, undo, redo, canUndo, canRedo } = useFlowStore();

  const clearFlow = () => {
    setNodes([]);
    setEdges([]);
    setElements([], []);
    toast.success('Flow cleared successfully');
  };

  const handleUndo = () => {
    const { nodes, edges } = undo();
    setNodes(nodes);
    setEdges(edges);
    toast.info('Undo successful');
  };

  const handleRedo = () => {
    const { nodes, edges } = redo();
    setNodes(nodes);
    setEdges(edges);
    toast.info('Redo successful');
  };

  return (
    <div className="flex flex-col gap-2 bg-background/40 p-4 rounded-xl backdrop-blur-md border shadow-lg">
      <h3 className="font-semibold text-foreground/80 mb-2">Actions</h3>
      <div className="flex gap-2 mb-2">
        <Button 
          onClick={handleUndo} 
          variant="outline" 
          className="flex-1 h-10 gap-2 justify-center items-center"
          disabled={!canUndo}
        >
          <Undo className="h-4 w-4" />
          Undo
        </Button>
        <Button 
          onClick={handleRedo} 
          variant="outline" 
          className="flex-1 h-10 gap-2 justify-center items-center"
          disabled={!canRedo}
        >
          <Redo className="h-4 w-4" />
          Redo
        </Button>
      </div>
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
