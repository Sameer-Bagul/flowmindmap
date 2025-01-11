import { Card } from "@/components/ui/card";

const shortcuts = [
  { key: "Ctrl + Z", description: "Undo last action" },
  { key: "Ctrl + Y", description: "Redo last action" },
  { key: "Ctrl + S", description: "Save flow" },
  { key: "Ctrl + P", description: "Download as PDF" },
  { key: "H", description: "Toggle handle visibility" },
  { key: "Delete", description: "Delete selected node/edge" },
];

const Shortcuts = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Keyboard Shortcuts</h1>
      <div className="grid gap-4">
        {shortcuts.map((shortcut) => (
          <Card key={shortcut.key} className="p-4 flex justify-between items-center">
            <span className="font-medium">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-muted rounded">{shortcut.key}</kbd>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;