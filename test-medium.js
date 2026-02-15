// Test file for medium priority functions
const treeLib = require('./index.js');

// Sample tree data
const tree = [
  {
    id: 1,
    name: "documents",
    type: "folder",
    sub: [
      {
        id: 2,
        name: "work",
        type: "folder",
        sub: [
          { id: 3, name: "report.pdf", type: "file", sub: null },
          { id: 4, name: "presentation.pptx", type: "file", sub: null }
        ]
      },
      {
        id: 5,
        name: "personal",
        type: "folder",
        sub: [
          { id: 6, name: "photo.jpg", type: "file", sub: null }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "downloads",
    type: "folder",
    sub: null
  }
];

console.log('=== MEDIUM PRIORITY FUNCTIONS TESTS ===\n');

// Test 1: Clone
console.log('1. Testing clone():');
const clonedTree = treeLib.clone(tree);
clonedTree[0].name = "MODIFIED";
console.log('   Original tree first node name:', tree[0].name);
console.log('   Cloned tree first node name:', clonedTree[0].name);
console.log('   ✓ Clone creates independent copy');

// Test 2: Filter - Keep only folders
console.log('\n2. Testing filter() - keep only folders:');
const foldersOnly = treeLib.filter(tree, (node) => node.type === 'folder', false);
console.log('   Filtered result (folders only):');
console.log(JSON.stringify(foldersOnly, null, 2));

// Test 3: Filter with keepSubTree
console.log('\n3. Testing filter() with keepSubTree - keep "work" folder:');
const workFolder = treeLib.filter(tree, (node) => node.name === 'work', true);
console.log('   Result (work folder with all children):');
console.log(JSON.stringify(workFolder, null, 2));

// Test 4: Find - Get all PDF files
console.log('\n4. Testing find() - find all .pdf files:');
const pdfFiles = treeLib.find(tree, (node) => node.name.endsWith('.pdf'));
console.log('   Found PDF files:', pdfFiles);

// Test 5: Find with condition
console.log('\n5. Testing find() - find all nodes with id > 3:');
const nodesWithHighId = treeLib.find(tree, (node) => node.id > 3);
console.log('   Found nodes:', nodesWithHighId.map(n => ({ id: n.id, name: n.name })));

// Test 6: Find with includeSubTree
console.log('\n6. Testing find() with includeSubTree - find "work" folder:');
const workWithChildren = treeLib.find(tree, (node) => node.name === 'work', true);
console.log('   Found work folder with children:', workWithChildren);

// Test 7: Flatten without depth
console.log('\n7. Testing flatten() without depth:');
const flatTree = treeLib.flatten(tree, false);
console.log('   Flattened tree (nodes only):');
flatTree.forEach(node => {
  console.log('   -', node.name, `(id: ${node.id})`);
});

// Test 8: Flatten with depth
console.log('\n8. Testing flatten() with depth:');
const flatTreeWithDepth = treeLib.flatten(tree, true);
console.log('   Flattened tree with depth:');
flatTreeWithDepth.forEach(node => {
  const indent = '  '.repeat(node.depth);
  console.log(`   ${indent}- ${node.name} (depth: ${node.depth})`);
});

// Test 9: toJSON without transform
console.log('\n9. Testing toJSON():');
const jsonString = treeLib.toJSON(tree, null, 2);
console.log('   JSON output (first 200 chars):', jsonString.substring(0, 200) + '...');

// Test 10: toJSON with transform
console.log('\n10. Testing toJSON() with transform - remove type property:');
const transformedJson = treeLib.toJSON(tree, (node) => {
  const { type, ...rest } = node;
  return rest;
}, 2);
console.log('    Transformed JSON (first 200 chars):', transformedJson.substring(0, 200) + '...');

// Test 11: fromJSON
console.log('\n11. Testing fromJSON():');
const jsonStr = JSON.stringify(tree);
const parsedTree = treeLib.fromJSON(jsonStr);
console.log('    Parsed tree matches original:', JSON.stringify(parsedTree) === JSON.stringify(tree));

// Test 12: fromJSON with transform
console.log('\n12. Testing fromJSON() with transform - add timestamp:');
const parsedWithTransform = treeLib.fromJSON(jsonStr, (node) => {
  return { ...node, timestamp: Date.now() };
});
console.log('    First node has timestamp:', 'timestamp' in parsedWithTransform[0]);

// Test 13: Traverse - Pre-order
console.log('\n13. Testing traverse() - pre-order:');
console.log('    Pre-order traversal:');
treeLib.traverse(tree, (node, depth, parent) => {
  const indent = '  '.repeat(depth);
  const parentName = parent ? parent.name : 'root';
  console.log(`    ${indent}- ${node.name} (parent: ${parentName})`);
}, 'pre');

// Test 14: Traverse - Post-order
console.log('\n14. Testing traverse() - post-order:');
const postOrderNames = [];
treeLib.traverse(tree, (node) => {
  postOrderNames.push(node.name);
}, 'post');
console.log('    Post-order names:', postOrderNames);

// Test 15: Traverse - Breadth-first
console.log('\n15. Testing traverse() - breadth-first:');
console.log('    Breadth-first traversal:');
treeLib.traverse(tree, (node, depth) => {
  console.log(`    Depth ${depth}: ${node.name}`);
}, 'breadth');

// Test 16: Traverse with mutation
console.log('\n16. Testing traverse() for mutation - add level property:');
const treeCopy = treeLib.clone(tree);
treeLib.traverse(treeCopy, (node, depth) => {
  node.level = depth;
});
const flatWithLevel = treeLib.flatten(treeCopy);
console.log('    Nodes with level property:');
flatWithLevel.slice(0, 5).forEach(node => {
  console.log(`    - ${node.name}: level ${node.level}`);
});

// Test 17: Complex operation - Filter then flatten
console.log('\n17. Testing complex operation - filter files then flatten:');
const filesOnly = treeLib.filter(tree, (node) => node.type === 'file');
const flatFiles = treeLib.flatten(filesOnly);
console.log('    All files in tree:', flatFiles.map(f => f.name));

// Test 18: Complex operation - Find folders, clone, modify
console.log('\n18. Testing complex operation - find, clone, modify:');
const folders = treeLib.find(tree, (node) => node.type === 'folder');
const clonedFolders = treeLib.clone(folders);
clonedFolders.forEach(folder => folder.modified = true);
console.log('    Original folders have "modified":', 'modified' in folders[0]);
console.log('    Cloned folders have "modified":', 'modified' in clonedFolders[0]);

// Test 19: Error handling
console.log('\n19. Testing error handling:');
try {
  treeLib.clone('not an array');
} catch (error) {
  console.log('    ✓ Clone error:', error.message);
}

try {
  treeLib.filter(tree, 'not a function');
} catch (error) {
  console.log('    ✓ Filter error:', error.message);
}

try {
  treeLib.traverse(tree, () => {}, 'invalid');
} catch (error) {
  console.log('    ✓ Traverse error:', error.message);
}

try {
  treeLib.fromJSON('invalid json');
} catch (error) {
  console.log('    ✓ FromJSON error:', error.message);
}

// Test 20: Performance comparison - clone vs JSON
console.log('\n20. Testing performance - clone() vs JSON.parse/stringify:');
const iterations = 1000;

console.time('    JSON.parse/stringify');
for(let i = 0; i < iterations; i++) {
  JSON.parse(JSON.stringify(tree));
}
console.timeEnd('    JSON.parse/stringify');

console.time('    clone()');
for(let i = 0; i < iterations; i++) {
  treeLib.clone(tree);
}
console.timeEnd('    clone()');

console.log('\n=== ALL MEDIUM PRIORITY TESTS COMPLETED ===');
