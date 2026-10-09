// Every word and number on the site lives in this file. Edit text here; layout never changes.
// House rules: no em dashes or en dashes (use a colon, comma, full stop or brackets),
// and every number must be real. "What it means" lines are plain arithmetic on real figures.

export const PROFILE = {
  name: "Aimaan Ayaz",
  first: "Aimaan",
  last: "Ayaz",
  roles: "AI automation engineer, designer and performance marketer",
  lines: [
    ["Systems that ", "run", " the business."],
    ["Design that ", "sells", " it."],
    ["Ads that ", "fill", " it."],
  ],
  email: "iamaimaanayaz@gmail.com",
  links: [
    { id: "email", label: "Email", value: "iamaimaanayaz@gmail.com", href: "mailto:iamaimaanayaz@gmail.com", icon: "ph-envelope-simple" },
    { id: "linkedin", label: "LinkedIn", value: "in/aimaan-ayaz", href: "https://www.linkedin.com/in/aimaan-ayaz/", icon: "ph-linkedin-logo" },
    { id: "instagram", label: "Instagram", value: "@aimaan.ai", href: "https://instagram.com/aimaan.ai", icon: "ph-instagram-logo" },
    { id: "github", label: "GitHub", value: "aimaanayaz", href: "https://github.com/aimaanayaz", icon: "ph-github-logo" },
  ],
};

export const NAV = [
  { route: "#/work", label: "Systems" },
  { route: "#/design", label: "Design" },
  { route: "#/marketing", label: "Marketing" },
  { route: "#/contact", label: "Contact" },
];

/* ------------------------------------------------------------------ HOME */

export const HOME = {
  // the four numbers under the hero, each with what it actually means
  proof: [
    { value: 711, label: "Leads in nine weeks", meaning: "Real people who typed their name and number into an ad, asking a business for a price." },
    { value: 56, prefix: "₹", label: "Per interested person", meaning: "Average ad cost of each of the 1,451 forms and chats, across three local businesses." },
    { value: 50, suffix: "×", label: "One car vs. the whole budget", meaning: "The ₹15,545 that brought a Mahindra dealer 257 enquiries is a fiftieth of the price of one XUV 3XO (₹7.79 lakh)." },
    { value: 8, label: "Systems live today", meaning: "Of 10 projects shipped, 8 are running for real businesses right now. Bots, software and sites." },
  ],
  clients: [
    "Narain Automobiles (Mahindra)", "The Picknik", "Apeksha Jhingran Studio", "NexArch Design Lab",
    "360 Aesthetics, London", "Formè Clinique", "Z Line Motorsports", "Zaid Agency",
    "Cultural Council, JMI", "E-Cell, JMI",
  ],
  chapters: [
    {
      route: "#/work", num: "01", title: "Systems", kicker: "AI automation and software",
      text: "Instagram DM bots for UK clinics. Office software an architecture firm pays for every month. Engines that research, write and find leads on their own.",
      stat: "8 live systems", img: "assets/work/trestle.webp", alt: "Trestle, office software for architecture firms",
    },
    {
      route: "#/design", num: "02", title: "Design", kicker: "Graphic design since 2021",
      text: "Esports headers at sixteen, then recruitment and sponsorship campaigns for Jamia's student bodies, and creative for the agency.",
      stat: "5 years", img: "assets/gfx/cc-results-cover.webp", alt: "Recruitment results cover for the Cultural Council, Jamia Millia Islamia",
    },
    {
      route: "#/marketing", num: "03", title: "Marketing", kicker: "Performance marketing",
      text: "₹81k of ad spend turned into 1,451 people asking to buy, for a Mahindra dealer, a café with courts and a bridal studio.",
      stat: "₹56 per enquiry", img: "assets/ads/mahindra-teachers-day.webp", alt: "Teachers' Day ad for the Mahindra XUV 3XO",
    },
  ],
  about: {
    title: "The short version",
    beats: [
      { year: "2021", text: "Started designing at sixteen. Gamers were the first people who paid me, so gamers got the first portfolio." },
      { year: "2025", text: "BTech in Computer Science (Data Science) at Jamia Millia Islamia. A 95 day DSA streak and five Google Summer of Code pull requests merged." },
      { year: "2026", text: "Built Trestle for an architecture firm, now on a monthly retainer. Director and Technical Lead at Zaid Agency, building bots and running ads for real clients." },
    ],
  },
};

/* ------------------------------------------------------------------ SYSTEMS */

export const WORK = {
  title: "Systems",
  lede: "Bots, engines and software built for real businesses. Each one takes a job a person used to do by hand, and does it every day without being asked.",
  featured: {
    id: "trestle", title: "Trestle", client: "Architecture firms, Lucknow", status: "Live, paid monthly",
    img: "assets/work/trestle.webp", href: "https://trestle.nxdl.in",
    problem: "An architecture firm ran projects, timesheets, salaries, GST and files across separate tools, on an office PC that never touches the internet.",
    built: "One private app on one office PC. Everyone else opens it in a browser over the office Wi-Fi: projects, tasks, attendance, leave, pay, a full GST ledger, tax invoices and files.",
    result: "The firm runs its whole office on it every day and pays for it every month. Installers now ship for Windows and Mac.",
    stack: ["Next.js", "React", "TypeScript", "SQLite", "Electron"],
  },
  cases: [
    {
      id: "aesthetics360", title: "360 Aesthetics DM Bot", client: "Clinic and academy, London and Bedford", status: "Live since 24 Aug 2026",
      problem: "Enquiries arrive in Instagram DMs at all hours, and a slow reply is a lost booking.",
      built: "Answers every DM as the clinic, with prices pulled straight from its booking system, qualifies the enquiry and emails the owner a summary of the lead.",
      result: "Every message gets an answer, day or night, without the owner touching the phone.",
      stack: ["Instagram API", "n8n", "Claude", "Python"],
    },
    {
      id: "engine", title: "Content Engine", client: "Personal brand, @aimaan.ai", status: "Runs daily",
      problem: "Posting consistently means hours of research and writing every week.",
      built: "Scrapes competitor reels at 5 AM, transcribes them, and every Monday writes seven reel ideas. Approved ideas get a full script and caption within the hour.",
      result: "A week of content planning, done before the working day starts.",
      stack: ["n8n", "Apify", "Whisper", "Claude"],
    },
    {
      id: "leads", title: "Z Leads Generator", client: "Zaid Agency sales team", status: "In daily use",
      problem: "Finding businesses to call, checking their numbers and preparing a pitch takes a morning per batch.",
      built: "One Telegram command returns 20 new local businesses with verified phone numbers, plus a call opener written from their own 2 to 4 star reviews.",
      result: "A morning of research arrives as one message.",
      stack: ["Google Places", "Apify", "Gemini", "Telegram"],
    },
  ],
  more: [
    { title: "Aimaan DM Bot", text: "My own Instagram messaging app. Passed Meta's App Review for business messaging.", tag: "Meta approved" },
    { title: "Formè Clinique DM Bot", text: "A clinic assistant built on a 58,000 character knowledge base of its site, with hard safety rules on medical questions.", tag: "Built" },
    { title: "Review Bot", text: "Two reminder emails before every appointment and a review request after. A new client is one config file.", tag: "Built" },
    { title: "NexArch Design Lab", text: "Portfolio site and full local SEO for an architecture practice.", tag: "Live", href: "https://nxdl.in" },
    { title: "Z Line Motorsports", text: "Google Ads landing page for a wheel shop. Main content loads in 448 ms, under 2 MB.", tag: "Live", href: "https://zlinemotorsports.in" },
    { title: "zaid.agency", text: "The agency's own site: designed and built in two days for launch.", tag: "Live", href: "https://zaid.agency" },
  ],
  toolkit: [
    { group: "Automation and AI", items: ["n8n", "Claude API", "Meta Graph API", "Apify", "Whisper", "Python"] },
    { group: "Software", items: ["Next.js", "React", "TypeScript", "SQLite", "Electron", "Java"] },
    { group: "Infrastructure", items: ["Oracle Cloud", "Caddy", "systemd", "Webhooks", "Cloudflare"] },
    { group: "Marketing", items: ["Meta Ads Manager", "Instant Forms", "Click to WhatsApp", "Reels"] },
  ],
};

/* ------------------------------------------------------------------ DESIGN */

export const GRAPHICS = {
  title: "Design",
  lede: "I started designing in 2021, at sixteen. The first clients were gamers, so the earliest work is gaming graphics. Then came campaigns for my university and creative for the agency.",
  arcs: [
    {
      id: "esports", name: "Esports", years: "2021",
      why: "Headers, sponsor reveals and staff banners for gaming creators and teams. Graphics that had to read at thumbnail size.",
      pieces: [
        { id: "viper", img: "assets/gfx/viper-header.webp", w: 1600, h: 533, title: "Viper header", client: "Gaming creator", format: "Channel header, 3:1",
          what: "Character render on a cobalt comic-page background with sparkle flares and small loading-screen details.",
          notes: ["The name has a heavy outline so it survives a phone crop.", "Comic halftone and blue keep the character as the hero."] },
        { id: "amoliq", img: "assets/gfx/amoliq-header.webp", w: 1280, h: 720, title: "Amoliq header", client: "Gaming creator", format: "Channel header",
          what: "The name set three ways (outline, solid violet, brush script) and stacked into one mark, next to a character render.",
          notes: ["The violet is pulled from the character's glow.", "The brush layer adds movement to static type."] },
        { id: "redragon", img: "assets/gfx/redragon-sponsor.webp", w: 1600, h: 900, title: "Sponsored by Redragon", client: "Esports team", format: "Sponsor announcement",
          what: "Keyboard, headset and mouse cut out and lit in the sponsor's red on a dark grid, with the brand mark as the anchor.",
          notes: ["One red, taken from the logo.", "The glow ties three product photos into one object."] },
        { id: "ant", img: "assets/gfx/ant-esports-gm.webp", w: 1600, h: 533, title: "General Manager banner", client: "ANT Esports", format: "Staff banner",
          what: "A black and white split banner for the team's General Manager, built around the team mark.",
          notes: ["No colour at all, so the team logo does the talking."] },
      ],
    },
    {
      id: "campus", name: "Campus", years: "2026",
      why: "Recruitment results, sponsorship decks and event posters for student bodies at Jamia Millia Islamia, for print and Instagram.",
      note: "Cover first, then seven team slides from one template the council's graphics team could reuse.",
      pieces: [
        { id: "cc-cover", img: "assets/gfx/cc-results-cover.webp", w: 1600, h: 1600, title: "Recruitment results, cover", client: "Cultural Council, Jamia Millia Islamia", format: "Instagram carousel, slide 1",
          what: "Gold on black, an Urdu greeting (Mubarak ho), arch line art from Jamia's own buildings, and an index of all seven teams so students can swipe straight to theirs.",
          notes: ["The arches are Jamia's gateways, traced.", "Index first: people only care about their own team."] },
        { id: "cc-hr", img: "assets/gfx/cc-hr-slide.webp", w: 1600, h: 1600, title: "Recruitment results, team slide", client: "Cultural Council, Jamia Millia Islamia", format: "Instagram carousel, inner slide",
          what: "One of seven team slides, built as a template the council's graphics team reused for every team so the whole set stayed consistent.",
          notes: ["A template, not a one-off.", "Numbers in gold, names in cream: easy to scan."] },
        { id: "cc-gold", img: "assets/gfx/cc-gold-partner.webp", w: 1080, h: 1520, title: "Gold Partner page", client: "Cultural Council, Jamia Millia Islamia", format: "Sponsorship deck page",
          what: "The ₹1.5 Lakh tier. Real campus photos mocked up with the sponsor's banners, plus a site map of stall placement, so a sponsor sees exactly what they are paying for.",
          notes: ["Show the banner on the real wall.", "Price last, after the value."] },
        { id: "eureka", img: "assets/gfx/ecell-eureka.webp", w: 1280, h: 1600, title: "Idea for Change: Eureka!", client: "E-Cell, Jamia Millia Islamia", format: "Event poster",
          what: "A pitching event poster. The top pitchers win a chance to pitch to E-Cell IIT Bombay. Two QR codes (register, join the community) and one date, time and venue bar.",
          notes: ["Two QR codes with two different jobs, both labelled.", "Date, time and venue on one line."] },
      ],
    },
    {
      id: "agency", name: "Agency", years: "2026",
      why: "Social creative for Zaid Agency. Fewer words, one claim, one address.",
      note: "One problem, one address. Agency creative is about saying less.",
      pieces: [
        { id: "zaid-post", img: "assets/gfx/zaid-agency-post.webp", w: 1080, h: 1440, title: "Most businesses waste months", client: "Zaid Agency", format: "Instagram post, 3:4",
          what: "A one-line problem statement over a mesh grid with a chrome figure, and the website address as the only call to action.",
          notes: ["One problem. One address.", "The figure looks up and out, toward launch."] },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ MARKETING */

export const ADS = {
  title: "Marketing",
  lede: "Nine weeks, three local businesses, ₹81,352 of ad spend. Here is what came back, and what each number actually means.",
  totals: [
    { value: 81352, prefix: "₹", label: "Ad spend managed", meaning: "Across three ad accounts, 1 August to 5 October 2026." },
    { value: 1175519, label: "Impressions", meaning: "Times an ad appeared on someone's screen." },
    { value: 711, label: "Leads", meaning: "People who filled a form with their name and number, asking for a price or a booking." },
    { value: 740, label: "Chats", meaning: "People who opened a WhatsApp or Instagram conversation straight from an ad." },
  ],
  headline: { big: "1,451 people raised their hand.", small: "That is ₹56 for each person who asked a business to call them back or started a chat." },
  cases: [
    {
      id: "mahindra", client: "Narain Automobiles", tag: "Mahindra dealership, Lucknow",
      result: "257", resultLabel: "car enquiries", cost: "₹60 each, from ₹15,545",
      meaning: "257 people asked a Lucknow Mahindra showroom for a price on a car that starts at ₹7.79 lakh. That one car is worth 50 times the entire ad budget.",
      img: "assets/ads/mahindra-teachers-day.webp", imgAlt: "Teachers' Day ad for the Mahindra XUV 3XO, run for Narain Automobiles", imgCaption: "The Teachers' Day ad: one offer, written for one audience.",
      moves: [
        { title: "A niche offer for one audience", text: "Teachers got their own ₹75,000 benefit stack for Teachers' Day, and an ad that spoke only to them.", quote: "Teachers, this offer is yours.", result: "91 leads at ₹33.76" },
        { title: "A real deadline", text: "A September scheme with a hard end date and a 30 second form.", quote: "₹1.15 Lakh in benefits, only this September.", result: "89 leads at ₹25.41", best: true },
        { title: "The price in the first line", text: "A Thar Roxx reel that leads with the price and the discount.", quote: "Ex-showroom from ₹12,52,000. Highest discount ₹1,55,000.", result: "77 leads, 41,463 engagements" },
      ],
      stats: [["Impressions", "227,179"], ["People reached", "105,381"], ["Click-through", "2.73%"]],
    },
    {
      id: "picknik", client: "The Picknik", tag: "Pickleball courts and café, Lucknow",
      result: "453", resultLabel: "leads, plus 459 chats", cost: "₹63 per lead, from ₹35,600",
      meaning: "Earlier in 2026 a lead here cost ₹120. It now costs ₹63: nearly half, so the same budget brings in almost twice as many enquiries.",
      moves: [
        { title: "One campaign per reason to visit", text: "Celebrations and corporate, sport and birthdays, night hangouts and a premium push, each with its own creative and form.", quote: "Birthday? Kitty party? Corporate off-site?", result: "Celebrations ad: 195 leads at ₹48" },
        { title: "Talk the way customers talk", text: "Kids' birthday parties, sold to parents in Hinglish.", quote: "Bacchon ki birthday party ka full arrangement, ek hi jagah!", result: "65 leads at ₹27.64", best: true },
        { title: "Ads that hire", text: "Click-to-message job posts for chef, barista, accounts and front desk roles.", quote: "We're hiring at The Picknik!", result: "198 applicants at about ₹15 each" },
      ],
      stats: [["Impressions", "553,589"], ["People reached", "205,123"], ["Café launch + collab", "261 chats"]],
    },
    {
      id: "apeksha", client: "Apeksha Jhingran", tag: "Bridal makeup studio and salon",
      result: "281", resultLabel: "WhatsApp conversations", cost: "About ₹107 each, from ₹30,208",
      meaning: "Bridal makeup is booked in a conversation, not a form. 281 people opened a chat straight with the studio, where bookings actually close.",
      moves: [
        { title: "Send people straight to WhatsApp", text: "Every ad opened a chat with the studio instead of a form.", quote: null, result: "120 chats from one campaign at ₹87", best: true },
        { title: "Time it to the festival", text: "Teej and Rakhi offers, launched in the week people were already planning.", quote: "Celebrate the beauty of Teej.", result: "Offers timed to each festival week" },
        { title: "Keep bridal separate", text: "A dedicated bridal campaign, kept apart from everyday salon offers.", quote: null, result: "40 bridal chats" },
      ],
      stats: [["Impressions", "394,751"], ["People reached", "158,119"]],
    },
  ],
  playbook: [
    { icon: "ph-target", title: "One offer per campaign", text: "Each offer gets its own budget, so every idea gets a fair test." },
    { icon: "ph-hourglass-medium", title: "A reason to act now", text: "A date, a segment or a number. 'Only this September' beat every adjective." },
    { icon: "ph-door-open", title: "Pick the right door", text: "Forms for cars and events. WhatsApp for bridal makeup. The ticket size decides." },
    { icon: "ph-chat-text", title: "Talk like the customer", text: "Hinglish for parents planning a birthday. Plain numbers for people comparing SUVs." },
  ],
  source: "Source: Meta Ads Manager, each client's ad account, 1 August to 5 October 2026. Figures as reported by Meta. Earlier Picknik lead cost: its lead campaigns, January to February 2026.",
};

/* ------------------------------------------------------------------ CONTACT */

export const CONTACT = {
  title: "Let's build the thing that runs while you sleep.",
  line: "Tell me what you sell. I'll tell you the first thing I'd automate.",
  sub: "Open to freelance builds, agency projects, internships and full-time roles.",
};
