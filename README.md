# js-tree-lib

A lightweight JavaScript utility library for manipulating hierarchical tree structures with support for deep nesting and recursive operations.

## Installation

```bash
npm install js-tree-lib
```

Or simply download and include `index.js` in your project.

## Tree Structure Format

This library works with trees where each node has the following structure:

```javascript
{
  id: number,        // Optional: unique identifier
  name: string,      // Required: node name/key
  sub: null | array  // Required: child nodes (null if no children)
}
```

## Quick Start

```javascript
const treeLib = require('js-tree-lib');

// Example tree
const tree = [
  {
    id: 1,
    name: "root",
    sub: [
      { id: 2, name: "child1", sub: null },
      { id: 3, name: "child2", sub: null }
    ]
  }
];

// Get tree depth
const depth = treeLib.getDepth(tree);
console.log(depth); // 2

// Add a node
treeLib.addNode(tree, "child1", { id: 4, name: "grandchild", sub: null });

// Sort the tree
treeLib.sort(tree, false); // deep sort
```

## API Reference

### Core Operations

#### `print(tree)`
Prints the entire tree structure to console.

```javascript
treeLib.print(tree);
```

#### `compare(tree, other)`
Compares two trees for structural and name equality.

```javascript
const isEqual = treeLib.compare(tree1, tree2);
// Returns: true if trees are identical, false otherwise
```

#### `addNode(tree, parentName, newNode)`
Adds a new node as a child of the node with the specified name.

```javascript
treeLib.addNode(tree, "parent", {
  id: 5,
  name: "newChild",
  sub: null
});
```

**Parameters:**
- `tree` - The tree array
- `parentName` - Name of the parent node
- `newNode` - Node object to add

#### `removeNode(tree, name, preserveSubTree=false)`
Removes a node by name.

```javascript
// Remove node and all its children
treeLib.removeNode(tree, "nodeName", false);

// Remove node but keep its children (promotes them up one level)
treeLib.removeNode(tree, "nodeName", true);
```

**Parameters:**
- `tree` - The tree array
- `name` - Name of node to remove
- `preserveSubTree` - If true, promotes children to parent's level

#### `replaceNode(tree, name, newNode, preservePrevSubTree=false)`
Replaces a node with a new node.

```javascript
treeLib.replaceNode(tree, "oldName", {
  id: 10,
  name: "newName",
  sub: null
}, true); // preserves the old node's children
```

**Parameters:**
- `tree` - The tree array
- `name` - Name of node to replace
- `newNode` - Replacement node
- `preservePrevSubTree` - If true, keeps old node's children

### Transformation Operations

#### `sort(tree, shallow=true)`
Sorts tree nodes alphabetically by name.

```javascript
// Sort only top level
treeLib.sort(tree, true);

// Sort all levels recursively
treeLib.sort(tree, false);
```

#### `map(key, tree, func)`
Applies a transformation function to a specific property of all nodes.

```javascript
// Convert all names to uppercase
treeLib.map('name', tree, (name) => name.toUpperCase());

// Add prefix to all IDs
treeLib.map('id', tree, (id) => 'PREFIX_' + id);
```

#### `horizonalFlip(tree, shallow=true)`
Reverses the order of nodes.

```javascript
// Flip only top level
treeLib.horizonalFlip(tree, true);

// Flip all levels recursively
treeLib.horizonalFlip(tree, false);
```

### Query Operations

#### `getDepth(tree)`
Returns the maximum depth (number of levels) in the tree.

```javascript
const depth = treeLib.getDepth(tree);
console.log(depth); // e.g., 3
```

#### `getWidth(tree)`
Returns the maximum number of nodes at any single level.

```javascript
const width = treeLib.getWidth(tree);
console.log(width); // e.g., 5
```

#### `keySearch(val, tree, includeSubTree=false)`
Finds and returns a specific node by exact name match.

```javascript
// Get node without its children
const node = treeLib.keySearch("nodeName", tree, false);

// Get node with its entire subtree
const nodeWithChildren = treeLib.keySearch("nodeName", tree, true);
```

#### `search(val, tree)`
Searches for all nodes whose names match a pattern (regex).

```javascript
// Find all nodes with "test" in their name
const matches = treeLib.search('test', tree);

// Find all nodes starting with "user"
const users = treeLib.search('^user', tree);
```

**Note:** Results are cached for performance.

#### `levelSearch(tree, start, end=null)`
Returns nodes between specific depth levels.

```javascript
// Get nodes at level 1
const level1 = treeLib.levelSearch(tree, 1, 2);

// Get all nodes from level 2 to the end
const fromLevel2 = treeLib.levelSearch(tree, 2);
```

**Parameters:**
- `tree` - The tree array
- `start` - Starting level (0-indexed)
- `end` - Ending level (optional, defaults to tree depth)

## Complete Example

```javascript
const treeLib = require('js-tree-lib');

// Create a tree
const myTree = [
  {
    id: 1,
    name: "documents",
    sub: [
      { id: 2, name: "work", sub: null },
      { id: 3, name: "personal", sub: [
        { id: 4, name: "photos", sub: null }
      ]}
    ]
  },
  {
    id: 5,
    name: "downloads",
    sub: null
  }
];

// Get tree statistics
console.log("Depth:", treeLib.getDepth(myTree));  // 3
console.log("Width:", treeLib.getWidth(myTree));  // 2

// Add a new folder
treeLib.addNode(myTree, "work", {
  id: 6,
  name: "projects",
  sub: null
});

// Search for nodes
const personalFolder = treeLib.keySearch("personal", myTree, true);
console.log(personalFolder);

// Transform all names to uppercase
treeLib.map('name', myTree, name => name.toUpperCase());

// Sort everything
treeLib.sort(myTree, false);

// Print the result
treeLib.print(myTree);
```

## Error Handling

All functions include input validation and will throw descriptive errors:

```javascript
try {
  treeLib.addNode(null, "parent", newNode);
} catch (error) {
  console.error(error.message); // "tree must be an array"
}
```

Common errors:
- `"tree must be an array"` - Invalid tree parameter
- `"name parameter is required"` - Missing required name
- `"newNode must be an object"` - Invalid node format
- `"func must be a function"` - Invalid function parameter

## Advanced Operations

### `clone(tree)`
Creates a deep copy of the tree without using JSON serialization.

```javascript
const original = [{ id: 1, name: 'test', sub: null }];
const copy = treeLib.clone(original);
copy[0].name = 'modified';
console.log(original[0].name); // Still 'test'
```

**Benefits over JSON.parse/stringify:**
- Preserves functions and special objects
- Better performance
- Handles circular references (in some cases)

### `filter(tree, predicate, keepSubTree=false)`
Filters nodes based on a condition.

```javascript
// Keep only folders
const folders = treeLib.filter(tree, (node) => node.type === 'folder');

// Keep node and entire subtree when match found
const important = treeLib.filter(tree, 
  (node) => node.important === true, 
  true  // keepSubTree
);
```

**Parameters:**
- `predicate` - Function that returns `true` to keep node
- `keepSubTree` - If true, keeps entire subtree when parent matches

### `find(tree, predicate, includeSubTree=false)`
Finds all nodes matching a condition.

```javascript
// Find all PDF files
const pdfs = treeLib.find(tree, (node) => node.name.endsWith('.pdf'));

// Find with entire subtrees
const workFolder = treeLib.find(tree, 
  (node) => node.name === 'work',
  true  // includeSubTree
);
```

**Returns:** Array of matching nodes

### `flatten(tree, includeDepth=false)`
Converts hierarchical tree to flat array.

```javascript
// Simple flatten
const flat = treeLib.flatten(tree);
// Returns: [node1, node2, node3, ...]

// Include depth information
const flatWithDepth = treeLib.flatten(tree, true);
// Each node has a 'depth' property
flatWithDepth.forEach(node => {
  console.log(`${node.name} is at depth ${node.depth}`);
});
```

**Use cases:**
- Database exports
- CSV generation
- Simple iteration

### `toJSON(tree, transform=null, indent=2)`
Serializes tree to JSON with optional transformation.

```javascript
// Basic serialization
const json = treeLib.toJSON(tree);

// With transformation - remove sensitive data
const sanitized = treeLib.toJSON(tree, (node) => {
  const { password, ...safe } = node;
  return safe;
});

// Compact output
const compact = treeLib.toJSON(tree, null, 0);
```

**Parameters:**
- `transform` - Optional function to transform each node before serialization
- `indent` - Number of spaces for formatting (0 for compact)

### `fromJSON(json, transform=null)`
Parses JSON string back to tree structure.

```javascript
// Basic parsing
const tree = treeLib.fromJSON(jsonString);

// With transformation - add timestamps
const treeWithTimestamps = treeLib.fromJSON(jsonString, (node) => {
  return { ...node, createdAt: Date.now() };
});
```

**Error handling:** Throws descriptive errors for invalid JSON

### `traverse(tree, callback, order='pre')`
Custom tree traversal with callback.

```javascript
// Pre-order traversal (parent before children)
treeLib.traverse(tree, (node, depth, parent) => {
  console.log(`${node.name} at depth ${depth}`);
}, 'pre');

// Post-order traversal (children before parent)
treeLib.traverse(tree, (node, depth, parent) => {
  console.log(`Processing ${node.name}`);
}, 'post');

// Breadth-first traversal (level by level)
treeLib.traverse(tree, (node, depth, parent) => {
  console.log(`Level ${depth}: ${node.name}`);
}, 'breadth');
```

**Parameters:**
- `callback(node, depth, parent)` - Called for each node
- `order` - `'pre'`, `'post'`, or `'breadth'`

**Use cases:**
- Custom transformations
- Collecting statistics
- Validation
- Debugging

## Complex Examples

### Example 1: Export to CSV
```javascript
const treeLib = require('js-tree-lib');

// Flatten tree with depth info
const flat = treeLib.flatten(tree, true);

// Generate CSV
const csv = flat.map(node => 
  `${node.name},${node.type},${node.depth}`
).join('\n');

console.log(csv);
```

### Example 2: Find and Clone Specific Branch
```javascript
// Find all nodes matching criteria
const matches = treeLib.find(tree, 
  (node) => node.category === 'important',
  true  // include subtrees
);

// Clone the results for safe manipulation
const workingCopy = treeLib.clone(matches);

// Modify without affecting original
treeLib.traverse(workingCopy, (node) => {
  node.processed = true;
});
```

### Example 3: Filter, Transform, and Serialize
```javascript
// Keep only active items
const active = treeLib.filter(tree, 
  (node) => node.status === 'active'
);

// Transform and export
const json = treeLib.toJSON(active, (node) => {
  return {
    id: node.id,
    name: node.name,
    exportDate: new Date().toISOString()
  };
});

// Save to file
fs.writeFileSync('export.json', json);
```

### Example 4: Tree Statistics
```javascript
const stats = {
  totalNodes: 0,
  maxDepth: 0,
  nodesByType: {}
};

treeLib.traverse(tree, (node, depth) => {
  stats.totalNodes++;
  stats.maxDepth = Math.max(stats.maxDepth, depth);
  
  stats.nodesByType[node.type] = 
    (stats.nodesByType[node.type] || 0) + 1;
});

console.log(stats);
// { totalNodes: 15, maxDepth: 3, nodesByType: { folder: 8, file: 7 } }
```

## Performance Tips

1. **Use `clone()` instead of `JSON.parse(JSON.stringify())`** for better performance
2. **Use `find()` with conditions** rather than filtering entire tree
3. **Use `flatten()` for iteration** instead of recursive traversal when possible
4. **Cache results** of expensive operations like `getDepth()` if tree doesn't change

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/yourusername/js-tree-lib/issues).
