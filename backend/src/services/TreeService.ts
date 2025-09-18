import { Node, SearchResult, SearchResponse } from '../models';

export class TreeService {
  private nodes: Map<string, Node> = new Map();
  private childrenMap: Map<string, string[]> = new Map();
  private parentMap: Map<string, string> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize with empty data - will be populated by seed endpoint
  }

  public seedTree(breadth: number, depth: number): { nodes: number } {
    // Clear existing data
    this.nodes.clear();
    this.childrenMap.clear();
    this.parentMap.clear();

    let nodeId = 1;
    const maxNodes = Math.min(breadth ** depth, 10000); // Cap at 10k nodes

    // Generate root nodes
    const rootNodes: string[] = [];
    for (let i = 0; i < breadth && nodeId <= maxNodes; i++) {
      const id = `node_${nodeId++}`;
      const node: Node = {
        id,
        parentId: null,
        name: `Root Node ${i + 1}`,
        hasChildren: true
      };
      this.nodes.set(id, node);
      rootNodes.push(id);
    }

    // Generate child nodes level by level
    let currentLevel = rootNodes;
    let currentDepth = 1;

    while (currentLevel.length > 0 && currentDepth < depth && nodeId <= maxNodes) {
      const nextLevel: string[] = [];

      for (const parentId of currentLevel) {
        const parentNode = this.nodes.get(parentId);
        if (!parentNode) continue;

        const childrenCount = Math.min(breadth, maxNodes - nodeId + 1);
        const children: string[] = [];

        for (let i = 0; i < childrenCount && nodeId <= maxNodes; i++) {
          const id = `node_${nodeId++}`;
          const node: Node = {
            id,
            parentId,
            name: `Node ${nodeId - 1}`,
            hasChildren: currentDepth < depth - 1 && nodeId <= maxNodes
          };
          
          this.nodes.set(id, node);
          children.push(id);
          this.parentMap.set(id, parentId);
        }

        if (children.length > 0) {
          this.childrenMap.set(parentId, children);
          nextLevel.push(...children);
        } else {
          // Update parent to indicate no children
          parentNode.hasChildren = false;
        }
      }

      currentLevel = nextLevel;
      currentDepth++;
    }

    return { nodes: this.nodes.size };
  }

  public getRootNodes(): Node[] {
    const rootNodes: Node[] = [];
    for (const node of this.nodes.values()) {
      if (node.parentId === null) {
        rootNodes.push(node);
      }
    }
    return rootNodes;
  }

  public getNodeChildren(nodeId: string): Node[] {
    const childrenIds = this.childrenMap.get(nodeId) || [];
    const children: Node[] = [];
    
    for (const childId of childrenIds) {
      const child = this.nodes.get(childId);
      if (child) {
        children.push(child);
      }
    }
    
    return children;
  }

  public searchNodes(query: string, limit: number = 100): SearchResponse {
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    for (const node of this.nodes.values()) {
      if (node.name.toLowerCase().includes(queryLower)) {
        const path = this.getNodePath(node.id);
        results.push({
          id: node.id,
          name: node.name,
          path
        });

        if (results.length >= limit) {
          break;
        }
      }
    }

    return { items: results };
  }

  private getNodePath(nodeId: string): Array<{ id: string; name: string }> {
    const path: Array<{ id: string; name: string }> = [];
    let currentId: string | undefined = nodeId;

    while (currentId) {
      const node = this.nodes.get(currentId);
      if (!node) break;

      path.unshift({ id: node.id, name: node.name });
      currentId = this.parentMap.get(currentId);
    }

    return path;
  }

  public getNode(nodeId: string): Node | undefined {
    return this.nodes.get(nodeId);
  }
}
