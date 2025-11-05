import React, { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTaskStore } from '@/stores/useTaskStore';

export const GraphView: React.FC = () => {
  const { tasks } = useTaskStore();

  // Generate nodes and edges from tasks
  const { nodes, edges } = useMemo(() => {
    const nodeMap = new Map<string, Node>();
    const edgeList: Edge[] = [];

    // Create center node
    const centerNode: Node = {
      id: 'center',
      type: 'default',
      position: { x: 400, y: 300 },
      data: { label: 'Tasks' },
      style: {
        background: '#0066cc',
        color: 'white',
        border: '2px solid #0066cc',
        borderRadius: '50%',
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    };
    nodeMap.set('center', centerNode);

    // Collect all tags and projects
    const tagCounts = new Map<string, number>();
    const projectCounts = new Map<string, number>();
    const tagProjects = new Map<string, Set<string>>();

    tasks.forEach((task) => {
      // Count tags
      task.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);

        // Connect tags with projects
        if (task.project) {
          if (!tagProjects.has(tag)) {
            tagProjects.set(tag, new Set());
          }
          tagProjects.get(tag)!.add(task.project);
        }
      });

      // Count projects
      if (task.project) {
        projectCounts.set(task.project, (projectCounts.get(task.project) || 0) + 1);
      }
    });

    // Create project nodes
    const projectArray = Array.from(projectCounts.entries());
    projectArray.forEach(([project, count], index) => {
      const angle = (index / projectArray.length) * 2 * Math.PI;
      const radius = 250;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      const node: Node = {
        id: `project-${project}`,
        type: 'default',
        position: { x, y },
        data: { label: `${project} (${count})` },
        style: {
          background: '#008844',
          color: 'white',
          border: '2px solid #008844',
          borderRadius: '8px',
          padding: '10px 15px',
          fontSize: '14px',
          fontWeight: '500',
        },
      };
      nodeMap.set(node.id, node);

      // Edge from center to project
      edgeList.push({
        id: `edge-center-${node.id}`,
        source: 'center',
        target: node.id,
        animated: false,
        style: { stroke: '#008844', strokeWidth: 2 },
      });
    });

    // Create tag nodes
    const tagArray = Array.from(tagCounts.entries());
    tagArray.forEach(([tag, count], index) => {
      const angle = (index / tagArray.length) * 2 * Math.PI + Math.PI / tagArray.length;
      const radius = 400;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      const node: Node = {
        id: `tag-${tag}`,
        type: 'default',
        position: { x, y },
        data: { label: `#${tag} (${count})` },
        style: {
          background: '#0066cc',
          color: 'white',
          border: '2px solid #0066cc',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
        },
      };
      nodeMap.set(node.id, node);

      // Edge from center to tag
      edgeList.push({
        id: `edge-center-${node.id}`,
        source: 'center',
        target: node.id,
        animated: false,
        style: { stroke: '#0066cc', strokeWidth: 1 },
      });

      // Edges from tag to related projects
      const relatedProjects = tagProjects.get(tag);
      if (relatedProjects) {
        relatedProjects.forEach((project) => {
          edgeList.push({
            id: `edge-${node.id}-project-${project}`,
            source: node.id,
            target: `project-${project}`,
            animated: false,
            style: { stroke: '#999', strokeWidth: 1, strokeDasharray: '5, 5' },
          });
        });
      }
    });

    return {
      nodes: Array.from(nodeMap.values()),
      edges: edgeList,
    };
  }, [tasks]);

  return (
    <div className="animate-in h-[calc(100vh-200px)]">
      <h2 className="mb-4">Graph View</h2>
      <div className="card h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeStrokeColor={(n) => {
              if (n.id === 'center') return '#0066cc';
              if (n.id.startsWith('project-')) return '#008844';
              return '#0066cc';
            }}
            nodeColor={(n) => {
              if (n.id === 'center') return '#0066cc';
              if (n.id.startsWith('project-')) return '#008844';
              return '#0066cc';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};
