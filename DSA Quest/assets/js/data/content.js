/* Pattern library: names, recognition cues and Java templates, shown in each problem's panel and the Notebook. */
(function () {
  const D = (window.DQ_DATA = window.DQ_DATA || {});

  // ── Pattern library ──────────────────────────────────────────────
  D.patterns = {
    hashing: { name: 'Hashing & Frequency Maps', icon: '#️⃣', cues: ['count / frequency', 'seen before?', 'duplicates', 'pair with sum in an UNSORTED array'], code: `Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) freq.merge(x, 1, Integer::sum);
// lookup: freq.getOrDefault(key, 0)` },
    pre: { name: 'Prefix Sum (+ HashMap)', icon: '➕', cues: ['subarray sum equals K', 'range sums', 'count subarrays', 'works with negatives'], code: `Map<Integer, Integer> seen = new HashMap<>();
seen.put(0, 1);
int sum = 0, count = 0;
for (int x : nums) {
    sum += x;
    count += seen.getOrDefault(sum - k, 0);
    seen.merge(sum, 1, Integer::sum);
}` },
    tp: { name: 'Two Pointers', icon: '👉', cues: ['sorted array', 'pairs / triplets', 'palindrome', 'in-place partition', 'merge two sorted things'], code: `int i = 0, j = n - 1;
while (i < j) {
    int s = a[i] + a[j];
    if (s == target) { /* record */ i++; j--; }
    else if (s < target) i++;
    else j--;
}` },
    fs: { name: 'Fast & Slow Pointers', icon: '🐢', cues: ['middle of a list', 'cycle detection', 'palindrome linked list', 'find the duplicate'], code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) { /* cycle! */ }
}` },
    sw: { name: 'Sliding Window', icon: '🪟', cues: ['longest / shortest SUBARRAY or SUBSTRING', 'contiguous', 'at most K', 'window of size k'], code: `int left = 0, best = 0;
for (int right = 0; right < n; right++) {
    add(a[right]);
    while (!valid()) remove(a[left++]);
    best = Math.max(best, right - left + 1);
}` },
    kad: { name: "Kadane's / Running Best", icon: '🏃', cues: ['maximum subarray sum or product', 'best time to buy & sell', 'extend or restart'], code: `int best = nums[0], cur = 0;
for (int x : nums) {
    cur = Math.max(x, cur + x);
    best = Math.max(best, cur);
}` },
    intv: { name: 'Intervals', icon: '📏', cues: ['overlapping ranges', 'merge / insert intervals', 'meeting rooms', 'minimum removals'], code: `Arrays.sort(iv, (a, b) -> Integer.compare(a[0], b[0]));
List<int[]> res = new ArrayList<>();
for (int[] cur : iv) {
    if (res.isEmpty() || res.get(res.size() - 1)[1] < cur[0]) res.add(cur);
    else res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], cur[1]);
}` },
    bs: { name: 'Binary Search (on index)', icon: '🔍', cues: ['sorted input', 'first / last position', 'rotated array', 'O(log n) required'], code: `int lo = 0, hi = n - 1, ans = n;      // lower bound
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] >= x) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
}
return ans;` },
    bsa: { name: 'Binary Search on Answer', icon: '🎯', cues: ['minimise the maximum', 'maximise the minimum', 'smallest speed / capacity / days', '"is X feasible?" is monotonic'], code: `long lo = minAnswer, hi = maxAnswer, ans = -1;
while (lo <= hi) {
    long mid = lo + (hi - lo) / 2;
    if (feasible(mid)) { ans = mid; hi = mid - 1; }  // minimise
    else lo = mid + 1;
}` },
    mat: { name: 'Matrix Traversal', icon: '🧮', cues: ['spiral', 'rotate', 'transpose', 'mark rows / columns'], code: `int top = 0, bottom = m - 1, left = 0, right = n - 1;
while (top <= bottom && left <= right) {
    for (int j = left; j <= right; j++) out.add(g[top][j]);   top++;
    for (int i = top; i <= bottom; i++) out.add(g[i][right]); right--;
    if (top <= bottom) { for (int j = right; j >= left; j--) out.add(g[bottom][j]); bottom--; }
    if (left <= right) { for (int i = bottom; i >= top; i--) out.add(g[i][left]); left++; }
}` },
    ll: { name: 'Linked List Surgery', icon: '🔗', cues: ['reverse (part of) a list', 'reorder links', 'merge lists', 'delete nodes'], code: `ListNode prev = null, curr = head;
while (curr != null) {
    ListNode next = curr.next;  // save first!
    curr.next = prev;
    prev = curr;
    curr = next;
}
return prev;  // tip: a dummy node simplifies head changes` },
    stk: { name: 'Stack (matching & parsing)', icon: '🥞', cues: ['brackets', 'most recent unmatched', 'evaluate / convert expressions', 'undo'], code: `Deque<Character> st = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else if (st.isEmpty() || !matches(st.pop(), c)) return false;
}
return st.isEmpty();` },
    mono: { name: 'Monotonic Stack', icon: '📈', cues: ['next greater / smaller element', 'stock span', 'histogram area', 'contribution of each element'], code: `int[] nge = new int[n];
Deque<Integer> st = new ArrayDeque<>();
for (int i = n - 1; i >= 0; i--) {
    while (!st.isEmpty() && st.peek() <= a[i]) st.pop();
    nge[i] = st.isEmpty() ? -1 : st.peek();
    st.push(a[i]);
}` },
    rec: { name: 'Recursion Basics', icon: '🌀', cues: ['problem defined in terms of a smaller self', 'trees / divide & conquer'], code: `int f(int n) {
    if (n <= 1) return n;          // base case
    return f(n - 1) + f(n - 2);    // smaller sub-problems
}` },
    pick: { name: 'Pick / Not-pick Recursion', icon: '🌳', cues: ['all subsets / subsequences', 'count ways', 'does a subset with sum K exist?'], code: `void f(int i, List<Integer> path) {
    if (i == n) { res.add(new ArrayList<>(path)); return; }
    path.add(a[i]);  f(i + 1, path);          // pick
    path.remove(path.size() - 1);
    f(i + 1, path);                            // don't pick
}` },
    bt: { name: 'Backtracking', icon: '♟️', cues: ['all permutations / combinations', 'N-Queens, Sudoku', 'word search', 'place under constraints'], code: `void solve(State s) {
    if (isGoal(s)) { record(s); return; }
    for (Choice c : choices(s)) {
        if (!valid(s, c)) continue;
        apply(s, c);
        solve(s);
        undo(s, c);   // the "back" in backtracking
    }
}` },
    dc: { name: 'Divide & Conquer', icon: '✂️', cues: ['split in halves', 'merge sort', 'count inversions / reverse pairs'], code: `void sort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    sort(a, lo, mid);
    sort(a, mid + 1, hi);
    merge(a, lo, mid, hi);   // count cross pairs here
}` },
    bit: { name: 'Bit Tricks', icon: '💡', cues: ['pairs cancel (XOR)', 'subsets as masks', 'power of two', 'O(1) extra space puzzles'], code: `boolean set = ((n >> i) & 1) == 1;
n &= (n - 1);          // clear lowest set bit
int low = n & -n;      // isolate lowest set bit
for (int mask = 0; mask < (1 << k); mask++) { /* subset */ }` },
    heap: { name: 'Heap / Top-K', icon: '⛰️', cues: ['k-th largest / smallest', 'top k frequent', 'merge k sorted', 'running median'], code: `PriorityQueue<Integer> pq = new PriorityQueue<>();   // min-heap
for (int x : nums) {
    pq.offer(x);
    if (pq.size() > k) pq.poll();
}
return pq.peek();   // k-th largest` },
    greedy: { name: 'Greedy', icon: '🪙', cues: ['minimum number of …', 'scheduling', 'sort then take the best local choice'], code: `Arrays.sort(meetings, (a, b) -> Integer.compare(a[1], b[1])); // by end
int count = 0, lastEnd = Integer.MIN_VALUE;
for (int[] m : meetings)
    if (m[0] > lastEnd) { count++; lastEnd = m[1]; }` },
    tdfs: { name: 'Tree DFS (return info upward)', icon: '🌲', cues: ['height / depth', 'diameter', 'path sums', 'balanced?', 'LCA'], code: `int height(TreeNode node) {
    if (node == null) return 0;
    int l = height(node.left), r = height(node.right);
    best = Math.max(best, l + r);      // e.g. diameter
    return 1 + Math.max(l, r);
}` },
    tbfs: { name: 'Tree BFS (level order)', icon: '🪜', cues: ['level by level', 'left / right / top views', 'zigzag', 'width'], code: `Queue<TreeNode> q = new ArrayDeque<>();
q.offer(root);
while (!q.isEmpty()) {
    int size = q.size();             // one level
    for (int i = 0; i < size; i++) {
        TreeNode cur = q.poll();
        if (cur.left != null) q.offer(cur.left);
        if (cur.right != null) q.offer(cur.right);
    }
}` },
    bstp: { name: 'BST Property', icon: '🧭', cues: ['the input is a BST', 'sorted order', 'k-th smallest', 'validate / search / insert'], code: `TreeNode search(TreeNode node, int key) {
    while (node != null && node.val != key)
        node = key < node.val ? node.left : node.right;
    return node;
}` },
    gbfs: { name: 'Graph BFS (multi-source)', icon: '🌊', cues: ['shortest steps (unweighted)', 'spreading from many sources', 'levels / minutes'], code: `Queue<int[]> q = new ArrayDeque<>();   // offer ALL sources first
while (!q.isEmpty()) {
    int[] cur = q.poll();
    for (int[] d : dirs) {
        int r = cur[0] + d[0], c = cur[1] + d[1];
        if (r < 0 || c < 0 || r >= m || c >= n || seen[r][c]) continue;
        seen[r][c] = true;              // mark when you ENQUEUE
        q.offer(new int[]{r, c});
    }
}` },
    gdfs: { name: 'Graph DFS / Flood Fill', icon: '🕸️', cues: ['connected components', 'islands', 'cycle detection', 'reachability'], code: `void dfs(int u) {
    seen[u] = true;
    for (int v : adj.get(u))
        if (!seen[v]) dfs(v);
}
// components = number of times dfs() starts from an unseen node` },
    topo: { name: 'Topological Sort', icon: '📋', cues: ['prerequisites', 'ordering with dependencies', 'DAG', 'detect a directed cycle'], code: `int[] indeg = new int[n];
for (int u = 0; u < n; u++) for (int v : adj.get(u)) indeg[v]++;
Queue<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
    int u = q.poll(); order.add(u);
    for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
}
// order.size() < n  ⇒  cycle` },
    sp: { name: 'Shortest Paths', icon: '🛣️', cues: ['weighted graph', 'minimum cost / time / effort', 'within k stops'], code: `int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE); dist[src] = 0;
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
pq.offer(new int[]{0, src});
while (!pq.isEmpty()) {
    int[] cur = pq.poll(); int d = cur[0], u = cur[1];
    if (d > dist[u]) continue;                 // stale entry
    for (int[] e : adj.get(u))
        if (d + e[1] < dist[e[0]]) {
            dist[e[0]] = d + e[1];
            pq.offer(new int[]{dist[e[0]], e[0]});
        }
}` },
    dsu: { name: 'Disjoint Set Union', icon: '🤝', cues: ['are these connected?', 'merge groups', 'redundant edge', "Kruskal's MST"], code: `int find(int x) {
    return parent[x] == x ? x : (parent[x] = find(parent[x]));
}
boolean union(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (size[a] < size[b]) { int t = a; a = b; b = t; }
    parent[b] = a; size[a] += size[b];
    return true;
}` },
    mst: { name: 'Minimum Spanning Tree', icon: '🌉', cues: ['connect everything at minimum cost'], code: `// Kruskal: sort edges by weight, add an edge if union(u, v) succeeds.
// Prim:    min-heap of (weight, node), grow from any start node.` },
    dp1: { name: '1D Dynamic Programming', icon: '🧩', cues: ['number of ways', 'min / max cost to reach i', 'a choice at every step'], code: `int prev2 = 0, prev1 = 0;            // dp[i-2], dp[i-1]
for (int x : nums) {
    int cur = Math.max(prev1, prev2 + x); // House Robber
    prev2 = prev1;
    prev1 = cur;
}
return prev1;` },
    dp2: { name: 'Grid / 2D DP', icon: '🗺️', cues: ['paths in a grid', 'triangle', 'falling path', 'min path sum'], code: `int[][] dp = new int[m][n];
for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++) {
        if (i == 0 && j == 0) { dp[i][j] = g[0][0]; continue; }
        int up = i > 0 ? dp[i-1][j] : Integer.MAX_VALUE;
        int left = j > 0 ? dp[i][j-1] : Integer.MAX_VALUE;
        dp[i][j] = g[i][j] + Math.min(up, left);
    }` },
    dps: { name: 'Knapsack / Subsequence DP', icon: '🎒', cues: ['subset sum', 'partition', 'target sum', 'coin change'], code: `boolean[] dp = new boolean[target + 1];
dp[0] = true;
for (int x : nums)
    for (int t = target; t >= x; t--)   // 0/1: go DOWN (unbounded: go up)
        dp[t] |= dp[t - x];` },
    dpstr: { name: 'DP on Strings (LCS family)', icon: '🧵', cues: ['two strings', 'edit / convert / match', 'common subsequence'], code: `int[][] dp = new int[n + 1][m + 1];
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
            ? 1 + dp[i - 1][j - 1]
            : Math.max(dp[i - 1][j], dp[i][j - 1]);` },
    dpst: { name: 'State-machine DP (Stocks)', icon: '📉', cues: ['buy / sell', 'cooldown', 'at most k transactions'], code: `int hold = -prices[0], free = 0;
for (int i = 1; i < n; i++) {
    int newHold = Math.max(hold, free - prices[i]);
    int newFree = Math.max(free, hold + prices[i]);
    hold = newHold; free = newFree;
}
return free;` },
    lis: { name: 'Longest Increasing Subsequence', icon: '🪜', cues: ['increasing subsequence', 'chains', 'nested envelopes'], code: `List<Integer> tails = new ArrayList<>();
for (int x : nums) {
    int i = Collections.binarySearch(tails, x);
    if (i < 0) i = -(i + 1);
    if (i == tails.size()) tails.add(x); else tails.set(i, x);
}
return tails.size();` },
    dpp: { name: 'Partition / Interval DP', icon: '🪚', cues: ['matrix chain', 'burst balloons', 'cut a stick', 'palindrome partitioning'], code: `for (int i = n - 1; i >= 1; i--)
    for (int j = i + 1; j < n; j++) {
        dp[i][j] = Integer.MAX_VALUE;
        for (int k = i; k < j; k++)
            dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost(i, k, j));
    }` },
    trie: { name: 'Trie', icon: '🌐', cues: ['prefixes', 'dictionary of words', 'autocomplete', 'maximum XOR'], code: `class Node { Node[] next = new Node[26]; boolean end; }
void insert(String w) {
    Node cur = root;
    for (char c : w.toCharArray()) {
        if (cur.next[c - 'a'] == null) cur.next[c - 'a'] = new Node();
        cur = cur.next[c - 'a'];
    }
    cur.end = true;
}` },
    strm: { name: 'String Matching (KMP / Z / Hash)', icon: '🧠', cues: ['find a pattern in O(n + m)', 'prefix that is also a suffix', 'repeated substrings'], code: `int[] lps = new int[m];
for (int i = 1, len = 0; i < m; ) {
    if (p.charAt(i) == p.charAt(len)) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
}` },
    str: { name: 'String Manipulation', icon: '🔤', cues: ['build / reverse / split strings'], code: `StringBuilder sb = new StringBuilder();
for (String w : s.trim().split("\\\\s+")) sb.insert(0, w + " ");
return sb.toString().trim();` },
    math: { name: 'Math & Number Theory', icon: '➗', cues: ['digits', 'gcd / primes / divisors', 'modular power'], code: `int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
long power(long b, long e, long mod) {
    long r = 1; b %= mod;
    while (e > 0) { if ((e & 1) == 1) r = r * b % mod; b = b * b % mod; e >>= 1; }
    return r;
}` },
    sort: { name: 'Sorting', icon: '🃏', cues: ['order first, then the problem becomes easy'], code: `Arrays.sort(arr);                                   // primitives
Arrays.sort(objs, (a, b) -> Integer.compare(a.x, b.x)); // custom
Collections.sort(list, Collections.reverseOrder());` },
    design: { name: 'Design a Data Structure', icon: '🏗️', cues: ['implement X with O(1) operations', 'caches', 'iterators'], code: `class LRUCache {
    Map<Integer, Node> map = new HashMap<>();
    Node head = new Node(0, 0), tail = new Node(0, 0); // dummies
    // get: move to front · put: insert front, evict tail.prev
}` },
    basics: { name: 'Basics', icon: '🧱', cues: ['loops, conditions, arrays'], code: `for (int i = 0; i < n; i++) {
    // one pass, track what you need
}` },
  };

})();
