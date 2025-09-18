import { TreeService } from '../src/services/TreeService';

describe('TreeService', () => {
  let treeService: TreeService;

  beforeEach(() => {
    treeService = new TreeService();
  });

  describe('seedTree', () => {
    it('should generate tree with correct structure', () => {
      const result = treeService.seedTree(3, 3);
      
      expect(result.nodes).toBeGreaterThan(0);
      expect(result.nodes).toBeLessThanOrEqual(3 ** 3);
    });

    it('should cap at maximum nodes', () => {
      const result = treeService.seedTree(20, 10);
      
      expect(result.nodes).toBeLessThanOrEqual(10000);
    });
  });

  describe('getRootNodes', () => {
    beforeEach(() => {
      treeService.seedTree(3, 2);
    });

    it('should return root nodes', () => {
      const rootNodes = treeService.getRootNodes();
      
      expect(rootNodes.length).toBe(3);
      expect(rootNodes.every(node => node.parentId === null)).toBe(true);
    });
  });

  describe('getNodeChildren', () => {
    beforeEach(() => {
      treeService.seedTree(3, 3);
    });

    it('should return children for parent node', () => {
      const rootNodes = treeService.getRootNodes();
      const children = treeService.getNodeChildren(rootNodes[0].id);
      
      expect(children).toBeDefined();
      expect(Array.isArray(children)).toBe(true);
    });

    it('should return empty array for leaf nodes', () => {
      const rootNodes = treeService.getRootNodes();
      const children = treeService.getNodeChildren(rootNodes[0].id);
      
      if (children.length > 0) {
        const leafChildren = treeService.getNodeChildren(children[0].id);
        expect(leafChildren).toEqual([]);
      }
    });
  });

  describe('searchNodes', () => {
    beforeEach(() => {
      treeService.seedTree(5, 3);
    });

    it('should find matching nodes', () => {
      const results = treeService.searchNodes('Node 1', 10);
      
      expect(results.items).toBeDefined();
      expect(Array.isArray(results.items)).toBe(true);
    });

    it('should return path for each result', () => {
      const results = treeService.searchNodes('Node', 5);
      
      results.items.forEach(result => {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('path');
        expect(Array.isArray(result.path)).toBe(true);
        expect(result.path.length).toBeGreaterThan(0);
      });
    });

    it('should respect limit parameter', () => {
      const results = treeService.searchNodes('Node', 3);
      
      expect(results.items.length).toBeLessThanOrEqual(3);
    });
  });
});
