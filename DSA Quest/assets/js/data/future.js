/* The AI-proof track: what hiring looks like heading into 2027-28 and how to prepare.
   Researched 30 Oct 2026. Sources are linked on every card; several are secondary reports - treat
   specific numbers as directional, not gospel. */
(function () {
  const D = (window.DQ_DATA = window.DQ_DATA || {});
  D.future = {
    researched: '2026-10-30',
    headline: 'AI writes more and more of the code. Companies increasingly hire people who can judge it: people who know why a solution is right, can debug it, design systems around it and explain their trade-offs.',
    evidence: [
      {
        icon: '🧮', title: 'DSA rounds are not dead: they are being joined, not replaced',
        text: 'Big Tech still runs standardised, AI-off algorithm loops (plus a bar-raiser and structured behavioural rounds). AI-native startups lean towards practical, AI-allowed "build something real" tasks. A community analysis of 74 recent interviews still saw the clearest DSA signal at Google, LinkedIn and Microsoft.',
        so: 'Keep grinding A2Z, and also practise AI-assisted building.',
        src: [['techinterview.org: What changed in tech interviews in 2026', 'https://www.techinterview.org/post/3233475417/what-changed-tech-interviews-2026/'], ['LeetCode Discuss: 74 interviews analysed', 'https://leetcode.com/discuss/post/8446005/']],
      },
      {
        icon: '🤖', title: 'AI-enabled coding rounds now exist (e.g. Meta)',
        text: 'Meta began rolling out a coding round where candidates get a built-in AI assistant (reported from October 2025), replacing one of two coding rounds for most levels. Reports say candidates are judged on how they prompt, review and debug AI-generated code, and that the in-interview assistant is weaker than the tools you use at home. These details come from secondary reports, not an official Meta page.',
        so: 'Practise solving with an assistant, verifying every line it gives you.',
        src: [['Business Insider (NL)', 'https://www.businessinsider.nl/meta-will-let-some-job-candidates-use-ai-in-their-coding-interviews/'], ['TechRadar', 'https://www.techradar.com/pro/meta-is-going-to-let-candidates-use-ai-in-job-interviews'], ['PracHub: Meta AI coding interview 2026', 'https://prachub.com/resources/meta-ai-coding-interview']],
      },
      {
        icon: '🔎', title: 'The scored skill is shifting from producing code to judging code',
        text: 'AI-resistant rounds are spreading: debug-the-broken-code rounds, interviewers interrupting to ask why you chose a data structure and what it costs, and take-homes followed by a live walkthrough where you defend every decision.',
        so: 'Use the Bug Hunt drills and always state your complexity before submitting.',
        src: [['techinterview.org', 'https://www.techinterview.org/post/3233475417/what-changed-tech-interviews-2026/']],
      },
      {
        icon: '🏗️', title: 'System design is moving down to junior loops',
        text: 'System design now shows up in mid-level and sometimes new-grad loops. Interviewers expect data models, storage choices, trade-offs and failure modes, not memorised diagrams.',
        so: 'Start system design fundamentals after Stacks & Queues (around month 3).',
        src: [['techinterview.org', 'https://www.techinterview.org/post/3233475417/what-changed-tech-interviews-2026/']],
      },
      {
        icon: '📉', title: 'Entry-level hiring is tighter: juniors must contribute at a higher level sooner',
        text: 'SignalFire found entry-level hiring at the 15 biggest tech firms fell 25% from 2023 to 2024. US "programmer" jobs fell 27.5% (2023-25) while "software developer" jobs were roughly flat. Yet 61% of employers in NACE\'s Job Outlook 2026 say they are not replacing entry-level jobs with AI. The jobs that survive are the ones AI augments rather than automates.',
        so: 'Aim to be the junior who designs, verifies and ships, not just types code.',
        src: [['IEEE Spectrum: How to stay ahead of AI as an early-career engineer', 'https://spectrum.ieee.org/ai-effect-entry-level-jobs']],
      },
      {
        icon: '🔭', title: 'The two-year outlook',
        text: 'Addy Osmani (Google) sketches the next two years: engineers orchestrating AI agents, T-shaped skills (deep in one or two areas, broad elsewhere), and fundamentals plus verification becoming more valuable, not less. He cites a Harvard study where junior developer employment fell about 9-10% within six quarters of companies adopting generative AI, while senior employment barely moved.',
        so: 'Fundamentals + AI fluency + one deep specialty + proof that you can ship.',
        src: [['Addy Osmani: The Next Two Years of Software Engineering', 'https://addyosmani.com/blog/next-two-years/']],
      },
      {
        icon: '🇮🇳', title: 'Indian product companies: DSA + machine coding + design',
        text: 'Loops like Flipkart\'s still run an online coding test, live DSA rounds (e.g. two Mediums in 45 minutes) and a signature 90-minute machine-coding / LLD round, with system design from SDE-2 upwards. Parking-lot and food-ordering style LLD questions show up at Amazon and Flipkart.',
        so: 'LLD / machine coding in Java is a must-have, not a bonus.',
        src: [['Flipkart interview guide 2026', 'https://ophyai.com/blog/company-guides/flipkart-interview-guide'], ['Flipkart SDE2 report (Jointaro)', 'https://www.jointaro.com/interviews/companies/flipkart/work-experiences/software-engineer-ii-sde2-bengaluru-july-17-2025-4-e726cca7/']],
      },
    ],
    rules: [
      ['Struggle first, then hints', 'Give every problem 20-30 honest minutes before any hint. Productive struggle is where pattern recognition is built, but it has a time limit.'],
      ['AI is your tutor, not your solver', 'Use the tracker\'s "Ask AI" prompts: they ask for guiding questions, not code. Never paste a problem into AI before you have tried it.'],
      ['Re-solve from scratch later', 'Spaced re-solving (the testing effect) is what makes answers available in an interview. Re-reading a solution is not the same.'],
      ['Explain out loud', 'Interviews increasingly score reasoning and communication. Use the duck\'s think-aloud checklist in every mock.'],
      ['Practise both modes', 'Unaided live coding for Big Tech, and AI-assisted building for startups and AI-enabled rounds.'],
      ['Verify everything AI says', 'After solving, let AI review your code, then check its claims yourself. Catching the AI\'s mistakes is the skill being hired.'],
      ['No-AI Friday', 'Once a week, write a core algorithm from memory with no AI at all.'],
    ],
    // When to weight each branch (share of weekly time) - the Today screen shows the current phase.
    phases: [
      { until: 's7', label: 'Now → end of Stacks & Queues', split: '85% DSA · 15% future skills', focus: ['core', 'ai', 'debug', 'cs'] },
      { until: 's11', label: 'Heaps, Trees & Graphs', split: '75% DSA · 25% future skills', focus: ['lld', 'hld', 'build'] },
      { until: 'end', label: 'DP onwards → interviews', split: '60% DSA · 40% future skills', focus: ['hld', 'ship', 'talk'] },
    ],
    branches: [
      {
        id: 'core', icon: '🧠', title: 'Fundamentals without AI', why: 'The base everything else stands on. If you can\'t write it, you can\'t judge AI output.',
        quests: [
          ['core-10', 'Write 10 core algorithms from memory', 'Binary search, merge sort, quick sort, BFS, DFS, Dijkstra, DSU, topological sort, KMP and an LRU cache: no AI, no notes. Tick them off as you reach each unit.', 60],
          ['core-debugger', 'Master a debugger', 'Use breakpoints, watches and step-into in IntelliJ or VS Code while solving 5 problems.', 30],
          ['core-traces', 'Read stack traces before asking anyone', 'Keep a log of 10 exceptions you diagnosed yourself (NPE, IndexOutOfBounds, StackOverflow, CME…).', 30],
          ['core-complexity', 'State complexity before submitting', 'For 20 problems, write time and space complexity in the notes BEFORE you submit.', 30],
        ],
      },
      {
        id: 'ai', icon: '🤝', title: 'AI pair-programming', why: 'Every job description now assumes you use AI tools well, and some interviews test exactly that.',
        quests: [
          ['ai-tutor', 'Socratic tutoring', 'Solve 10 problems using only the "Ask AI (no spoilers)" prompt: guiding questions, never code.', 40],
          ['ai-review', 'AI code reviews', 'After 10 solves, run the "AI code review" prompt. Log one thing it caught and one thing it got wrong.', 40],
          ['ai-round', 'Mock an AI-enabled round', 'Take a 60-minute multi-part task (e.g. extend a small bank or library system with new features) using an assistant. Grade yourself on verification, not speed.', 50],
          ['ai-twice', 'Build one thing twice', 'Build the same small app without AI, then with AI. Write down what changed in speed, quality and understanding.', 60],
          ['ai-agentic', 'Go deep on one agentic coding tool', 'Learn Claude Code, Cursor or Copilot properly: project context files, tests-first prompting, reviewing diffs before accepting.', 40],
        ],
      },
      {
        id: 'debug', icon: '🐞', title: 'Debugging & code reading', why: 'Debug rounds are rising because they are hard to fake with AI.',
        quests: [
          ['debug-hunts', 'Clear all Bug Hunts', 'Finish every Java Bug Hunt in the Arena.', 50],
          ['debug-jdk', 'Read the JDK', 'Read OpenJDK\'s ArrayList, HashMap and ArrayDeque sources (30 minutes each). Note one thing that surprised you.', 40],
          ['debug-oss', 'Fix a real bug', 'Land one fix on a "good first issue" in an open-source repository.', 80],
        ],
      },
      {
        id: 'lld', icon: '🧱', title: 'LLD & machine coding', why: 'A signature round at Indian product companies (Flipkart, Swiggy, Uber…) and the natural next step after OOP.',
        quests: [
          ['lld-solid', 'SOLID + six patterns in Java', 'Strategy, Observer, Factory, Singleton, Builder and Decorator: one tiny example each.', 50],
          ['lld-parking', 'Parking lot in 90 minutes', 'A working console app with clean classes and a few unit tests.', 60],
          ['lld-splitwise', 'Splitwise in 90 minutes', 'Users, groups, expenses and simplified balances.', 60],
          ['lld-more', 'Three more machine-coding drills', 'Snake & Ladder, an elevator system and a movie-booking system (BookMyShow style).', 80],
        ],
      },
      {
        id: 'hld', icon: '🏗️', title: 'System design', why: 'Now expected in mid-level and some new-grad loops: data models, trade-offs and failure modes.',
        quests: [
          ['hld-basics', 'Building blocks', 'Latency numbers, load balancers, caching, CDNs, SQL vs NoSQL, indexing, replication, sharding, queues and CAP.', 50],
          ['hld-url', 'Design a URL shortener end to end', 'API, data model, ID generation, caching, scaling reads, analytics.', 50],
          ['hld-feed', 'Design a news feed', 'Fan-out on write vs read, ranking, pagination, hot users.', 50],
          ['hld-rate', 'Design a rate limiter and a chat app', 'Token bucket vs sliding window; WebSockets, delivery receipts, storage.', 60],
          ['hld-failure', 'Failure-mode drill', 'For each design, write what breaks at 10× load and how you would detect and fix it.', 40],
        ],
      },
      {
        id: 'build', icon: '⚙️', title: 'AI engineering', why: 'AI-engineer and AI-skilled roles are where demand is growing, and every product is adding AI features.',
        quests: [
          ['build-api', 'Call an LLM API', 'From Java or Python: a prompt, structured JSON output and error handling.', 40],
          ['build-rag', 'Build a RAG app over your own notes', 'Chunk, embed, retrieve and answer questions over your DSA notes exported from this tracker.', 80],
          ['build-agent', 'Build an agent with tools', 'An agent that calls 2-3 tools (e.g. a search tool and a code-runner), or an MCP server.', 80],
          ['build-evals', 'Write evals', 'A small golden test set plus automated grading for your AI feature. Track a metric over three changes.', 60],
        ],
      },
      {
        id: 'ship', icon: '🚀', title: 'Ship & prove it', why: 'Candidates winning offers show proof of work, not just certificates.',
        quests: [
          ['ship-flagship', 'One flagship project', 'Substantial, deployed, with a README, an architecture diagram and tests.', 100],
          ['ship-ci', 'Docker + GitHub Actions', 'Containerise the flagship project and add CI that runs your tests.', 50],
          ['ship-write', 'Write three technical posts', 'For example: "What Dijkstra taught me", "Binary search on answers in 5 minutes", "How I built my RAG app".', 60],
        ],
      },
      {
        id: 'talk', icon: '🗣️', title: 'Communication & behavioural', why: 'Behavioural rounds are heavier and probe whether stories are real. Clear communication breaks ties.',
        quests: [
          ['talk-stories', 'STAR story bank', 'Eight stories with numbers: ownership, conflict, failure, ambiguity, impact, learning fast, helping a teammate, a hard bug.', 50],
          ['talk-2min', 'Two-minute explanations', 'Record yourself explaining 5 solved problems in under 2 minutes each. Re-watch once.', 40],
          ['talk-mocks', 'Five mock interviews', 'Use the Arena\'s mock mode, or practise with a friend; score yourself honestly on the rubric.', 60],
        ],
      },
      {
        id: 'cs', icon: '🖥️', title: 'CS core for placements', why: 'Indian on-campus and off-campus loops still ask OS, DBMS, networks and SQL.',
        quests: [
          ['cs-os', 'Operating systems', 'Processes vs threads, scheduling (you\'ll code SJF), deadlocks, paging (you\'ll code LRU), synchronisation.', 50],
          ['cs-dbms', 'DBMS + SQL 50', 'Joins, indexing, normalisation, transactions & ACID. Then LeetCode\'s "SQL 50" study plan.', 60],
          ['cs-cn', 'Computer networks', 'TCP vs UDP, HTTP/HTTPS, DNS, and "what happens when you type a URL".', 40],
        ],
      },
    ],
    resources: [
      ['System Design Primer (GitHub)', 'https://github.com/donnemartin/system-design-primer'],
      ['Refactoring.Guru: design patterns', 'https://refactoring.guru/design-patterns'],
      ['workat.tech: machine coding practice', 'https://workat.tech/'],
      ['LeetCode SQL 50', 'https://leetcode.com/studyplan/top-sql-50/'],
    ],
  };
})();
