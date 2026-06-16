import type { User, Product, Order } from "../types";

/* ── Demo logged-in user (placeholder data) ── */
export const DEMO_USER: User = {
  id: "u1",
  name: "Alex Kimani",
  email: "alex.kimani@uni.ac.ke",
  avatar: "AK",
  bio: "Software Engineering student · Nairobi",
  joinedDate: "Jan 2024",
  totalEarned: 284.50,
  totalSales: 36,
  rating: 4.8,
};

/* ── Product catalogue ── */
export const PRODUCTS: Product[] = [
  {
    id: "rp1", category: "Research Papers",
    title: "Machine Learning in Healthcare: A Systematic Review",
    description: "42-page research covering CNN applications in medical imaging across 5 hospital datasets with statistical analysis.",
    price: 12.99, seller: "Dr. Aisha Kamara", sellerId: "u2", sellerAvatar: "AK",
    rating: 4.8, reviews: 134, downloads: 412,
    image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=260&fit=crop",
    badge: "Bestseller", tags: ["ML", "Healthcare", "CNN"],
  },
  {
    id: "rp2", category: "Research Papers",
    title: "Blockchain for Supply Chain Transparency",
    description: "27-page paper examining Ethereum smart contracts in FMCG supply chains with real implementation cost data.",
    price: 9.99, seller: "James Osei", sellerId: "u3", sellerAvatar: "JO",
    rating: 4.6, reviews: 87, downloads: 203,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=260&fit=crop",
    tags: ["Blockchain", "Supply Chain"],
  },
  {
    id: "rp3", category: "Research Papers",
    title: "Climate Change Impact on Sub-Saharan Agriculture",
    description: "Field-study analysis with 10-year dataset from 6 countries including predictive yield models.",
    price: 14.50, seller: "Prof. Nkechi Obi", sellerId: "u4", sellerAvatar: "NO",
    rating: 4.9, reviews: 210, downloads: 618,
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=260&fit=crop",
    badge: "Top Rated", tags: ["Climate", "Agriculture", "Africa"],
  },
  {
    id: "pc1", category: "Project Code",
    title: "E-Commerce Platform — React + Node.js",
    description: "Full-stack shop with Stripe payments, admin panel, product management, and inventory tracking. Fully documented.",
    price: 34.99, seller: "CodeCraft Studio", sellerId: "u5", sellerAvatar: "CC",
    rating: 4.7, reviews: 62, downloads: 189,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=260&fit=crop",
    badge: "New", tags: ["React", "Node.js", "Stripe"],
  },
  {
    id: "pc2", category: "Project Code",
    title: "Hospital Management System — Django + PostgreSQL",
    description: "Complete HMS: patient records, appointment scheduling, billing, lab results and reporting dashboard.",
    price: 49.00, seller: "DevNest Africa", sellerId: "u6", sellerAvatar: "DN",
    rating: 4.5, reviews: 38, downloads: 97,
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=260&fit=crop",
    tags: ["Django", "PostgreSQL", "HMS"],
  },
  {
    id: "pc3", category: "Project Code",
    title: "Student Budget Tracker — Flutter App",
    description: "Cross-platform mobile app with expense categories, charts, CSV export, and monthly summaries.",
    price: 19.99, seller: "Alex Kimani", sellerId: "u1", sellerAvatar: "AK",
    rating: 4.7, reviews: 14, downloads: 56,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=260&fit=crop",
    tags: ["Flutter", "Mobile", "Finance"],
  },
  {
    id: "hr1", category: "Hire",
    title: "Full-Stack Web Developer",
    description: "3 years experience · React, Node.js, PostgreSQL, AWS. 100% on-time delivery. Available 20 hrs/week.",
    price: 25.00, seller: "Kwame Asante", sellerId: "u7", sellerAvatar: "KA",
    rating: 4.9, reviews: 91,
    image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=400&h=260&fit=crop",
    badge: "Pro", tags: ["React", "Node.js", "AWS"],
  },
  {
    id: "hr2", category: "Hire",
    title: "Academic & Technical Writer",
    description: "Expert in theses, dissertations, and literature reviews. 48-hr turnaround. All STEM disciplines.",
    price: 18.00, seller: "Fatima Al-Hassan", sellerId: "u8", sellerAvatar: "FA",
    rating: 4.7, reviews: 154,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=260&fit=crop",
    tags: ["Writing", "Research", "Academic"],
  },
  {
    id: "hr3", category: "Hire",
    title: "Data Analyst & Visualization Expert",
    description: "Python, R, Tableau, Power BI. Turns raw datasets into actionable dashboards and reports.",
    price: 22.00, seller: "Sipho Dlamini", sellerId: "u9", sellerAvatar: "SD",
    rating: 4.6, reviews: 47,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=260&fit=crop",
    badge: "Top Rated", tags: ["Python", "Tableau", "Data"],
  },
  {
    id: "bk1", category: "Books",
    title: "Data Structures & Algorithms — 3rd Edition",
    description: "600 pages covering arrays, trees, graphs, sorting and dynamic programming with Python examples.",
    price: 22.00, seller: "TechPub East Africa", sellerId: "u10", sellerAvatar: "TP",
    rating: 4.8, reviews: 302, downloads: 890,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=260&fit=crop",
    badge: "Bestseller", tags: ["DSA", "Python", "CS"],
  },
  {
    id: "bk2", category: "Books",
    title: "Entrepreneurship in the Digital Age",
    description: "Case studies from 20 African startups — fundraising, product-market fit, and scaling strategies.",
    price: 17.50, seller: "AfricaRise Press", sellerId: "u11", sellerAvatar: "AR",
    rating: 4.6, reviews: 178, downloads: 523,
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&h=260&fit=crop",
    tags: ["Business", "Africa", "Startups"],
  },
  {
    id: "bk3", category: "Books",
    title: "Introduction to Machine Learning",
    description: "Beginner-friendly guide covering supervised, unsupervised learning and neural networks with real-world case studies.",
    price: 19.99, seller: "Alex Kimani", sellerId: "u1", sellerAvatar: "AK",
    rating: 4.4, reviews: 22, downloads: 88,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=260&fit=crop",
    tags: ["ML", "AI", "Beginner"],
  },
];

/* ── Listings owned by the demo user ── */
export const MY_LISTINGS = PRODUCTS.filter((p) => p.sellerId === "u1");

/* ── Seed order history ── */
export const SEED_ORDERS: Order[] = [
  {
    id: "ORD-2847", date: "Jun 10, 2025",
    items: [{ ...PRODUCTS[0], qty: 1 }, { ...PRODUCTS[9], qty: 1 }],
    total: 34.98, status: "Delivered",
  },
  {
    id: "ORD-2801", date: "May 28, 2025",
    items: [{ ...PRODUCTS[3], qty: 1 }],
    total: 34.99, status: "Delivered",
  },
];

/* ── Landing page testimonials ── */
export const TESTIMONIALS = [
  {
    name: "Grace Mutua", role: "Computer Science, Year 3", avatar: "GM",
    text: "I sold my final-year project code within a week. SkillMart made it effortless — I earned $120 while helping juniors learn from real code.",
  },
  {
    name: "David Okonkwo", role: "MSc Economics student", avatar: "DO",
    text: "Found a research paper on agricultural policy that saved me 3 weeks of fieldwork. The quality was outstanding and the price was fair.",
  },
  {
    name: "Amina Wanjiku", role: "Freelance Developer", avatar: "AW",
    text: "The hire feature connected me with 6 clients in my first month. Best platform for student talent — zero middleman fees on my first 10 jobs.",
  },
];
