// Test file for js-tree-lib
const treeLib = require('./index.js');

// Sample tree data
const tree = [
  {
    id: 1,
    name: "pasta's",
    sub: null
  },
  {
    id: 2,
    name: 'bob',
    sub: [
      {
        id: 3,
        name: 'pob',
        sub: [
          {
            id: 4,
            name: 'go',
            sub: null
          }
        ]
      },
      {
        id: 5,
        name: 'rob2',
        sub: null
      }
    ]
  },
  {
    id: 6,
    name: 'pizza',
    sub: [
      {
        id: 7,
        name: 'cheese pizza',
        sub: null
      }
    ]
  }
];

console.log('=== JS-TREE-LIB TESTS ===\n');

// Test 1: Get Depth
console.log('1. Testing getDepth():');
const depth = treeLib.getDepth(tree);
console.log('   Tree depth:', depth);

// Test 2: Get Width
console.log('\n2. Testing getWidth():');
const width = treeLib.getWidth(tree);
console.log('   Tree width (max nodes at any level):', width);

// Test 3: Key Search
console.log('\n3. Testing keySearch():');
const foundNode = treeLib.keySearch('pob', tree, true);
console.log('   Found node "pob":', foundNode);

// Test 4: Pattern Search
console.log('\n4. Testing search() with pattern:');
const pizzaNodes = treeLib.search('pizza', tree);
console.log('   Nodes matching "pizza":', pizzaNodes);

// Test 5: Add Node
console.log('\n5. Testing addNode():');
const treeCopy1 = JSON.parse(JSON.stringify(tree));
treeLib.addNode(treeCopy1, 'pizza', { id: 8, name: 'pepperoni pizza', sub: null });
console.log('   Added "pepperoni pizza" to "pizza" node');
const pizzaNode = treeLib.keySearch('pizza', treeCopy1, true);
console.log('   Pizza node now has children:', pizzaNode.sub);

// Test 6: Remove Node (without preserving subtree)
console.log('\n6. Testing removeNode() without preserving subtree:');
const treeCopy2 = JSON.parse(JSON.stringify(tree));
treeLib.removeNode(treeCopy2, 'pob', false);
const bobNode = treeLib.keySearch('bob', treeCopy2, true);
console.log('   After removing "pob", bob\'s children:', bobNode.sub);

// Test 7: Remove Node (with preserving subtree)
console.log('\n7. Testing removeNode() with preserving subtree:');
const treeCopy3 = JSON.parse(JSON.stringify(tree));
treeLib.removeNode(treeCopy3, 'pob', true);
const bobNode2 = treeLib.keySearch('bob', treeCopy3, true);
console.log('   After removing "pob" (preserving children), bob\'s children:', bobNode2.sub);

// Test 8: Replace Node
console.log('\n8. Testing replaceNode():');
const treeCopy4 = JSON.parse(JSON.stringify(tree));
treeLib.replaceNode(treeCopy4, 'pob', { id: 99, name: 'newPob', sub: null }, true);
const bobNode3 = treeLib.keySearch('bob', treeCopy4, true);
console.log('   After replacing "pob" with "newPob":', bobNode3.sub);

// Test 9: Sort (deep)
console.log('\n9. Testing sort() with deep sorting:');
const treeCopy5 = JSON.parse(JSON.stringify(tree));
treeLib.sort(treeCopy5, false);
console.log('   Sorted tree (alphabetically):');
treeLib.print(treeCopy5);

// Test 10: Map (transform)
console.log('\n10. Testing map() - uppercase all names:');
const treeCopy6 = JSON.parse(JSON.stringify(tree));
treeLib.map('name', treeCopy6, (name) => name.toUpperCase());
const topLevelNames = treeCopy6.map(node => node.name);
console.log('    Top level names after uppercase:', topLevelNames);

// Test 11: Horizontal Flip
console.log('\n11. Testing horizonalFlip():');
const treeCopy7 = JSON.parse(JSON.stringify(tree));
const beforeFlip = treeCopy7.map(node => node.name);
treeLib.horizonalFlip(treeCopy7, true);
const afterFlip = treeCopy7.map(node => node.name);
console.log('    Before flip:', beforeFlip);
console.log('    After flip:', afterFlip);

// Test 12: Level Search
console.log('\n12. Testing levelSearch():');
const level1Nodes = treeLib.levelSearch(tree, 1, 2);
console.log('    Nodes at level 1:', level1Nodes);

// Test 13: Compare
console.log('\n13. Testing compare():');
const tree1 = [{ id: 1, name: 'a', sub: null }];
const tree2 = [{ id: 1, name: 'a', sub: null }];
const tree3 = [{ id: 1, name: 'b', sub: null }];
console.log('    tree1 === tree2:', treeLib.compare(tree1, tree2));
console.log('    tree1 === tree3:', treeLib.compare(tree1, tree3));

// Test 14: Error Handling
console.log('\n14. Testing error handling:');
try {
  treeLib.addNode(null, 'test', { name: 'test', sub: null });
} catch (error) {
  console.log('    ✓ Caught expected error:', error.message);
}

try {
  treeLib.getDepth('not an array');
} catch (error) {
  console.log('    ✓ Caught expected error:', error.message);
}

console.log('\n=== ALL TESTS COMPLETED ===');
