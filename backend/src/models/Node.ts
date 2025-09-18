export interface Node {
  id: string;
  parentId: string | null;
  name: string;
  hasChildren: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  path: Array<{ id: string; name: string }>;
}

export interface SearchResponse {
  items: SearchResult[];
}
