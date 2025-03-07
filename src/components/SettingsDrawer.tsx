
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSettingsStore } from '@/store/settingsStore';
import { Separator } from "@/components/ui/separator";
import { Settings, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { AI_PROVIDERS } from "@/constants/aiProviders";

export function SettingsDrawer() {
  const {
    aiProvider,
    serverUrl,
    selectedModel,
    apiKey,
    setAIProvider,
    setServerUrl,
    setSelectedModel,
    setApiKey
  } = useSettingsStore();

  const handleDeleteSelectedNode = () => {
    toast.error('Please navigate to the editor to delete nodes');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" title="Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-background border-t border-border">
        <div className="max-w-4xl mx-auto w-full p-6">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </DrawerTitle>
            <DrawerDescription>
              Configure your application preferences and AI integration
            </DrawerDescription>
          </DrawerHeader>

          <div className="py-6 space-y-6">
            <Card className="p-6 border-primary/10 bg-card/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 text-primary">Theme</h2>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Dark/Light Mode</Label>
                <ThemeToggle />
              </div>
            </Card>

            <Card className="p-6 border-primary/10 bg-card/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 text-primary">Application Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">About</h3>
                  <p className="text-muted-foreground">
                    Mindmap Flow is a powerful tool for creating interactive mindmaps and roadmaps.
                    Build your ideas visually and share them with others.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Version</h3>
                  <p className="text-muted-foreground">1.0.0</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/10 bg-card/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 text-primary">Node Management</h2>
              <div className="space-y-4">
                <div>
                  <Button 
                    variant="destructive" 
                    className="flex items-center gap-2"
                    onClick={handleDeleteSelectedNode}
                  >
                    <Trash2 className="h-4 w-4" /> Delete Selected Node
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/10 bg-card/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 text-primary">AI Integration</h2>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-provider">AI Provider</Label>
                    <Select 
                      value={aiProvider} 
                      onValueChange={(value) => setAIProvider(value as AIProvider)}
                    >
                      <SelectTrigger id="ai-provider">
                        <SelectValue placeholder="Select AI Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(AI_PROVIDERS).map(([id, provider]) => (
                          <SelectItem key={id} value={id}>
                            {provider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="server-url">Server URL</Label>
                    <Input 
                      id="server-url" 
                      placeholder="http://localhost:1234" 
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select 
                      value={selectedModel} 
                      onValueChange={setSelectedModel}
                    >
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_PROVIDERS[aiProvider]?.modelOptions.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      type="password"
                      placeholder="Enter your API key" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for some AI providers like Gemini and Grok
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <DrawerFooter className="px-0 pt-2">
            <DrawerClose asChild>
              <Button onClick={() => toast.success('Settings saved successfully')}>
                Save Settings
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
