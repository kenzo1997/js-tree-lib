// js-tree-lib - A utility library for manipulating hierarchical tree structures

function print(tree) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  
  console.log(tree);

  for(let node of tree) {
    if(node.sub !== null) {
      print(node.sub);
    }
  }
}

function compare(tree, other) {
  if(!Array.isArray(tree) || !Array.isArray(other)) {
    throw new Error('Both tree and other must be arrays');
  }
  
  if(tree.length !== other.length) return false;

  for(let i = 0; i < tree.length; i++) {
    if(tree[i].name !== other[i].name) return false;

    if(tree[i].sub !== null && other[i].sub !== null)
      return compare(tree[i].sub, other[i].sub);
  }

  return true;
}

function addNode(tree, name, newNode) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(!name) throw new Error('name parameter is required');
  if(!newNode || typeof newNode !== 'object') throw new Error('newNode must be an object');
  if(!newNode.name) throw new Error('newNode must have a name property');
  
  for(let node of tree) {
    if(node.name === newNode.name) {
      return tree;
    }

    if(node.name === name) {
      if(node.sub === null) {
        node.sub = []
      }

      node.sub.push(newNode);
    }

    if(node.sub !== null) {
      addNode(node.sub, name, newNode);
    }
  }

  return tree;
}

function removeNode(tree, name, preserveSubTree=false) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(!name) throw new Error('name parameter is required');
  
  for(let i = 0; i < tree.length; i++) {
    let node = tree[i];
    
    if(node.sub !== null) {
      // Check if any child matches the name to remove
      for(let j = 0; j < node.sub.length; j++) {
        if(node.sub[j].name === name) {
          if(preserveSubTree && node.sub[j].sub !== null) {
            // Keep the children by promoting them to parent's level
            let childrenToPromote = node.sub[j].sub;
            node.sub.splice(j, 1); // Remove the target node
            node.sub.push(...childrenToPromote); // Add its children
          } else {
            // Simply remove the node and all its children
            node.sub.splice(j, 1);
          }
          j--; // Adjust index after removal
        }
      }
      
      // Continue searching in subtree
      removeNode(node.sub, name, preserveSubTree);
    }
  }
  
  return tree;
}

function replaceNode(tree, name, newNode, preservePrevSubTree=false) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(!name) throw new Error('name parameter is required');
  if(!newNode || typeof newNode !== 'object') throw new Error('newNode must be an object');
  
  let l = tree.length;

  for(let i = 0; i < l; i++) {
    if(tree[i].name === name) {
      if(preservePrevSubTree) {
        if(newNode.sub === null) {
          newNode.sub = tree[i].sub
        }
      }

      tree[i] = newNode;
    } else {
      if(tree[i].sub !== null) {
        replaceNode(tree[i].sub, name, newNode, preservePrevSubTree);
      }
    }
  }

  return tree;
}

function sort(tree, shallow=true) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  
  tree.sort((a,b) => (a.name > b.name) ? 1 : ( (b.name > a.name) ? -1 : 0) )
  
  if(!shallow) {
    for(let node of tree) {
      if(node.sub !== null) {
        sort(node.sub, false);
      }
    }
  }

  return tree;
}

function map(key, tree, func) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(!key) throw new Error('key parameter is required');
  if(typeof func !== 'function') throw new Error('func must be a function');
  
  for(let node of tree) {
    node[key] = func(node[key]);

    if(node.sub !== null) {
      map(key, node.sub, func);
    }
  }

  return tree;
}

function horizonalFlip(tree, shallow=true) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  
  tree.reverse();
  
  if(!shallow) {
    for(let node of tree) {
      if(node.sub !== null) {
        horizonalFlip(node.sub, false);
      }
    }
  }

  return tree;
}

function getWidth(tree) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  
  let maxWidth = 0;
  let currentLevel = tree;
  
  while(currentLevel.length > 0) {
    if(currentLevel.length > maxWidth) {
      maxWidth = currentLevel.length;
    }
    
    let nextLevel = [];
    for(let node of currentLevel) {
      if(node.sub !== null) {
        nextLevel.push(...node.sub);
      }
    }
    
    currentLevel = nextLevel;
  }
  
  return maxWidth;
}

function getDepth(tree, depth=0) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  
  let r = [];

  for(let node of tree) {
    if(node.sub !== null){
      let subTree = node.sub;

      for(let subNode of subTree) {
        r.push(subNode);
      }
    }
  }

  if(r.length === 0) 
    return depth;

  return getDepth(r, depth+1);
}

function levelSearch(tree, start, end=null) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(typeof start !== 'number' || start < 0) {
    throw new Error('start must be a non-negative number');
  }
  
  if(end === null) {
    end = getDepth(tree);
  }

  let res = tree;

  while(start > 0) {
    let n = []
    
    for(let node of res) {
      if(node.sub !== null) { 
        let subTree = node.sub;

        for(let subNode of subTree) {
          n.push(subNode);
        }
      }
    }
    
    res = n;
    start--;
    end--;
  }

  function df(tr, l) {
    if(l === 0) {
      for(let node of tr) {
        node.sub = null;
      }
      return;
    }

    for(let node of tr) {
      if(node.sub !== null) {
        df(node.sub, l-1)
      }
    }
  }
  
  df(res, end);
  return res;
}

function keySearch(val, tree, includeSubTree=false){
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(!val) throw new Error('val parameter is required');
  
  let nextLoopStorage = [];

  for(let node of tree) {
    if(node.name === val) {
      if(!includeSubTree) {
        node.sub = null;
      }

      return node;
    } else {
      if(node.sub !== null) {
        let subTree = node.sub;
        
        for(let subNode of subTree) {
          nextLoopStorage.push(subNode);
        }
      }
    }
  }
  
  if(nextLoopStorage.length === 0) {
    return null; // Node not found
  }
  
  return keySearch(val, nextLoopStorage, includeSubTree);
}

let prevStates = {}

function search(val, tree, lock=false, globalStorage=[]) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(!val) throw new Error('val parameter is required');
  
  if(!lock) {
    let hmm = {};

    for(let key in prevStates) {
      hmm[key] = prevStates[key];

      if(val === key) {
        prevStates = hmm;
        return prevStates[val];
      }
    }

    if(prevStates[''] === undefined) {
      prevStates[''] = tree;
    }
  }

  //------------------------
  let nextLoopStorage = [];

  for(let node of tree) {
    if(node.name.match(val)) {
      globalStorage.push(node);
    } else {
      if(node.sub !== null) {
        let subTree = node.sub;
        
        for(let subNode of subTree) {
          nextLoopStorage.push(subNode);
        }
      }
    }
  } 

  //----------------------------
  prevStates[val] = globalStorage;

  if(nextLoopStorage.length !== 0) {
    return search(val, nextLoopStorage, true, globalStorage);
  }

  return globalStorage;
}

// ============================================
// MEDIUM PRIORITY FUNCTIONS
// ============================================

/**
 * Deep clone a tree without using JSON.parse/stringify
 * @param {Array} tree - The tree to clone
 * @returns {Array} - Deep copy of the tree
 */
function clone(tree) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  
  function cloneNode(node) {
    if(node === null || node === undefined) return null;
    
    const newNode = {};
    
    // Copy all properties
    for(let key in node) {
      if(node.hasOwnProperty(key)) {
        if(key === 'sub' && node[key] !== null) {
          // Recursively clone the sub array
          newNode[key] = node[key].map(childNode => cloneNode(childNode));
        } else if(typeof node[key] === 'object' && node[key] !== null && !Array.isArray(node[key])) {
          // Deep copy other objects
          newNode[key] = { ...node[key] };
        } else {
          // Copy primitives and arrays
          newNode[key] = node[key];
        }
      }
    }
    
    return newNode;
  }
  
  return tree.map(node => cloneNode(node));
}

/**
 * Filter nodes based on a predicate function
 * @param {Array} tree - The tree to filter
 * @param {Function} predicate - Function that returns true to keep node
 * @param {Boolean} keepSubTree - If true, keeps entire subtree when parent matches
 * @returns {Array} - Filtered tree
 */
function filter(tree, predicate, keepSubTree = false) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(typeof predicate !== 'function') throw new Error('predicate must be a function');
  
  const result = [];
  
  for(let node of tree) {
    if(predicate(node)) {
      if(keepSubTree) {
        // Keep entire subtree
        result.push(node);
      } else {
        // Keep node but filter its children
        const newNode = { ...node };
        if(node.sub !== null) {
          const filteredSub = filter(node.sub, predicate, keepSubTree);
          newNode.sub = filteredSub.length > 0 ? filteredSub : null;
        }
        result.push(newNode);
      }
    } else {
      // Node doesn't match, but check children
      if(node.sub !== null) {
        const filteredSub = filter(node.sub, predicate, keepSubTree);
        if(filteredSub.length > 0) {
          // Promote children that match
          result.push(...filteredSub);
        }
      }
    }
  }
  
  return result;
}

/**
 * Find all nodes matching a condition
 * @param {Array} tree - The tree to search
 * @param {Function} predicate - Function that returns true for matching nodes
 * @param {Boolean} includeSubTree - If true, includes entire subtree of matching nodes
 * @returns {Array} - Array of matching nodes
 */
function find(tree, predicate, includeSubTree = false) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(typeof predicate !== 'function') throw new Error('predicate must be a function');
  
  const results = [];
  
  function searchNode(node) {
    if(predicate(node)) {
      const result = includeSubTree ? node : { ...node, sub: null };
      results.push(result);
      
      if(includeSubTree) {
        return; // Don't search children if we're including the whole subtree
      }
    }
    
    // Continue searching in children
    if(node.sub !== null) {
      for(let child of node.sub) {
        searchNode(child);
      }
    }
  }
  
  for(let node of tree) {
    searchNode(node);
  }
  
  return results;
}

/**
 * Flatten tree to a single-level array
 * @param {Array} tree - The tree to flatten
 * @param {Boolean} includeDepth - If true, adds depth property to each node
 * @returns {Array} - Flattened array of nodes
 */
function flatten(tree, includeDepth = false) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  
  const result = [];
  
  function flattenNode(node, depth = 0) {
    const flatNode = { ...node, sub: null };
    
    if(includeDepth) {
      flatNode.depth = depth;
    }
    
    result.push(flatNode);
    
    if(node.sub !== null) {
      for(let child of node.sub) {
        flattenNode(child, depth + 1);
      }
    }
  }
  
  for(let node of tree) {
    flattenNode(node);
  }
  
  return result;
}

/**
 * Convert tree to JSON with optional custom serialization
 * @param {Array} tree - The tree to serialize
 * @param {Function} transform - Optional transform function for each node
 * @param {Number} indent - Number of spaces for indentation (default: 2)
 * @returns {String} - JSON string
 */
function toJSON(tree, transform = null, indent = 2) {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(transform !== null && typeof transform !== 'function') {
    throw new Error('transform must be a function');
  }
  
  function processNode(node) {
    let processed = transform ? transform(node) : node;
    
    if(processed.sub !== null) {
      processed = { ...processed };
      processed.sub = processed.sub.map(child => processNode(child));
    }
    
    return processed;
  }
  
  const processedTree = tree.map(node => processNode(node));
  return JSON.stringify(processedTree, null, indent);
}

/**
 * Parse JSON string to tree with optional custom deserialization
 * @param {String} json - JSON string to parse
 * @param {Function} transform - Optional transform function for each node
 * @returns {Array} - Parsed tree
 */
function fromJSON(json, transform = null) {
  if(typeof json !== 'string') throw new Error('json must be a string');
  if(transform !== null && typeof transform !== 'function') {
    throw new Error('transform must be a function');
  }
  
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch(error) {
    throw new Error('Invalid JSON: ' + error.message);
  }
  
  if(!Array.isArray(parsed)) throw new Error('JSON must represent an array');
  
  function processNode(node) {
    let processed = transform ? transform(node) : node;
    
    if(processed.sub !== null && Array.isArray(processed.sub)) {
      processed = { ...processed };
      processed.sub = processed.sub.map(child => processNode(child));
    }
    
    return processed;
  }
  
  return parsed.map(node => processNode(node));
}

/**
 * Traverse tree with a custom callback function
 * @param {Array} tree - The tree to traverse
 * @param {Function} callback - Function called for each node (node, depth, parent)
 * @param {String} order - Traversal order: 'pre' (default), 'post', or 'breadth'
 * @returns {Array} - The original tree (for chaining)
 */
function traverse(tree, callback, order = 'pre') {
  if(!Array.isArray(tree)) throw new Error('tree must be an array');
  if(typeof callback !== 'function') throw new Error('callback must be a function');
  if(!['pre', 'post', 'breadth'].includes(order)) {
    throw new Error('order must be "pre", "post", or "breadth"');
  }
  
  if(order === 'breadth') {
    // Breadth-first traversal
    let queue = tree.map(node => ({ node, depth: 0, parent: null }));
    
    while(queue.length > 0) {
      const { node, depth, parent } = queue.shift();
      callback(node, depth, parent);
      
      if(node.sub !== null) {
        for(let child of node.sub) {
          queue.push({ node: child, depth: depth + 1, parent: node });
        }
      }
    }
  } else {
    // Depth-first traversal (pre-order or post-order)
    function traverseNode(node, depth = 0, parent = null) {
      if(order === 'pre') {
        callback(node, depth, parent);
      }
      
      if(node.sub !== null) {
        for(let child of node.sub) {
          traverseNode(child, depth + 1, node);
        }
      }
      
      if(order === 'post') {
        callback(node, depth, parent);
      }
    }
    
    for(let node of tree) {
      traverseNode(node);
    }
  }
  
  return tree;
}

// Export all functions
module.exports = {
  // Core operations
  print,
  compare,
  addNode,
  removeNode,
  replaceNode,
  sort,
  map,
  horizonalFlip,
  getWidth,
  getDepth,
  levelSearch,
  keySearch,
  search,
  
  // Medium priority operations
  clone,
  filter,
  find,
  flatten,
  toJSON,
  fromJSON,
  traverse
};
