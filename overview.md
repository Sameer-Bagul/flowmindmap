# Project Overview

This is a React application called "flowmindmap" that allows users to create and manage mind maps or flowcharts using a drag-and-drop interface. The project uses React with TypeScript, Vite as the build tool, and several key libraries:

- **@xyflow/react** - For creating interactive node-based diagrams
- **shadcn/ui** - For UI components with a consistent design system 
- **TipTap** - For rich text editing within nodes
- **Zustand** - For state management
- **React Router** - For navigation between pages

## Core Structure and Components

### Main Application Structure

- **App.tsx** - The entry point that sets up routing, theme provider, and global state

#### Main Pages

- **Index.tsx** - The main flowchart editor page
- **Roadmaps.tsx** - A page to manage collections of flowcharts
- **Shortcuts.tsx** - A page showing keyboard shortcuts

### Flow Editor Components

The core functionality revolves around the flow editor which allows users to:

- Create different types of nodes (Chapter, Main Topic, Sub Topic)
- Connect nodes with customizable edges
- Edit node content with a rich text editor
- Style nodes and connections
- Save, load, and export flows

#### Key Components

- **TextNode.tsx** - The main node component that renders different types of nodes
- **NodeContent.tsx** - Handles the content editing within nodes
- **NoteEditor.tsx** - A rich text editor using TipTap for node content
- **EdgeControls.tsx** - UI for customizing connections between nodes
- **FlowToolbar.tsx** - Tools for adding new nodes to the canvas
- **FlowControls.tsx** - Controls for saving, loading, and exporting flows
- **FlowActions.tsx** - Actions like clearing the canvas

## Key Features

- **Drag and Drop Interface** - Users can drag node types from the toolbar onto the canvas
- **Rich Text Editing** - Nodes support formatted text with headings, lists, code blocks, etc.
- **Node Customization** - Users can change node colors, borders, and other styles
- **Edge Customization** - Connections between nodes can be styled with different line types, colors, and animations
- **Media Support** - Nodes can contain images, videos, and YouTube embeds
- **Save and Load** - Flows can be saved to localStorage or downloaded as JSON
- **Responsive Design** - Works on different screen sizes

## Code Organization

The code is organized into several directories:

- **/src/components** - UI components
- **/ui** - shadcn/ui components
- **/nodes** - Node-related components
- **/editor** - Text editor components
- **/src/hooks** - Custom React hooks
- **/src/lib** - Utility functions
- **/src/pages** - Main application pages
- **/src/store** - State management
- **/src/types** - TypeScript type definitions

## Workflow

When a user interacts with the application:

1. They can create nodes by dragging from the toolbar to the canvas.
2. Nodes can be connected by dragging from one handle to another.
3. Node content can be edited with the rich text editor.
4. Connections can be styled using the edge controls.
5. The entire flow can be saved, exported, or cleared.

This is a comprehensive mind mapping tool that allows for creating complex, interactive diagrams with rich content and styling options.

---
# Files and their purpose, Functions Overview

## src/main.tsx
- **Function Name**: `main`
  - **Description**: Entry point of the application.
  - **Parameters**: None.
  - **Returns**: React element.

## src/App.tsx
- **Function Name**: `App`
  - **Description**: Main application component.
  - **Parameters**: None.
  - **Returns**: JSX element.

## src/types/node.ts
- **Function Name**: `NodeType`
  - **Description**: Type definition for nodes.
  - **Parameters**: None.
  - **Returns**: Type definition.

## src/store/settingsStore.ts
- **Function Name**: `useSettings`
  - **Description**: Custom hook for managing settings.
  - **Parameters**: None.
  - **Returns**: Settings state and updater function.

## src/store/flowStore.ts
- **Function Name**: `useFlow`
  - **Description**: Custom hook for managing flow state.
  - **Parameters**: None.
  - **Returns**: Flow state and updater function.

## src/pages/Shortcuts.tsx
- **Function Name**: `Shortcuts`
  - **Description**: Component for displaying shortcuts.
  - **Parameters**: None.
  - **Returns**: JSX element.

## src/pages/Roadmaps.tsx
- **Function Name**: `Roadmaps`
  - **Description**: Component for displaying roadmaps.
  - **Parameters**: None.
  - **Returns**: JSX element.

## src/pages/Index.tsx
- **Function Name**: `Index`
  - **Description**: Main index page component.
  - **Parameters**: None.
  - **Returns**: JSX element.

## src/lib/utils.ts
- **Function Name**: `utilityFunction`
  - **Description**: A utility function for common tasks.
  - **Parameters**: Various.
  - **Returns**: Result of the utility operation.

## src/hooks/use-toast.ts
- **Function Name**: `useToast`
  - **Description**: Custom hook for managing toast notifications.
  - **Parameters**: None.
  - **Returns**: Toast state and functions to show/hide toasts.


  # Components Overview

## src/components/Button.tsx
- **Function Name**: `Button`
  - **Description**: Renders a button element.
  - **Parameters**: `props` (includes `label`, `onClick`, etc.)
  - **Returns**: JSX element.

## src/components/Modal.tsx
- **Function Name**: `Modal`
  - **Description**: Renders a modal dialog.
  - **Parameters**: `props` (includes `isOpen`, `onClose`, etc.)
  - **Returns**: JSX element.

## src/components/Card.tsx
- **Function Name**: `Card`
  - **Description**: Renders a card component.
  - **Parameters**: `props` (includes `title`, `content`, etc.)
  - **Returns**: JSX element.

## src/components/Header.tsx
- **Function Name**: `Header`
  - **Description**: Renders the header of the application.
  - **Parameters**: None.
  - **Returns**: JSX element.

## src/components/Footer.tsx
- **Function Name**: `Footer`
  - **Description**: Renders the footer of the application.
  - **Parameters**: None.
  - **Returns**: JSX element.