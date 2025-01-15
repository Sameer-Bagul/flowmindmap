import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

const shortcuts = [
  { key: "Ctrl + Z", description: "Undo last action" },
  { key: "Ctrl + Y", description: "Redo last action" },
  { key: "Ctrl + S", description: "Save flow" },
  { key: "Delete", description: "Delete selected node/edge" },
  { key: "Drag", description: "Move nodes around" },
  { key: "Click + Drag", description: "Select multiple nodes" },
  { key: "Double Click", description: "Edit node title" },
];

const Shortcuts = () => {
  const navigate = useNavigate();
  const { backgroundColor } = useSettingsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div 
      className="p-8 max-w-4xl mx-auto min-h-screen bg-zinc-900/30 backdrop-blur-md"
      style={{ backgroundColor }}
    >
      <div className="mb-6 flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white/80">Keyboard Shortcuts</h1>
      </div>
      <div className="grid gap-4">
        {shortcuts.map((shortcut) => (
          <Card key={shortcut.key} className="p-4 flex justify-between items-center bg-zinc-800/40 backdrop-blur-md border border-zinc-700/20 hover:bg-zinc-800/50 transition-colors">
            <span className="font-medium text-white/70">{shortcut.description}</span>
            <kbd className="px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-lg border border-zinc-700/20 font-mono text-sm text-white/70">
              {shortcut.key}
            </kbd>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;