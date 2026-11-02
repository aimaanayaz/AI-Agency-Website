/* The essentials path: the problems to finish DSA properly without doing all ~480.
   Hand-picked per topic (Nov 2026) for pattern coverage, guided by the well-known shortlists (Blind 75,
   Grind 75/169, NeetCode 150): every Blind 75 classic in the path, plus the must-know problems of each
   topic, weighted toward what interviews lean on (arrays, binary search, trees, graphs, DP).
   Everything else stays on the path as Extra practice, which comes after the essentials.
   Topic-introducing lectures are always part of the essentials; a lecture that only solves extra problems is extra too.
   Concept reads (Theory items) listed here are the ones a topic needs. */
(function () {
  const D = (window.DQ_DATA = window.DQ_DATA || {});
  D.core = [
    // Java toolkit
    'contains-duplicate', 'first-unique-character-in-a-string', 'group-anagrams',
    // Arrays II
    'arr-lsk-negatives', 'subarray-sum-equals-k', 'sort-colors', 'majority-element', 'maximum-subarray', 'best-time-to-buy-and-sell-stock',
    'rearrange-array-elements-by-sign', 'next-permutation', 'longest-consecutive-sequence', 'rotate-image', 'spiral-matrix', 'set-matrix-zeroes',
    // Arrays III
    'majority-element-ii', '3sum', '4sum', 'largest-subarray-with-0-sum', 'count-subarrays-with-xor-k', 'merge-intervals', 'set-mismatch', 'maximum-product-subarray',
    // Sorting
    'selection-sort', 'bubble-sort', 'insertion-sort',
    // Binary search 1D
    'binary-search', 'implement-lower-bound', 'implement-upper-bound', 'find-first-and-last-position-of-element-in-sorted-array',
    'search-in-rotated-sorted-array', 'search-in-rotated-sorted-array-ii', 'find-minimum-in-rotated-sorted-array', 'find-peak-element', 'single-element-in-a-sorted-array',
    // Binary search on answers
    'sqrtx', 'koko-eating-bananas', 'minimum-number-of-days-to-make-m-bouquets', 'capacity-to-ship-packages-within-d-days', 'book-allocation',
    'split-array-largest-sum', 'magnetic-force-between-two-balls', 'median-of-two-sorted-arrays',
    // Binary search on 2D
    'search-a-2d-matrix-ii', 'find-a-peak-element-ii',
    // Strings
    'isomorphic-strings', 'permutation-in-string', 'sort-characters-by-frequency', 'roman-to-integer', 'string-to-integer-atoi', 'longest-palindromic-substring',
    // Recursion foundations
    'climbing-stairs-rec', 'binary-search-rec',
    // Divide and conquer
    'sort-an-array', 'quick-sort', 'count-inversions', 'reverse-pairs',
    // Subsequences and subsets
    'patterns-of-subsequences-theory', 'subsets', 'generate-parentheses', 'count-subsequences-with-sum-k', 'subsets-ii', 'combination-sum', 'combination-sum-ii',
    'permutations', 'letter-combinations-of-a-phone-number',
    // Backtracking
    'rat-in-a-maze', 'n-queens', 'sudoku-solver', 'palindrome-partitioning', 'word-search', 'word-break',
    // Bit manipulation
    'number-of-1-bits', 'divide-two-integers', 'minimum-bit-flips-to-convert-number', 'find-the-number-that-appears-an-odd-number-of-times',
    'power-set-bitmasking', 'single-number-iii', 'count-primes',
    // Linked list basics
    'introduction-to-linked-lists', 'design-linked-list', 'delete-node-in-a-linked-list', 'introduction-to-doubly-linked-lists', 'reverse-a-dll',
    // Linked list core patterns
    'reverse-linked-list', 'reverse-a-linked-list-recursive', 'middle-of-the-linked-list', 'palindrome-linked-list', 'linked-list-cycle', 'linked-list-cycle-ii',
    'remove-nth-node-from-end-of-list', 'odd-even-linked-list', 'merge-two-sorted-lists', 'sort-list', 'add-two-numbers', 'intersection-of-two-linked-lists',
    // Linked list advanced
    'rotate-list', 'partition-list', 'reverse-nodes-in-k-group', 'flattening-a-linked-list', 'copy-list-with-random-pointer',
    // Stacks
    'implement-stack-using-arrays', 'implement-stack-using-a-linked-list', 'valid-parentheses', 'min-stack', 'infix-to-postfix', 'decode-string',
    // Queues and design
    'implement-queue-using-arrays', 'implement-stack-using-queues', 'implement-queue-using-stacks', 'lru-cache',
    // Monotonic stack
    'daily-temperatures', 'next-greater-element-i', 'next-greater-element-ii', 'next-smaller-element', 'online-stock-span', 'remove-k-digits',
    'asteroid-collision', 'sum-of-subarray-minimums', 'trapping-rain-water', 'largest-rectangle-in-histogram', 'sliding-window-maximum',
    // Sliding window and two pointers
    'longest-substring-without-repeating-characters', 'max-consecutive-ones-iii', 'fruit-into-baskets', 'longest-repeating-character-replacement',
    'binary-subarrays-with-sum', 'count-number-of-nice-subarrays', 'number-of-substrings-containing-all-three-characters',
    'maximum-points-you-can-obtain-from-cards', 'minimum-window-substring', 'subarrays-with-k-different-integers',
    // Heaps
    'priority-queues-binary-heaps-theory', 'min-heap-max-heap-implementation', 'kth-largest-element-in-an-array', 'top-k-frequent-elements',
    'kth-largest-element-in-a-stream', 'merge-k-sorted-lists', 'task-scheduler', 'hand-of-straights', 'find-median-from-data-stream',
    // Greedy
    'assign-cookies', 'jump-game', 'jump-game-ii', 'n-meetings-in-one-room', 'minimum-platforms', 'job-sequencing-problem',
    'insert-interval', 'non-overlapping-intervals', 'valid-parenthesis-string', 'candy',
    // Binary tree traversals
    'introduction-to-trees', 'binary-tree-representation-in-java', 'tree-traversals-theory', 'binary-tree-preorder-traversal', 'binary-tree-inorder-traversal',
    'binary-tree-postorder-traversal', 'binary-tree-level-order-traversal', 'iterative-preorder', 'iterative-inorder',
    // Binary trees, medium
    'maximum-depth-of-binary-tree', 'balanced-binary-tree', 'diameter-of-binary-tree', 'binary-tree-maximum-path-sum', 'same-tree', 'symmetric-tree',
    'binary-tree-zigzag-level-order-traversal', 'boundary-of-binary-tree', 'vertical-order-traversal-of-a-binary-tree', 'top-view-of-binary-tree', 'binary-tree-right-side-view',
    // Binary trees, hard
    'binary-tree-paths', 'lowest-common-ancestor-of-a-binary-tree', 'maximum-width-of-binary-tree', 'all-nodes-distance-k-in-binary-tree',
    'construct-binary-tree-from-preorder-and-inorder-traversal', 'serialize-and-deserialize-binary-tree', 'morris-inorder-traversal', 'flatten-binary-tree-to-linked-list',
    // Binary search trees
    'introduction-to-bsts', 'search-in-a-binary-search-tree', 'insert-into-a-binary-search-tree', 'delete-node-in-a-bst', 'kth-smallest-element-in-a-bst',
    'validate-binary-search-tree', 'lowest-common-ancestor-of-a-binary-search-tree', 'construct-binary-search-tree-from-preorder-traversal',
    'inorder-successor-in-bst', 'binary-search-tree-iterator', 'recover-binary-search-tree',
    // Graph basics
    'graphs-and-their-types', 'graph-representation-in-java', 'connected-components', 'bfs-traversal', 'dfs-traversal', 'number-of-provinces',
    'number-of-islands', 'flood-fill', 'rotting-oranges', '01-matrix', 'surrounded-regions',
    // Cycles, bipartite, topo sort
    'cycle-in-undirected-graph-bfs', 'is-graph-bipartite', 'topological-sort-dfs', 'kahns-algorithm-bfs-topo-sort', 'cycle-in-directed-graph-bfs',
    'course-schedule-i', 'course-schedule-ii', 'find-eventual-safe-states', 'alien-dictionary', 'word-ladder',
    // Shortest paths
    'shortest-path-in-an-undirected-graph-unit-weights', 'dijkstras-algorithm', 'why-a-priority-queue-in-dijkstra', 'shortest-path-in-binary-matrix',
    'path-with-minimum-effort', 'cheapest-flights-within-k-stops', 'network-delay-time', 'bellman-ford-algorithm', 'floyd-warshall-algorithm',
    // MST and disjoint set
    'minimum-spanning-tree-theory', 'prims-algorithm', 'disjoint-set-union-by-rank', 'kruskals-algorithm', 'number-of-operations-to-make-network-connected',
    'most-stones-removed-with-same-row-or-column', 'accounts-merge', 'making-a-large-island',
    // DP foundations
    'introduction-to-dynamic-programming', 'climbing-stairs', 'frog-jump', 'house-robber', 'house-robber-ii', 'ninjas-training', 'unique-paths',
    'unique-paths-ii', 'minimum-path-sum', 'triangle', 'minimum-falling-path-sum',
    // DP on subsequences
    'subset-sum-equal-to-target', 'partition-equal-subset-sum', 'count-subsets-with-sum-k', 'count-partitions-with-given-difference', 'target-sum',
    '0-1-knapsack', 'unbounded-knapsack', 'rod-cutting', 'coin-change', 'coin-change-ii',
    // DP on strings
    'longest-common-subsequence', 'longest-common-substring', 'longest-palindromic-subsequence', 'minimum-insertion-steps-to-make-a-string-palindrome',
    'delete-operation-for-two-strings', 'distinct-subsequences', 'edit-distance', 'wildcard-matching',
    // DP on stocks and LIS
    'best-time-to-buy-and-sell-stock-ii', 'best-time-to-buy-and-sell-stock-iii', 'best-time-to-buy-and-sell-stock-with-cooldown',
    'best-time-to-buy-and-sell-stock-with-transaction-fee', 'longest-increasing-subsequence', 'lis-using-binary-search', 'largest-divisible-subset', 'longest-string-chain',
    // Partition DP
    'matrix-chain-multiplication', 'minimum-cost-to-cut-a-stick', 'burst-balloons', 'palindrome-partitioning-ii', 'count-square-submatrices-with-all-ones',
    // Tries
    'implement-trie-prefix-tree', 'longest-word-with-all-prefixes', 'maximum-xor-of-two-numbers-in-an-array',
    // String algorithms
    'kmp-lps-pi-array', 'find-the-index-of-the-first-occurrence-in-a-string',
    // Blind 75 classics that sit in the unit-challenge slots: practised as normal essentials
    'product-of-array-except-self', 'container-with-most-water', 'counting-bits', 'reorder-list', 'invert-binary-tree',
    'subtree-of-another-tree', 'clone-graph', 'decode-ways', 'design-add-and-search-words-data-structure',
  ];
})();
