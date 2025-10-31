'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from './roadmap.module.css';

// UH Manoa Green Color Palette
const MANOA_COLORS = {
  primary: '#024731', // UH Manoa Dark Green
  secondary: '#0F7B0F', // UH Manoa Green
  light: '#3E8B3E', // Light Green
  accent: '#228B22', // Forest Green
  bg: '#F0F8F0', // Very Light Green
  text: '#1B4332', // Dark Green Text
  white: '#FFFFFF',
  border: '#6B8E23', // Olive Green
};

// Define types for our node data
interface NodeData extends Record<string, unknown> {
  label: string;
  description?: string;
}

// Initial nodes for the roadmap
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: '🎯 Start Your Journey',
      description: 'Define your career goals'
    },
    position: { x: 250, y: 25 },
    className: styles.inputNode,
  },
  {
    id: '2',
    data: { 
      label: '📚 Foundation Courses',
      description: 'Core prerequisites'
    },
    position: { x: 100, y: 150 },
    className: styles.defaultNode,
  },
  {
    id: '3',
    data: { 
      label: '🔬 Specialized Track',
      description: 'Choose your specialization'
    },
    position: { x: 400, y: 150 },
    className: styles.defaultNode,
  },
  {
    id: '4',
    data: { 
      label: '💼 Internship',
      description: 'Gain practical experience'
    },
    position: { x: 150, y: 275 },
    className: styles.lightNode,
  },
  {
    id: '5',
    data: { 
      label: '🚀 Advanced Projects',
      description: 'Build your portfolio'
    },
    position: { x: 350, y: 275 },
    className: styles.lightNode,
  },
  {
    id: '6',
    type: 'output',
    data: { 
      label: '🎓 Career Ready',
      description: 'Achieve your goals'
    },
    position: { x: 250, y: 400 },
    className: styles.outputNode,
  },
];

// Initial edges connecting the nodes
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: { stroke: MANOA_COLORS.primary, strokeWidth: 3 },
    animated: true,
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    style: { stroke: MANOA_COLORS.primary, strokeWidth: 3 },
    animated: true,
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    style: { stroke: MANOA_COLORS.secondary, strokeWidth: 2 },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    style: { stroke: MANOA_COLORS.secondary, strokeWidth: 2 },
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    style: { stroke: MANOA_COLORS.light, strokeWidth: 2 },
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    style: { stroke: MANOA_COLORS.light, strokeWidth: 2 },
  },
];

export default function RoadmapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        style: { stroke: MANOA_COLORS.border, strokeWidth: 2 },
      } as Edge;
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  // Add new node functionality
  const addNewNode = useCallback(() => {
    const newNode: Node = {
      id: `${Date.now()}`,
      data: { 
        label: '✨ New Step',
        description: 'Add your milestone'
      },
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      className: styles.lightNode,
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Node click handler
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Update node data
  const updateNodeData = useCallback((nodeId: string, field: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data as NodeData, [field]: value } }
          : node
      )
    );
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data as NodeData, [field]: value } });
    }
  }, [setNodes, selectedNode]);

  return (
    <div className={`h-screen w-full flex flex-col ${styles.container}`}>
      {/* Header */}
      <div className={`bg-white shadow-md border-b-4 ${styles.header}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${styles.headerTitle}`}>
                🌺 Your Academic Roadmap
              </h1>
              <p className="text-gray-600 mt-2">
                Plan your path to success with an interactive roadmap
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addNewNode}
                className={`px-4 py-2 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 transform ${styles.addButton}`}
                type="button"
              >
                ➕ Add Step
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium border-2 transition-all duration-200 hover:shadow-lg ${styles.saveButton}`}
                type="button"
              >
                💾 Save Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {selectedNode && (
          <div className={`w-80 bg-white shadow-lg border-r-4 p-6 ${styles.sidebar}`}>
            <div className="mb-4">
              <h3 className={`text-xl font-bold mb-2 ${styles.sidebarTitle}`}>
                Edit Step
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="node-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="node-title"
                    type="text"
                    placeholder="Enter step title"
                    value={(selectedNode.data as NodeData).label || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, 'label', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${styles.input}`}
                  />
                </div>
                <div>
                  <label htmlFor="node-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="node-description"
                    placeholder="Enter step description"
                    value={(selectedNode.data as NodeData).description || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, 'description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${styles.textarea}`}
                  />
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className={`w-full px-4 py-2 rounded-md font-medium text-white transition-colors duration-200 ${styles.doneButton}`}
                  type="button"
                >
                  ✅ Done Editing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Controls className={styles.controls} />
            <MiniMap 
              className={styles.minimap}
              maskColor={MANOA_COLORS.bg}
              nodeColor={(node) => {
                if (node.type === 'input') return MANOA_COLORS.primary;
                if (node.type === 'output') return MANOA_COLORS.accent;
                return MANOA_COLORS.secondary;
              }}
            />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={2} 
              color={MANOA_COLORS.border}
            />
          </ReactFlow>
        </div>
      </div>

      {/* Footer */}
      <div className={`bg-white border-t-4 p-4 ${styles.footer}`}>
        <div className="max-w-7xl mx-auto">
          <p className={`text-center text-sm ${styles.footerText}`}>
            🌺 Click on nodes to edit • Drag to connect • Build your path to success at UH Manoa 🌺
          </p>
        </div>
      </div>
    </div>
  );
}
