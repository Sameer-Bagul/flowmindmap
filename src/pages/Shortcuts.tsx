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
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-background/30 backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-6 text-foreground/80">Keyboard Shortcuts</h1>
      <div className="grid gap-4">
        {shortcuts.map((shortcut) => (
          <Card key={shortcut.key} className="p-4 flex justify-between items-center bg-white/40 backdrop-blur-md border border-white/20 hover:bg-white/50 transition-colors">
            <span className="font-medium text-foreground/70">{shortcut.description}</span>
            <kbd className="px-3 py-1.5 bg-black/5 backdrop-blur-sm rounded-lg border border-white/20 font-mono text-sm">
              {shortcut.key}
            </kbd>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;