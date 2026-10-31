/* The Journey: one linear path that interleaves Babbar's Java DSA Series lectures with
   Striver A2Z problems (on LeetCode wherever possible). Sections → Units → Lessons → Items.
   Item refs: "v:<youtubeId>" (video) · "p:<problemId>" (problem / theory). A trailing "?" = optional. */
(function () {
  const D = (window.DQ_DATA = window.DQ_DATA || {});
  const P = D.problems || {};
  const refMap = {};
  for (const id in P) if (P[id].ref) refMap[P[id].ref] = id;
  const lecMap = {};
  ((D.playlist && D.playlist.videos) || []).forEach(v => { if (v.lec != null) lecMap[v.lec] = v.id; });

  const B = (n, opt) => (lecMap[n] ? 'v:' + lecMap[n] + (opt ? '?' : '') : null);
  const S = (id, opt) => 'v:' + id + (opt ? '?' : '');
  const p = (x, opt) => {
    const id = /^[a-z0-9]+\.\d+\.\d+$/.test(x) ? refMap[x] : x;
    if (!id || !P[id]) { console.warn('[curriculum] unknown problem', x); return null; }
    return 'p:' + id + (opt ? '?' : '');
  };
  const many = (prefix, idxs, opt) => idxs.map(i => p(prefix + i, opt));
  const L = (title, items, extra) => Object.assign({ title, items: items.filter(Boolean) }, extra || {});
  const boss = (...ids) => ids.map(x => p(x)).filter(Boolean);

  // Striver videos used as lesson items (title, seconds)
  D.striverVideos = {
    'yVdKa8dnKiE': ['Re 1. Introduction to Recursion', 1366],
    'un6PLygfXrA': ['Re 2. Problems on Recursion', 1324],
    '69ZCDFy-OUo': ['Re 3. Parameterised and Functional Recursion', 1094],
    'kvRjNm4rVBE': ['Re 5. Multiple Recursion Calls', 1005],
    'KEs5UyBJ39g': ['Hashing | Maps | Time Complexity | Collisions', 3606],
    'qQd-ViW7bfk': ['L1. Introduction to Bit Manipulation', 2343],
    'nttpF8kwgd4': ['L2. Must Know Tricks in Bit Manipulation', 2505],
    'eQCS_v3bw0Q': ['L7. All Kinds of Patterns in Recursion', 2052],
    'jXu-H7XuClE': ['L23. Merge Two Sorted Linked Lists', 1135],
    'tqQ5fTamIN4': ['L1. Introduction to Stack and Queue', 3906],
    '4pIc9UBHJtk': ['L3. Prefix, Infix and Postfix Conversion', 3047],
    '1_5VuquLbXg': ['L8. Trapping Rainwater', 1738],
    '9kdHxplyl5I': ['L1. Introduction to Sliding Window and 2 Pointers', 2215],
    '_ANrF3FJm7I': ['L1. Introduction to Trees', 590],
    'M3_pLsDdeuU': ['G-1. Introduction to Graph', 823],
    'tyB0ztf0DNY': ['DP 1. Introduction to Dynamic Programming', 2031],
    'dBGUmUQhjaM': ['L1. Implement Trie', 1885],
    'aBxjDBC4M1U': ['G-46. Disjoint Set (Union by Rank / Size)', 2535],
  };

  D.journey = [
    // ───────────────────────────── SECTION 0
    {
      id: 's0', title: 'Base Camp', sub: 'Java basics, patterns, maths, basic recursion & hashing: already conquered', color: 'green',
      units: [
        {
          id: 'u-basics', title: 'Java & Basics', icon: '🏕️', cleared: true,
          desc: 'You finished all 30 basics on your old tracker. These lectures are here only if you want a refresher.',
          lessons: [
            L('How Java runs', [B(0, 1), B(1, 1), B(2, 1), B(3, 1), B(4, 1), p('basics.0.0'), p('basics.0.1')]),
            L('Variables, types & operators', [B(5, 1), B(6, 1), B(7, 1), B(8, 1), p('basics.0.4')]),
            L('Conditionals & loops', [B(9, 1), B(10, 1), p('basics.0.2'), p('basics.0.3'), p('basics.0.5'), p('basics.0.6')]),
            L('Pattern printing', [B(11, 1), p('basics.1.0')]),
            L('Methods, arrays & strings', [B(12, 1), B(13, 1), B(14, 1), p('basics.0.7')]),
            L('Basic maths', [B(15, 1), ...many('basics.3.', [0, 1, 2, 3, 4, 5, 6])]),
            L('Basic recursion', [S('yVdKa8dnKiE', 1), S('un6PLygfXrA', 1), S('69ZCDFy-OUo', 1), S('kvRjNm4rVBE', 1), ...many('basics.4.', [0, 1, 2, 3, 4, 5, 6, 7, 8])]),
            L('Basic hashing & complexity', [S('KEs5UyBJ39g', 1), p('basics.5.0'), p('basics.5.1'), p('basics.0.8'), p('basics.2.0'), p('basics.2.1')]),
          ],
          guide: {
            keys: ['int overflows silently past ~2.1e9: reach for long early.', 'Strings are immutable: build them with StringBuilder.', 'Every recursion = base case + a smaller sub-problem.', 'HashMap.getOrDefault(k, 0) + 1 is the frequency-count idiom.'],
            java: ['Scanner is slow for big input: BufferedReader + StringTokenizer is faster.', 'Integer objects compare with .equals(), not == (the cache only covers −128..127).'],
          },
        },
        {
          id: 'u-arr1', title: 'Arrays I · Easy', icon: '🧺', cleared: true,
          desc: 'All the easy array problems are done on your old tracker. They will come back as spaced reviews so they stay sharp.',
          lessons: [
            L('Find & check', [p('arr.0.0'), p('arr.0.1'), p('arr.0.2'), p('arr.0.7')]),
            L('Rotate & move', [p('arr.0.3'), p('arr.0.4'), p('arr.0.5'), p('arr.0.6')]),
            L('Union, missing & single', [p('arr.0.8'), p('arr.0.9'), p('arr.0.10'), p('arr.0.13')]),
            L('Longest subarray with sum K', [p('arr.0.11')]),
          ],
          guide: {
            keys: ['Most easy array problems are one pass with one or two variables.', 'Rotation by d: reverse three times.', 'Missing / single number: sum formula or XOR.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 1
    {
      id: 's1', title: 'Java Power-ups & Arrays', sub: 'Complexity, Collections, then finish Arrays fast', color: 'blue',
      units: [
        {
          id: 'u-toolkit', title: 'Java Toolkit: Complexity & Collections', icon: '🧰',
          desc: 'Big-O properly, then the Collections you will use in every single problem from here on.',
          lessons: [
            L('Time & space complexity', [B(22), p('contains-duplicate')]),
            L('Collections I: List, ArrayList, iterators', [B(23), p('first-unique-character-in-a-string')]),
            L('Collections II: Set, Map, Queue', [B(24), p('group-anagrams')]),
            L('Collections III: Deque, PriorityQueue, TreeMap', [B(25)]),
          ],
          boss: boss('contains-duplicate-ii', 'ransom-note'),
          guide: {
            keys: ['O(1): HashMap get/put, ArrayList get, ArrayDeque push/pop.', 'O(log n): PriorityQueue offer/poll, TreeMap get/put/floorKey.', 'n ≤ 10^5 usually means you need O(n log n) or better.', 'Rough budget: about 10^8 simple operations per second.'],
            java: ['Use ArrayDeque for stacks and queues: the old Stack class is synchronised and slow.', 'Comparator: use Integer.compare(a, b), never a − b (it can overflow).', 'map.merge(k, 1, Integer::sum) counts in one line.'],
            traps: ['Changing a collection while a for-each loop is iterating it → ConcurrentModificationException.', 'list.remove(int) removes by index, list.remove(Integer.valueOf(x)) removes by value.'],
          },
        },
        {
          id: 'u-arr2', title: 'Arrays II · Medium', icon: '🧮',
          desc: 'Two pointers, prefix sums, Kadane and matrix moves: the backbone of OA questions.',
          lessons: [
            L('Warm-up refresher (you have solved these)', [B(27, 1), B(28, 1), B(29), p('sort-0s-and-1s')], { note: 'L27-L28 revisit problems you already solved: skim at 1.5× or skip.' }),
            L('Two pointers & hashing', [B(30), p('arr.1.0'), p('first-repeating-element'), p('arr-lsk-negatives'), p('subarray-sum-equals-k')]),
            L('Dutch flag & majority vote', [B(31), p('find-all-numbers-disappeared-in-an-array'), p('arr.1.1'), p('arr.1.2')]),
            L("Kadane's algorithm", [B(32), p('arr.1.3'), p('arr.1.4'), p('arr.1.5')]),
            L('Rearrange & permute', [p('arr.1.6'), p('arr.1.7'), p('arr.1.8'), p('arr.1.9')]),
            L('Matrix moves', [B(33), p('transpose-matrix'), B(34), p('arr.1.10'), p('arr.1.11'), p('arr.1.12')]),
          ],
          boss: boss('product-of-array-except-self', 'container-with-most-water'),
          story: 'kadane',
          guide: {
            keys: ['Sorted + pair / triplet → two pointers.', 'Subarray sum = K (with negatives) → prefix sum + HashMap.', 'Maximum subarray → Kadane: extend or restart.', 'Three groups in one pass → Dutch National Flag (low / mid / high).', 'Rotate 90° = transpose + reverse each row.'],
            java: ['int[][] grid; grid.length = rows, grid[0].length = columns.', 'Arrays.fill(arr, -1) and Arrays.sort(arr) are your friends.'],
            traps: ['Moving mid forward after swapping with high in the Dutch flag: don\'t.', 'Spiral: check top <= bottom and left <= right before the 3rd and 4th sides.'],
          },
        },
        {
          id: 'u-arr3', title: 'Arrays III · Hard', icon: '🏔️',
          desc: 'The classic interview hards: 3Sum / 4Sum, prefix XOR, intervals and the "missing & repeating" family.',
          lessons: [
            L("Pascal's triangle & majority II", [p('arr.2.0'), p('arr.2.1')]),
            L('3Sum & 4Sum', [p('arr.2.2'), p('arr.2.3')]),
            L('Prefix-sum tricks', [p('arr.2.4'), p('arr.2.5')]),
            L('Intervals & merging', [p('arr.2.6'), p('arr.2.7')]),
            L('Missing, repeating & products', [p('arr.2.8'), p('arr.2.11')]),
          ],
          boss: boss('first-missing-positive', 'increasing-triplet-subsequence'),
          story: 'boyer-moore',
          guide: {
            keys: ['k-Sum = sort + fix (k − 2) indices + two pointers.', 'Prefix XOR works exactly like prefix sum: xr ^ k seen before ⇒ a subarray with XOR k.', 'Intervals: sort by start, then compare with the last merged end.'],
            traps: ['4Sum targets overflow int: compute in long.', 'Skip duplicates AFTER you process an element, or you lose valid triplets.'],
          },
        },
        {
          id: 'u-sort', title: 'Sorting Basics', icon: '🃏',
          desc: 'The three O(n²) sorts: know them cold, then let Arrays.sort do the work.',
          lessons: [
            L('Selection, bubble & insertion sort', [B(35), p('sort.0.0'), p('sort.0.1'), p('sort.0.2')]),
          ],
          boss: boss('largest-number', 'squares-of-a-sorted-array'),
          story: 'timsort',
          guide: {
            keys: ['Selection: fewest swaps. Bubble: stops early on sorted input. Insertion: best for nearly-sorted data.', 'Stable sort = equal elements keep their order (insertion & merge are stable; selection isn\'t).'],
            java: ['Arrays.sort(int[]) is dual-pivot quicksort; sorting objects uses TimSort (stable).', 'Sort descending: Integer[] + Collections.reverseOrder(), or sort then reverse.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 2
    {
      id: 's2', title: 'Binary Search', sub: 'From finding X to searching the answer space', color: 'purple',
      units: [
        {
          id: 'u-bs1', title: 'Binary Search · 1D', icon: '🔍',
          desc: 'One template, every variant: bounds, occurrences, rotations and peaks.',
          lessons: [
            L('Binary search in one video', [B(36), p('bs.0.0')]),
            L('Bounds & occurrences', [B(37), p('bs.0.1'), p('bs.0.2'), p('bs.0.3'), p('floor-ceil-sorted-array'), p('bs.0.5'), p('bs.0.6')]),
            L('Mountains & peaks', [B(38), p('peak-index-in-a-mountain-array'), p('bs.0.7')]),
            L('Rotated arrays', [B(39), p('bs.0.8'), p('bs.0.9'), p('bs.0.10'), p('bs.0.13')]),
            L('Special searches', [B(46), p('search-in-nearly-sorted-array'), B(47), p('bs.0.11'), B(50), p('search-in-a-sorted-array-of-unknown-size', 1)]),
          ],
          boss: boss('find-in-mountain-array', 'successful-pairs-of-spells-and-potions'),
          story: 'bs-bug',
          guide: {
            keys: ['Decide the invariant first: what is always true about lo and hi?', 'Lower bound = first index with a[i] ≥ x; upper bound = first with a[i] > x.', 'Rotated array: one half is always sorted, so check whether the target lives there.', 'Peak: compare mid with mid + 1 and walk uphill.'],
            java: ['mid = lo + (hi − lo) / 2, never (lo + hi) / 2.', 'Collections.binarySearch / Arrays.binarySearch return −(insertionPoint) − 1 when not found.'],
            traps: ['Infinite loop: lo = mid with while (lo < hi) and a floor mid.', 'Returning lo vs hi: dry-run a 2-element array before you submit.'],
          },
        },
        {
          id: 'u-bs2', title: 'Binary Search on Answers', icon: '🎯',
          desc: 'When the answer is a number in a range and "is X feasible?" is monotonic, binary search the answer.',
          lessons: [
            L('The pattern', [B(40), p('bs.2.0'), p('bs.2.1')]),
            L('Rates & capacities', [p('bs.2.2'), p('bs.2.3'), p('bs.2.4'), p('bs.2.5'), p('bs.2.10')]),
            L('Min-max allocation', [B(41), p('bs.2.8'), B(42), p('painters-partition'), p('bs.2.9')]),
            L('Max-min placement', [B(43), p('bs.2.7'), B(44), p('eko-spoj'), B(45), p('roti-prata-spoj')]),
            L('The hard ones', [p('bs.2.11'), p('bs.2.6'), p('bs.0.12')]),
          ],
          boss: boss('minimum-time-to-complete-trips', 'minimized-maximum-of-products-distributed-to-any-store'),
          guide: {
            keys: ['Keywords: "minimise the maximum", "maximise the minimum", "smallest speed / capacity / days".', 'Write isPossible(x) first; it is usually a greedy O(n) simulation.', 'Search space: [lowest sensible answer, highest sensible answer].'],
            traps: ['Sums of pages / weights overflow int: use long.', 'Using the wrong half: if x works and you want the minimum, go left (hi = mid − 1) and record x.'],
          },
        },
        {
          id: 'u-bs3', title: 'Binary Search on 2D', icon: '🗺️',
          desc: 'Matrices are just arrays with an extra index.',
          lessons: [
            L('Searching matrices', [B(48), p('arr.0.14'), p('search-a-2d-matrix-ii'), B(49), p('arr.0.15')]),
            L('Peaks & medians', [p('bs.1.1'), p('bs.1.2')]),
          ],
          boss: boss('kth-smallest-element-in-a-sorted-matrix'),
          guide: {
            keys: ['Fully sorted matrix → flatten it: row = mid / cols, col = mid % cols.', 'Rows and columns sorted → staircase search from the top-right corner.', 'Median in a matrix → binary search the value and count elements ≤ mid.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 3
    {
      id: 's3', title: 'Strings', sub: 'Frequency tables, two pointers and parsing', color: 'pink',
      units: [
        {
          id: 'u-str', title: 'Strings · Easy → Medium', icon: '🔤',
          desc: 'Most string problems are arrays of characters plus a frequency table.',
          lessons: [
            L('Easy strings (6 of 7 already done)', [B(51), p('str.0.1'), p('str.0.0'), p('str.0.2'), p('str.0.3'), p('str.0.5'), p('str.0.6'), p('str.0.4')]),
            L('Frequency tricks', [B(52), p('permutation-in-string'), p('str.1.0')]),
            L('Compression & parsing', [B(53), p('string-compression'), p('str.1.1'), p('str.1.2'), p('str.1.3')]),
            L('Substrings', [p('str.1.4'), p('str.1.5'), p('str.1.6'), p('str.1.7')]),
          ],
          boss: boss('zigzag-conversion', 'minimum-number-of-steps-to-make-two-strings-anagram'),
          guide: {
            keys: ['int[26] beats HashMap for lowercase letters.', '"Exactly K" = atMost(K) − atMost(K − 1).', 'Palindromes: expand around 2n − 1 centres.'],
            java: ['s.charAt(i) − \'a\' gives the 0-25 index.', 'Build strings with StringBuilder (s += in a loop is O(n²)).', 'String.valueOf(charArray) and s.toCharArray() to switch between forms.'],
            traps: ['Comparing strings with == compares references: use .equals().', 'atoi: check overflow BEFORE multiplying by 10.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 4
    {
      id: 's4', title: 'Recursion & Backtracking', sub: 'Trust the function, then learn to undo choices', color: 'orange',
      units: [
        {
          id: 'u-rec1', title: 'Recursion Foundations', icon: '🌀',
          desc: 'How the call stack works, recursive complexity, and your first "strong hold" problems.',
          lessons: [
            L('How recursion really works', [B(54), B(55)]),
            L('First recursive problems', [B(56), p('climbing-stairs-rec'), B(57), B(58), p('binary-search-rec')]),
            L('Strong hold', [p('rec.0.0'), p('rec.0.1'), p('rec.0.2')]),
          ],
          boss: boss('k-th-symbol-in-grammar', 'find-the-winner-of-the-circular-game'),
          story: 'hanoi',
          guide: {
            keys: ['Write the base case first, then assume f(n − 1) already works.', 'Time of recursion ≈ (number of calls) × (work per call).', 'Recursion depth costs O(depth) stack space.'],
            java: ['The default Java stack handles roughly 10^4 deep calls: deeper needs iteration.'],
            traps: ['Missing or wrong base case → StackOverflowError.', 'Pow(x, n): −Integer.MIN_VALUE overflows, so convert n to long first.'],
          },
        },
        {
          id: 'u-dc', title: 'Divide & Conquer Sorting', icon: '✂️',
          desc: 'Merge sort and quick sort, and how merge sort secretly counts inversions.',
          lessons: [
            L('Merge sort', [B(75), p('sort.1.0'), p('sort.1.1'), p('sort.1.2')]),
            L('Counting with merge sort', [B(76), p('arr.2.9'), p('arr.2.10')]),
            L('Quick sort', [B(77), p('sort.1.3')]),
          ],
          boss: boss('count-of-smaller-numbers-after-self', 'maximum-subarray-dc'),
          story: 'quicksort',
          guide: {
            keys: ['Merge sort: O(n log n) always, O(n) extra space, stable.', 'Quick sort: O(n log n) average, O(n²) worst, in-place.', 'Inversions / reverse pairs: count while merging, because both halves are sorted.'],
            traps: ['Count reverse pairs BEFORE merging, with 2L * a[j] to avoid overflow.'],
          },
        },
        {
          id: 'u-subseq', title: 'Subsequences & Subsets', icon: '🌳',
          desc: 'Pick / not-pick: the single idea behind subsets, combination sums and permutations.',
          lessons: [
            L('Pick or not pick', [B(59), S('eQCS_v3bw0Q', 1), p('rec.1.2'), p('rec.1.3'), p('rec.1.0'), p('rec.1.1')]),
            L('Sum K', [B(67), p('rec.1.4'), p('rec.1.5')]),
            L('Subsets', [B(68), p('rec.1.9'), p('rec.1.10')]),
            L('The combination sum family', [B(69), p('rec.1.6'), p('rec.1.7'), p('rec.1.8')]),
            L('Permutations & phone keypad', [B(70), p('permutations'), B(72), p('rec.1.11')]),
          ],
          boss: boss('non-decreasing-subsequences', 'maximum-length-of-a-concatenated-string-with-unique-characters'),
          guide: {
            keys: ['Draw the recursion tree for n = 3 before coding.', 'Duplicates in input → sort + skip equal elements at the same level.', 'Print-one / count variants: return boolean / int instead of void.'],
            java: ['Add a COPY to the result: res.add(new ArrayList<>(path)).', 'path.remove(path.size() − 1) undoes the last choice.'],
          },
        },
        {
          id: 'u-recdp', title: 'Recursion → DP Preview', icon: '🔮',
          desc: "Babbar's 'choice' problems solved with pure recursion. You'll redo them with DP later: feel the TLE now.",
          lessons: [
            L('Robbers & coins', [B(60), p('house-robber-rec'), B(61), p('coin-change-ii-rec'), B(62), p('coin-change-rec')]),
            L('Subsets that balance', [B(63), p('partition-equal-subset-sum-rec'), B(64), p('minimize-the-difference-between-target-and-chosen-elements')]),
            L('Jumps & triangles', [B(65), p('jump-game-rec'), B(66), p('triangle-rec')]),
          ],
          boss: boss('n-th-tribonacci-number', 'solving-questions-with-brainpower'),
          story: 'bellman',
          guide: {
            keys: ['If the same arguments repeat in the recursion tree → overlapping sub-problems → memoise.', 'State = whatever changes between calls (index, remaining amount, …).'],
            traps: ['Expect TLE on big tests with pure recursion: that IS the lesson.'],
          },
        },
        {
          id: 'u-bt', title: 'Backtracking', icon: '♟️',
          desc: 'Choose → explore → un-choose. Mazes, queens, sudokus and partitions.',
          lessons: [
            L('Rat in a maze', [B(71), p('rec.2.3')]),
            L('Board games', [B(73), p('rec.2.2'), B(74), p('rec.2.6')]),
            L('Partitions & searches', [p('rec.2.0'), p('rec.2.1'), p('rec.2.4')]),
            L('Colouring & operators', [p('rec.2.5'), p('rec.2.7')]),
          ],
          boss: boss('restore-ip-addresses', 'permutations-ii'),
          story: 'nqueens',
          guide: {
            keys: ['Template: if (done) record; for (choice) { if (valid) { make; recurse; undo; } }', 'Prune early: check validity before recursing, not after.', 'N-Queens: boolean arrays for columns and both diagonals make checks O(1).'],
            traps: ['Forgetting to undo (unmark visited) → missing answers.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 5
    {
      id: 's5', title: 'Bits & Maths', sub: 'Think in binary', color: 'yellow',
      units: [
        {
          id: 'u-bits', title: 'Bit Manipulation', icon: '💡',
          desc: 'Operators, the five must-know tricks, XOR puzzles and number theory.',
          lessons: [
            L('Bitwise operators in Java', [B(26), S('qQd-ViW7bfk', 1), p('bit.0.0'), p('bit.0.1'), p('bit.0.2'), p('bit.0.3')]),
            L('Bit tricks', [S('nttpF8kwgd4', 1), p('bit.0.4'), p('bit.0.5'), p('bit.0.6'), p('bit.0.7')]),
            L('XOR interview problems', [p('bit.1.0'), p('bit.1.1'), p('bit.1.2'), p('bit.1.3'), p('bit.1.4')]),
            L('Number theory', [p('bit.2.0'), p('bit.2.1'), p('bit.2.2'), p('bit.2.3'), p('bit.2.4')]),
          ],
          boss: boss('counting-bits', 'minimum-flips-to-make-a-or-b-equal-to-c'),
          story: 'quake',
          guide: {
            keys: ['x & (x − 1) clears the lowest set bit; x & −x isolates it.', 'a ^ a = 0 and a ^ 0 = a → pairs cancel out.', 'Subsets of n items ↔ masks 0 … 2^n − 1.', 'Sieve: start crossing out from i·i.'],
            java: ['>>> is the unsigned right shift; >> keeps the sign.', 'Integer.bitCount(x), Integer.toBinaryString(x), Long versions too.'],
            traps: ['1 << 31 is negative in an int: use 1L << k for big shifts.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 6
    {
      id: 's6', title: 'OOP & Linked Lists', sub: 'Objects first, then pointer gymnastics', color: 'teal',
      units: [
        {
          id: 'u-oop', title: 'OOP in Java', icon: '🧱',
          desc: 'Classes, the four pillars and design thinking. You need these for Linked Lists, and for LLD rounds.',
          lessons: [
            L('Classes & objects', [B(16), B(17)]),
            L('Encapsulation & inheritance', [B(18), B(19)]),
            L('Polymorphism & abstraction', [B(20), B(21)]),
          ],
          boss: boss('design-parking-system', 'design-hashset'),
          guide: {
            keys: ['Encapsulation: private fields + public methods.', 'Inheritance = "is-a"; composition = "has-a" (prefer composition).', 'Polymorphism: overloading (compile time) vs overriding (run time).', 'Abstraction: abstract classes vs interfaces (Java 8+ interfaces can have default methods).'],
            java: ['Override equals() AND hashCode() together, or HashMap breaks.', 'Mark constants static final.'],
          },
        },
        {
          id: 'u-ll1', title: 'Linked List Basics', icon: '🔗',
          desc: 'Singly, doubly and circular lists from scratch.',
          lessons: [
            L('Singly linked list', [B(78), p('ll.0.0'), p('ll.0.1'), p('ll.0.2'), p('ll.0.3'), p('ll.0.4')]),
            L('Doubly linked list', [B(79), p('ll.1.0'), p('ll.1.1'), p('ll.1.2'), p('ll.1.3')]),
            L('Circular linked list', [B(80)]),
          ],
          boss: boss('remove-linked-list-elements', 'convert-binary-number-in-a-linked-list-to-integer'),
          story: 'ipl',
          guide: {
            keys: ['Draw boxes and arrows: every bug is a pointer you forgot to redirect.', 'A dummy node removes all "what if the head changes?" special cases.'],
            traps: ['Lost the rest of the list: save next BEFORE you change curr.next.', 'Null checks: curr != null vs curr.next != null decides where you stop.'],
          },
        },
        {
          id: 'u-ll2', title: 'Linked List Core Patterns', icon: '🐢',
          desc: 'Reverse, tortoise & hare, cycles, k-th from end, merging and list arithmetic.',
          lessons: [
            L('Reverse it', [B(81), p('ll.2.1'), p('ll.2.2')]),
            L('Tortoise & hare', [B(82), p('ll.2.0'), p('ll.2.9'), B(83), p('ll.2.6')]),
            L('Cycles', [B(84), p('ll.2.3'), B(97), p('ll.2.4'), p('ll.2.5')]),
            L('Deleting & k-th from the end', [B(86), p('remove-duplicates-from-sorted-list'), B(87), p('kth-node-from-end'), p('ll.2.8')]),
            L('Rearranging', [B(88), p('ll.2.7'), B(93), p('ll.2.11'), S('jXu-H7XuClE', 1), p('merge-two-sorted-lists'), p('ll.2.10')]),
            L('Arithmetic on lists', [B(90), p('ll.2.13'), B(96), p('ll.2.14'), B(91), p('ll.2.12')]),
          ],
          boss: boss('reorder-list', 'reverse-linked-list-ii'),
          story: 'floyd',
          guide: {
            keys: ['Middle / cycle / palindrome → slow & fast pointers.', 'k-th from end → move one pointer k steps ahead first.', 'Sort a list → merge sort (find middle, split, merge).'],
            traps: ['Even-length lists: decide which middle you want (fast.next != null && fast.next.next != null).'],
          },
        },
        {
          id: 'u-ll3', title: 'Linked List Advanced', icon: '🧬',
          desc: "Babbar's full LL problem set, doubly-linked tricks and the four hard classics.",
          lessons: [
            L("Babbar's LL set I", [B(89), p('merge-nodes-in-between-zeros'), B(92), p('ll.4.1'), B(94), p('swapping-nodes-in-a-linked-list'), B(95), p('delete-n-nodes-after-m-nodes')]),
            L("Babbar's LL set II", [B(98), p('partition-list'), B(99), p('split-linked-list-in-parts'), B(102), p('find-the-minimum-and-maximum-number-of-nodes-between-critical-points'), B(103), p('double-a-number-represented-as-a-linked-list')]),
            L('Doubly linked list problems', [p('ll.3.0'), p('ll.3.1'), p('ll.3.2')]),
            L('The hard classics', [B(100), p('ll.4.0'), B(101), p('flatten-a-multilevel-doubly-linked-list'), p('ll.4.2'), B(104), p('ll.4.3')]),
          ],
          boss: boss('remove-duplicates-from-sorted-list-ii', 'remove-zero-sum-consecutive-nodes-from-linked-list'),
          guide: {
            keys: ['Reverse in k-groups = "reverse a list" + careful re-linking of group tails.', 'Clone with random pointers: interleave copies, or HashMap<old, new>.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 7
    {
      id: 's7', title: 'Stacks & Queues', sub: 'LIFO, FIFO and the monotonic stack superpower', color: 'red',
      units: [
        {
          id: 'u-stack', title: 'Stack Fundamentals', icon: '🥞',
          desc: 'Implementing stacks, recursion on stacks, bracket problems and expression conversion.',
          lessons: [
            L('Stacks in Java', [B(105), p('sq.0.0'), p('sq.0.4'), B(109), p('sq.0.6')]),
            L('Recursion on stacks', [B(106), p('middle-of-stack'), p('insert-at-bottom-of-stack'), p('rec.0.4'), p('redundant-brackets'), B(107), p('check-stack-sorted'), B(108), p('insert-into-sorted-stack'), p('rec.0.3')]),
            L('Parentheses problems', [B(110), p('minimum-add-to-make-parentheses-valid'), B(111), p('str2.0.0'), B(112), p('longest-valid-parentheses'), B(113), p('remove-all-adjacent-duplicates-in-string')]),
            L('Parsing with stacks', [B(114), p('simplify-path'), B(115), p('decode-string'), p('sq.0.7')]),
            L('Expression conversions', [S('4pIc9UBHJtk'), p('sq.1.0'), p('sq.1.1'), p('sq.1.2'), p('sq.1.3'), p('sq.1.4'), p('sq.1.5')]),
          ],
          boss: boss('evaluate-reverse-polish-notation', 'validate-stack-sequences'),
          story: 'stack-history',
          guide: {
            keys: ['Matching / nesting / "most recent unmatched" → stack.', 'Recursion on a stack: pop, recurse, push back on the way up.', 'Infix → postfix: operands out, operators wait on the stack by precedence.'],
            java: ['Deque<Integer> st = new ArrayDeque<>(); push / pop / peek.', 'ArrayDeque does not allow null elements.'],
          },
        },
        {
          id: 'u-queue', title: 'Queues & Design', icon: '🎟️',
          desc: "Queue implementations, stack ↔ queue conversions and cache design (Striver's videos: Babbar's queue series isn't out yet).",
          lessons: [
            L('Queue basics', [S('tqQ5fTamIN4'), p('sq.0.1'), p('sq.0.5'), p('sq.0.2'), p('sq.0.3')]),
            L('Designing with stacks', [B(121), p('design-browser-history'), B(122), p('n-stacks-in-an-array')]),
            L('Caches', [p('sq.3.4'), p('sq.3.5')]),
          ],
          boss: boss('number-of-recent-calls', 'design-circular-deque'),
          guide: {
            keys: ['Queue via two stacks: amortised O(1) per operation.', 'LRU = HashMap + doubly linked list (O(1) get and put).', 'LFU = key → node, freq → list, plus minFreq.'],
            java: ['Queue<Integer> q = new ArrayDeque<>(); offer / poll / peek.', 'LinkedHashMap(cap, 0.75f, true) + removeEldestEntry gives a quick LRU, but interviewers want it by hand.'],
          },
        },
        {
          id: 'u-mono', title: 'Monotonic Stack', icon: '📈',
          desc: 'Next greater / smaller, spans, contributions and histograms.',
          lessons: [
            L('The pattern', [B(116), p('daily-temperatures'), B(124), p('sq.2.0'), p('sq.2.1'), p('sq.2.2'), p('sq.2.3')]),
            L('Spans & linked lists', [B(117), p('sq.2.6'), B(118), p('next-greater-node-in-linked-list')]),
            L('Greedy stacks', [B(119), p('sq.2.9'), B(123), p('sq.2.7'), B(120), p('sq.3.2')]),
            L('The contribution technique', [p('sq.2.5'), p('sq.2.8'), S('1_5VuquLbXg', 1), p('sq.2.4')]),
            L('Rectangles & windows', [B(125), p('sq.2.10'), B(126), p('sq.2.11'), p('sq.3.0')]),
          ],
          boss: boss('maximum-subarray-min-product', 'car-fleet'),
          guide: {
            keys: ['"Next greater / smaller" for every element → monotonic stack, O(n).', 'Store INDICES on the stack, not values: you usually need distances.', 'Histogram: for each bar, width = nextSmaller − prevSmaller − 1.'],
            traps: ['Duplicates in contribution problems: use < on one side and ≤ on the other.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 8
    {
      id: 's8', title: 'Sliding Window', sub: "Striver's videos from here on (until Babbar's series gets there)", color: 'cyan',
      units: [
        {
          id: 'u-sw', title: 'Sliding Window & Two Pointers', icon: '🪟',
          desc: 'Fixed windows, variable windows and the atMost(K) trick.',
          lessons: [
            L('Templates', [S('9kdHxplyl5I'), p('sw.0.0'), p('sw.0.1')]),
            L('At-most-K windows', [p('sw.0.2'), p('sw.0.3'), p('sw.1.0')]),
            L('Counting subarrays', [p('sw.0.4'), p('sw.0.5'), p('sw.0.6'), p('sw.1.1')]),
            L('Fixed & minimum windows', [p('sw.0.7'), p('sw.1.2'), p('sw.1.3')]),
          ],
          boss: boss('find-all-anagrams-in-a-string', 'minimum-size-subarray-sum'),
          guide: {
            keys: ['Longest window with a condition: expand right, shrink left while invalid.', 'Count subarrays with exactly K: atMost(K) − atMost(K − 1).', 'Only works with non-negative numbers for sum conditions: with negatives use prefix sums.'],
            traps: ['Update the answer at the right moment: after shrinking for "longest", while valid for "shortest".'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 9
    {
      id: 's9', title: 'Heaps & Greedy', sub: 'Always take the best next thing', color: 'amber',
      units: [
        {
          id: 'u-heap', title: 'Heaps', icon: '⛰️',
          desc: 'Build a heap by hand, then Top-K, merging, scheduling and running medians.',
          lessons: [
            L('Heap internals', [p('heap.0.0'), p('heap.0.1'), p('heap.0.2'), p('heap.0.3')]),
            L('Top-K', [p('heap.1.0'), p('heap.1.1'), p('heap.1.2'), p('heap.2.5'), p('heap.2.2')]),
            L('Merging & ranking', [p('heap.1.3'), p('heap.1.4'), p('heap.2.1'), p('heap.2.3')]),
            L('Scheduling & streams', [p('heap.1.5'), p('heap.1.6'), p('heap.2.0'), p('heap.2.4')]),
          ],
          boss: boss('k-closest-points-to-origin', 'reorganize-string', 'last-stone-weight'),
          story: 'heapsort',
          guide: {
            keys: ['K largest → min-heap of size K; K smallest → max-heap of size K.', 'Running median → two heaps with balanced sizes.', 'Building a heap from an array is O(n), not O(n log n).'],
            java: ['new PriorityQueue<>(Collections.reverseOrder()) for a max-heap.', 'PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));'],
          },
        },
        {
          id: 'u-greedy', title: 'Greedy', icon: '🪙',
          desc: 'Local best choices that provably lead to the global best.',
          lessons: [
            L('Easy greedies', [p('greedy.0.0'), p('greedy.0.2'), p('greedy.0.3'), p('greedy.0.1')]),
            L('Jumps & scheduling', [p('greedy.1.1'), p('greedy.1.2'), p('greedy.1.0'), p('greedy.1.3'), p('greedy.1.4')]),
            L('Intervals', [p('greedy.1.8'), p('greedy.1.10'), p('greedy.0.4')]),
            L('Classic greedy', [p('greedy.1.5'), p('greedy.1.6'), p('greedy.1.7')]),
          ],
          boss: boss('gas-station', 'partition-labels', 'minimum-number-of-arrows-to-burst-balloons'),
          story: 'huffman',
          guide: {
            keys: ['Sort first: most greedy proofs rely on an order.', 'Interval scheduling: sort by END time to fit the most intervals.', 'Try to break your greedy with a small counter-example before coding.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 10
    {
      id: 's10', title: 'Trees', sub: 'Recursion finally pays off', color: 'lime',
      units: [
        {
          id: 'u-tree1', title: 'Binary Tree Traversals', icon: '🌲',
          desc: 'Every traversal: recursive, iterative and level by level.',
          lessons: [
            L('Tree basics', [S('_ANrF3FJm7I'), p('bt.0.0'), p('bt.0.2'), p('bt.0.3')]),
            L('Recursive traversals', [p('bt.0.4'), p('bt.0.5'), p('bt.0.6')]),
            L('Level order', [p('bt.0.7')]),
            L('Iterative traversals', [p('bt.0.8'), p('bt.0.9'), p('bt.0.10'), p('bt.0.11'), p('bt.0.12')]),
          ],
          boss: boss('invert-binary-tree', 'average-of-levels-in-binary-tree'),
          guide: {
            keys: ['Recursive DFS: what does this function return for a null node?', 'BFS: size = q.size(), then loop exactly size times for one level.'],
          },
        },
        {
          id: 'u-tree2', title: 'Binary Trees · Medium', icon: '🌿',
          desc: 'Heights, diameters, path sums and the views of a tree.',
          lessons: [
            L('Height-based problems', [p('bt.1.0'), p('bt.1.1'), p('bt.1.2'), p('bt.1.3')]),
            L('Comparing trees', [p('bt.1.4'), p('bt.1.11')]),
            L('Traversal variants', [p('bt.1.5'), p('bt.1.6'), p('bt.1.7')]),
            L('Views of a tree', [p('bt.1.8'), p('bt.1.9'), p('bt.1.10')]),
          ],
          boss: boss('count-good-nodes-in-binary-tree', 'subtree-of-another-tree', 'path-sum'),
          guide: {
            keys: ['Return one thing upward (height) and update a global answer (diameter / max path).', 'Vertical / top / bottom views → BFS with column indices.'],
          },
        },
        {
          id: 'u-tree3', title: 'Binary Trees · Hard', icon: '🌳',
          desc: 'LCA, parent maps, constructing trees and Morris traversal.',
          lessons: [
            L('Paths & LCA', [p('bt.2.0'), p('bt.2.1'), p('bt.2.2')]),
            L('Parent maps', [p('bt.2.3'), p('bt.2.4'), p('bt.2.5'), p('bt.2.6')]),
            L('Building trees', [p('bt.2.7'), p('bt.2.8'), p('bt.2.9'), p('bt.2.10')]),
            L('Morris & flattening', [p('bt.2.11'), p('bt.2.12'), p('bt.2.13')]),
          ],
          boss: boss('delete-nodes-and-return-forest', 'binary-tree-cameras'),
          story: 'redblack',
          guide: {
            keys: ['"Distance K" / "burn the tree" → add parent pointers, then BFS like a graph.', 'Build from traversals → HashMap value → inorder index.'],
          },
        },
        {
          id: 'u-bst', title: 'Binary Search Trees', icon: '🧭',
          desc: 'Inorder is sorted: that one fact solves most BST problems.',
          lessons: [
            L('BST basics', [p('bst.0.0'), p('bst.0.1'), p('bst.0.2')]),
            L('Ceil, floor, insert & delete', [p('bst.1.0'), p('bst.1.1'), p('bst.1.2'), p('bst.1.3')]),
            L('Order statistics & validation', [p('bst.1.4'), p('bst.1.5'), p('bst.1.6')]),
            L('Construction & iterators', [p('bst.1.7'), p('bst.1.8'), p('bst.1.9')]),
            L('Hard BST problems', [p('bst.1.10'), p('bst.1.11'), p('bst.1.12')]),
          ],
          boss: boss('convert-sorted-array-to-binary-search-tree', 'trim-a-binary-search-tree'),
          guide: {
            keys: ['Search / insert / delete are O(height): O(log n) if balanced, O(n) if skewed.', 'Validate with (min, max) bounds, not just parent comparisons.'],
            java: ['TreeMap / TreeSet are balanced BSTs (red-black trees): floorKey, ceilingKey, headMap.'],
          },
        },
      ],
    },

    // ───────────────────────────── SECTION 11
    {
      id: 's11', title: 'Graphs', sub: 'BFS, DFS, topo sort, shortest paths, DSU', color: 'indigo',
      units: [
        {
          id: 'u-g1', title: 'Graph Basics & Traversals', icon: '🕸️',
          desc: 'Representations, BFS / DFS and grid flood fills.',
          lessons: [
            L('Learning graphs', [S('M3_pLsDdeuU'), p('graph.0.0'), p('graph.0.2'), p('graph.0.3'), p('graph.0.4'), p('graph.0.5')]),
            L('Components & islands', [p('graph.1.0'), p('graph.1.1'), p('graph.1.3')]),
            L('Multi-source BFS', [p('graph.1.2'), p('graph.1.6')]),
            L('Border DFS', [p('graph.1.7'), p('graph.1.8'), p('graph.1.11')]),
          ],
          boss: boss('max-area-of-island', 'clone-graph', 'keys-and-rooms'),
          story: 'konigsberg',
          guide: {
            keys: ['Grid = graph: neighbours are the 4 (or 8) directions.', 'Shortest steps in an unweighted graph → BFS.', 'Many starting points at once → put them ALL in the queue first.'],
            java: ['int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};', 'List<List<Integer>> adj = new ArrayList<>(); then adj.add(new ArrayList<>()) for every node.'],
          },
        },
        {
          id: 'u-g2', title: 'Cycles, Bipartite & Topo Sort', icon: '🔁',
          desc: 'Detect cycles both ways, 2-colour graphs, and order tasks with dependencies.',
          lessons: [
            L('Cycle detection', [p('graph.1.4'), p('graph.1.5'), p('graph.1.13')]),
            L('Bipartite & word ladders', [p('graph.1.12'), p('graph.1.9'), p('graph.1.10')]),
            L('Topological sort', [p('graph.2.0'), p('graph.2.1'), p('graph.2.2')]),
            L('Topo applications', [p('graph.2.3'), p('graph.2.4'), p('graph.2.5'), p('graph.2.6')]),
          ],
          boss: boss('minimum-height-trees', 'find-all-possible-recipes-from-given-supplies'),
          guide: {
            keys: ['Undirected cycle → visited neighbour that isn\'t your parent.', 'Directed cycle → node already on the current DFS path (or Kahn processes < V nodes).', 'Prerequisites / ordering → topological sort.'],
          },
        },
        {
          id: 'u-g3', title: 'Shortest Paths', icon: '🛣️',
          desc: 'BFS, DAG relaxation, Dijkstra, Bellman-Ford and Floyd-Warshall.',
          lessons: [
            L('Unit weights & DAGs', [p('graph.3.0'), p('graph.3.1')]),
            L("Dijkstra's algorithm", [p('graph.3.2'), p('graph.3.3'), p('graph.3.4'), p('graph.3.5')]),
            L('Dijkstra variations', [p('graph.3.6'), p('graph.3.7'), p('graph.3.8'), p('graph.3.9')]),
            L('All-pairs & negative edges', [p('graph.3.10'), p('graph.3.11'), p('graph.3.12')]),
          ],
          boss: boss('path-with-maximum-probability', 'shortest-path-in-a-grid-with-obstacles-elimination'),
          story: 'dijkstra',
          guide: {
            keys: ['Unweighted → BFS. Non-negative weights → Dijkstra. Negative edges → Bellman-Ford. All pairs on small n → Floyd-Warshall.', 'Dijkstra: skip a popped entry if its distance is stale.'],
          },
        },
        {
          id: 'u-g4', title: 'MST & Disjoint Set', icon: '🌉',
          desc: "Prim, Kruskal and Union-Find: near O(1) connectivity.",
          lessons: [
            L('Minimum spanning trees', [p('graph.4.0'), p('graph.4.1')]),
            L('Disjoint set union', [S('aBxjDBC4M1U'), p('graph.4.2'), p('graph.4.3'), p('graph.4.4')]),
            L('DSU problems', [p('graph.4.5'), p('graph.4.6'), p('graph.4.7')]),
            L('Hard DSU problems', [p('graph.4.8'), p('graph.4.9'), p('graph.4.10')]),
          ],
          boss: boss('redundant-connection', 'satisfiability-of-equality-equations', 'smallest-string-with-swaps'),
          guide: {
            keys: ['DSU with path compression + union by rank ≈ O(α(n)) per operation.', 'Grid cells to DSU ids: id = row * cols + col.'],
          },
        },
        {
          id: 'u-g5', title: 'Advanced Graph Algorithms', icon: '🧨',
          desc: 'Bridges, articulation points and strongly connected components.',
          lessons: [
            L("Tarjan's ideas", [p('graph.5.0'), p('graph.5.1')]),
            L("Kosaraju's algorithm", [p('graph.5.2')]),
          ],
          boss: boss('longest-cycle-in-a-graph', 'count-unreachable-pairs-of-nodes-in-an-undirected-graph'),
          guide: { keys: ['tin[] = discovery time, low[] = lowest tin reachable; low[v] > tin[u] ⇒ (u, v) is a bridge.'] },
        },
      ],
    },

    // ───────────────────────────── SECTION 12
    {
      id: 's12', title: 'Dynamic Programming', sub: 'Recursion + memory', color: 'violet',
      units: [
        {
          id: 'u-dp1', title: 'DP Foundations: 1D & Grids', icon: '🧩',
          desc: 'Recursion → memo → tabulation → space optimisation, on 1D and grid problems.',
          lessons: [
            L('What DP really is', [S('tyB0ztf0DNY'), p('dp.0.0'), p('dp.1.0')]),
            L('1D DP', [p('dp.1.1'), p('dp.1.2'), p('dp.1.3'), p('dp.1.4')]),
            L('Grid DP', [p('dp.2.0'), p('dp.2.1'), p('dp.2.2'), p('dp.2.3')]),
            L('Triangles, falling paths & 3D DP', [p('dp.2.4'), p('dp.2.5'), p('dp.2.6')]),
          ],
          boss: boss('decode-ways', 'delete-and-earn'),
          story: 'bellman',
          guide: {
            keys: ['1. Write the recursion. 2. Add a memo. 3. Convert to a table. 4. Keep only the rows you need.', 'Define the state in words: "dp[i] = best answer using the first i elements".'],
            java: ['Arrays.fill(dp, -1) for memo; int[][] dp with Arrays.fill per row.'],
          },
        },
        {
          id: 'u-dp2', title: 'DP on Subsequences', icon: '🎒',
          desc: 'Subset sum, knapsack and the coin-change family.',
          lessons: [
            L('Subset sum', [p('dp.3.0'), p('dp.3.1'), p('dp.3.2')]),
            L('Counting subsets', [p('dp.3.3'), p('dp.3.4'), p('dp.3.7')]),
            L('Knapsack', [p('dp.3.5'), p('dp.3.9'), p('dp.3.10')]),
            L('Coin change', [p('dp.3.6'), p('dp.3.8')]),
          ],
          boss: boss('perfect-squares', 'ones-and-zeroes'),
          guide: { keys: ['0/1 → move to i − 1 after taking; unbounded → stay at i.', 'Counting variants: initialise the base case to 1 way, not 0.'] },
        },
        {
          id: 'u-dp3', title: 'DP on Strings', icon: '🧵',
          desc: 'LCS and its whole family, edit distance and wildcard matching.',
          lessons: [
            L('LCS family', [p('dp.4.0'), p('dp.4.1'), p('dp.4.2')]),
            L('Palindromes & conversions', [p('dp.4.3'), p('dp.4.4'), p('dp.4.5'), p('dp.4.6')]),
            L('Matching', [p('dp.4.7'), p('dp.4.8'), p('dp.4.9')]),
          ],
          boss: boss('interleaving-string', 'uncrossed-lines'),
          guide: { keys: ['Two strings → dp[i][j] over prefixes of both.', 'Shift indices by 1 so that dp[0][*] means "empty prefix".'] },
        },
        {
          id: 'u-dp4', title: 'DP on Stocks & LIS', icon: '📉',
          desc: 'State-machine DP for stocks and the longest-increasing-subsequence family.',
          lessons: [
            L('Stocks', [p('dp.5.0'), p('dp.5.1'), p('dp.5.2'), p('dp.5.3'), p('dp.5.4'), p('dp.5.5')]),
            L('LIS', [p('dp.6.0'), p('dp.6.1'), p('dp.6.2')]),
            L('LIS variants', [p('dp.6.3'), p('dp.6.4'), p('dp.6.5'), p('dp.6.6')]),
          ],
          boss: boss('russian-doll-envelopes', 'maximum-length-of-pair-chain'),
          guide: { keys: ['Stocks: dp[i][holding][transactionsLeft].', 'LIS in O(n log n): tails[] + lower bound.'] },
        },
        {
          id: 'u-dp5', title: 'Partition DP & Squares', icon: '🪚',
          desc: 'Matrix chain multiplication style problems and DP on squares.',
          lessons: [
            L('Matrix chain multiplication', [p('dp.7.0'), p('dp.7.1')]),
            L('Partition problems', [p('dp.7.2'), p('dp.7.3'), p('dp.7.4')]),
            L('Front partition', [p('dp.7.5'), p('dp.7.6')]),
            L('DP on squares', [p('dp.8.1')]),
          ],
          boss: boss('minimum-score-triangulation-of-polygon', 'guess-number-higher-or-lower-ii', 'maximal-square'),
          guide: { keys: ['Partition DP: f(i, j) = best over k in [i, j) of f(i, k) ⊕ f(k + 1, j) + cost.', 'Tabulate with i going DOWN and j going UP.'] },
        },
      ],
    },

    // ───────────────────────────── SECTION 13
    {
      id: 's13', title: 'Tries & String Algorithms', sub: 'The last stretch', color: 'pink',
      units: [
        {
          id: 'u-trie', title: 'Tries', icon: '🌐',
          desc: 'Prefix trees and the bitwise trie for maximum XOR.',
          lessons: [
            L('Implement a trie', [S('dBGUmUQhjaM'), p('trie.0.0'), p('trie.1.0')]),
            L('Trie problems', [p('trie.1.1'), p('trie.1.2')]),
            L('Bitwise trie', [p('trie.1.3'), p('trie.1.4'), p('trie.1.5')]),
          ],
          boss: boss('design-add-and-search-words-data-structure', 'replace-words'),
          story: 'trie',
          guide: { keys: ['Node = children[26] + isEnd flag.', 'Max XOR → bitwise trie, walk towards the opposite bit.'] },
        },
        {
          id: 'u-str2', title: 'String Algorithms', icon: '🧠',
          desc: 'Rolling hash, Z-function and KMP: linear-time string matching.',
          lessons: [
            L('Warm-up', [p('str2.0.1'), p('str2.0.2')]),
            L('Pattern matching', [p('str2.0.3'), p('str2.0.4'), p('str2.0.5')]),
            L('Prefix-function problems', [p('str2.0.6'), p('str2.0.7'), p('str2.0.8')]),
          ],
          boss: boss('repeated-substring-pattern', 'repeated-string-match'),
          story: 'kmp',
          guide: { keys: ['KMP\'s LPS[i] = length of the longest proper prefix that is also a suffix of s[0..i].', 'Rolling hash: use a big prime modulus and long arithmetic.'] },
        },
      ],
    },
  ];
})();
