import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Folder, Map, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface RoadmapFolder {
  id: string;
  name: string;
  roadmaps: Roadmap[];
}

interface Roadmap {
  id: string;
  name: string;
  lastModified: Date;
}

const Roadmaps = () => {
  const [folders, setFolders] = useState<RoadmapFolder[]>([
    {
      id: '1',
      name: 'Development',
      roadmaps: [
        { id: '1', name: 'Frontend Development', lastModified: new Date() },
        { id: '2', name: 'Backend Development', lastModified: new Date() },
      ],
    },
    {
      id: '2',
      name: 'Design',
      roadmaps: [
        { id: '3', name: 'UI/UX Design', lastModified: new Date() },
      ],
    },
  ]);

  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newRoadmapName, setNewRoadmapName] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    setFolders([
      ...folders,
      {
        id: Date.now().toString(),
        name: newFolderName,
        roadmaps: [],
      },
    ]);
    setNewFolderName('');
    toast.success('Folder created successfully');
  };

  const handleCreateRoadmap = (folderId: string) => {
    if (!newRoadmapName.trim()) {
      toast.error('Please enter a roadmap name');
      return;
    }

    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          roadmaps: [
            ...folder.roadmaps,
            {
              id: Date.now().toString(),
              name: newRoadmapName,
              lastModified: new Date(),
            },
          ],
        };
      }
      return folder;
    }));
    setNewRoadmapName('');
    toast.success('Roadmap created successfully');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Roadmaps</h1>
        <Link to="/">
          <Button variant="outline">Back to Editor</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="New Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button onClick={handleCreateFolder}>
              <Plus className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
          </div>
        </Card>

        {folders.map((folder) => (
          <Card key={folder.id} className="p-4">
            <div className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  <span className="font-medium">{folder.name}</span>
                  <span className="text-muted-foreground">
                    ({folder.roadmaps.length} roadmaps)
                  </span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    selectedFolder === folder.id ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {selectedFolder === folder.id && (
                <div className="pl-7 space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder="New Roadmap Name"
                      value={newRoadmapName}
                      onChange={(e) => setNewRoadmapName(e.target.value)}
                    />
                    <Button onClick={() => handleCreateRoadmap(folder.id)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Roadmap
                    </Button>
                  </div>

                  {folder.roadmaps.map((roadmap) => (
                    <Link
                      key={roadmap.id}
                      to={`/?roadmap=${roadmap.id}`}
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                    >
                      <Map className="w-4 h-4" />
                      <span>{roadmap.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {new Date(roadmap.lastModified).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;