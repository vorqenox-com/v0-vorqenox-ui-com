"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface SpecRow {
  key: string
  value: string
}

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image?: string
  category: string
  keywords: string
  targetUrl: string
  cardType: "titan" | "premium" | "normal"
  showAds: boolean
  showLandingPage: boolean
  autoRefresh: boolean
  counterMode: "fixed" | "random"
  counterFixed: number
  counterMin: number
  counterMax: number
  specs: SpecRow[]
  createdAt: string
}

export interface FriendlySite {
  id: string
  name: string
  description: string
  url: string
  logo?: string
}

export interface AdSlot {
  id: string
  position: "top" | "middle" | "bottom" | "heavy"
  content: string
  active: boolean
  type: "regular" | "heavy"
}

export interface SocialProof {
  id: string
  text: string
  active: boolean
}

export interface SocialLink {
  id: string
  platform: string
  url: string
}

export interface SiteSettings {
  name: string
  description: string
  contactEmail: string
  privacyText: string
  policyText: string
  facebookPixel: string
  tiktokPixel: string
  snapPixel: string
  googlePixel: string
  cpaApiUrl: string
  cpaApiKey: string
}

export interface SectionOrder {
  id: string
  name: string
  visible: boolean
}

interface StoreContextType {
  articles: Article[]
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>
  friendlySites: FriendlySite[]
  setFriendlySites: React.Dispatch<React.SetStateAction<FriendlySite[]>>
  adSlots: AdSlot[]
  setAdSlots: React.Dispatch<React.SetStateAction<AdSlot[]>>
  settings: SiteSettings
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>
  sectionOrder: SectionOrder[]
  setSectionOrder: React.Dispatch<React.SetStateAction<SectionOrder[]>>
  silentRefresh: boolean
  setSilentRefresh: React.Dispatch<React.SetStateAction<boolean>>
  visitors: number
  socialProofs: SocialProof[]
  setSocialProofs: React.Dispatch<React.SetStateAction<SocialProof[]>>
  socialLinks: SocialLink[]
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>
}

const StoreContext = createContext<StoreContextType | null>(null)

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "The Future of Neural Interfaces",
    excerpt: "Exploring the next generation of brain-computer interfaces that will revolutionize human interaction.",
    content: "Full article content about neural interfaces and how they are reshaping the way humans interact with technology. From medical applications to consumer electronics, the implications are vast and far-reaching.",
    image: "",
    category: "Technology",
    keywords: "neural, brain, interface, tech",
    targetUrl: "https://example.com/offer-1",
    cardType: "titan",
    showAds: true,
    showLandingPage: true,
    autoRefresh: false,
    counterMode: "fixed",
    counterFixed: 10,
    counterMin: 500,
    counterMax: 1500,
    specs: [
      { key: "Type", value: "Neural Interface v3.0" },
      { key: "Connectivity", value: "Bluetooth 6.0 / Wi-Fi 7" },
      { key: "Battery", value: "72h Active Use" },
    ],
    createdAt: "2026-02-10",
  },
  {
    id: "2",
    title: "Quantum Computing Breakthroughs",
    excerpt: "Latest advances in quantum computing architecture promise exponential performance gains.",
    content: "Quantum computing has entered a new era with breakthroughs in qubit stability and error correction. These advances promise to revolutionize industries from pharmaceuticals to cryptography.",
    image: "",
    category: "Science",
    keywords: "quantum, computing, science",
    targetUrl: "https://example.com/offer-2",
    cardType: "titan",
    showAds: true,
    showLandingPage: false,
    autoRefresh: false,
    counterMode: "random",
    counterFixed: 10,
    counterMin: 800,
    counterMax: 2000,
    specs: [
      { key: "Qubits", value: "1,024 Logical Qubits" },
      { key: "Error Rate", value: "0.001%" },
    ],
    createdAt: "2026-02-09",
  },
  {
    id: "3",
    title: "Cybersecurity in 2026",
    excerpt: "How zero-trust architecture is reshaping enterprise security.",
    content: "Zero-trust security models are now the gold standard for enterprise protection. This article explores the latest frameworks and implementation strategies.",
    image: "",
    category: "Security",
    keywords: "cyber, security, zero-trust",
    targetUrl: "https://example.com/offer-3",
    cardType: "premium",
    showAds: false,
    showLandingPage: true,
    autoRefresh: true,
    counterMode: "fixed",
    counterFixed: 15,
    counterMin: 300,
    counterMax: 900,
    specs: [],
    createdAt: "2026-02-08",
  },
  {
    id: "4",
    title: "AI-Powered Code Generation",
    excerpt: "The rise of autonomous development systems and their impact on software engineering.",
    content: "AI code generation tools have matured significantly, now capable of producing production-ready code with minimal human oversight.",
    image: "",
    category: "AI",
    keywords: "ai, code, generation, automation",
    targetUrl: "https://example.com/offer-4",
    cardType: "premium",
    showAds: true,
    showLandingPage: false,
    autoRefresh: false,
    counterMode: "random",
    counterFixed: 10,
    counterMin: 600,
    counterMax: 1800,
    specs: [
      { key: "Model", value: "GPT-6 Turbo" },
      { key: "Languages", value: "42+ Supported" },
    ],
    createdAt: "2026-02-07",
  },
  {
    id: "5",
    title: "Decentralized Identity Systems",
    excerpt: "Blockchain-based identity verification is changing how we prove who we are.",
    content: "Decentralized identity systems built on blockchain technology are providing secure, private, and user-controlled identity verification across the globe.",
    image: "",
    category: "Blockchain",
    keywords: "blockchain, identity, decentralized",
    targetUrl: "https://example.com/offer-5",
    cardType: "normal",
    showAds: true,
    showLandingPage: true,
    autoRefresh: false,
    counterMode: "fixed",
    counterFixed: 10,
    counterMin: 500,
    counterMax: 1500,
    specs: [],
    createdAt: "2026-02-06",
  },
  {
    id: "6",
    title: "Edge Computing Revolution",
    excerpt: "Processing data closer to the source for ultra-low latency applications.",
    content: "Edge computing is transforming how data is processed, bringing computation closer to the source for real-time applications in IoT, autonomous vehicles, and smart cities.",
    image: "",
    category: "Infrastructure",
    keywords: "edge, computing, latency, iot",
    targetUrl: "https://example.com/offer-6",
    cardType: "normal",
    showAds: false,
    showLandingPage: false,
    autoRefresh: false,
    counterMode: "fixed",
    counterFixed: 10,
    counterMin: 500,
    counterMax: 1500,
    specs: [],
    createdAt: "2026-02-05",
  },
  {
    id: "7",
    title: "The Metaverse Economy",
    excerpt: "Virtual economies are generating real-world wealth at unprecedented scale.",
    content: "The metaverse economy has grown into a multi-trillion dollar ecosystem, with virtual real estate, digital fashion, and virtual services creating entirely new market categories.",
    image: "",
    category: "Virtual Reality",
    keywords: "metaverse, virtual, economy",
    targetUrl: "https://example.com/offer-7",
    cardType: "normal",
    showAds: true,
    showLandingPage: false,
    autoRefresh: false,
    counterMode: "fixed",
    counterFixed: 10,
    counterMin: 500,
    counterMax: 1500,
    specs: [],
    createdAt: "2026-02-04",
  },
  {
    id: "8",
    title: "Autonomous Drone Networks",
    excerpt: "Swarm intelligence enables coordinated drone operations for logistics and surveillance.",
    content: "Autonomous drone swarms are revolutionizing logistics, agriculture, and surveillance through coordinated behavior powered by swarm intelligence algorithms.",
    image: "",
    category: "Robotics",
    keywords: "drones, autonomous, swarm, robotics",
    targetUrl: "https://example.com/offer-8",
    cardType: "normal",
    showAds: true,
    showLandingPage: true,
    autoRefresh: true,
    counterMode: "random",
    counterFixed: 10,
    counterMin: 400,
    counterMax: 1200,
    specs: [
      { key: "Range", value: "50km Autonomous" },
      { key: "Swarm Size", value: "Up to 256 Units" },
    ],
    createdAt: "2026-02-03",
  },
]

const MOCK_SITES: FriendlySite[] = [
  { id: "1", name: "NeonTech", description: "Future of Neon Technology", url: "https://neontech.dev" },
  { id: "2", name: "CyberForge", description: "Digital Forge Network", url: "https://cyberforge.io" },
  { id: "3", name: "QuantumLab", description: "Quantum Research Hub", url: "https://quantumlab.ai" },
  { id: "4", name: "DataVault", description: "Secure Data Solutions", url: "https://datavault.net" },
]

const MOCK_ADS: AdSlot[] = [
  { id: "1", position: "top", content: "Top Banner Ad", active: true, type: "regular" },
  { id: "2", position: "middle", content: "Mid-Page Ad", active: true, type: "regular" },
  { id: "3", position: "bottom", content: "Footer Ad", active: true, type: "regular" },
  { id: "4", position: "heavy", content: "Heavy Full-Screen Interstitial", active: false, type: "heavy" },
]

const MOCK_SOCIAL_PROOFS: SocialProof[] = [
  { id: "1", text: "Someone just claimed this exclusive offer!", active: true },
  { id: "2", text: "A user from New York verified their account", active: true },
  { id: "3", text: "Limited spots remaining - 3 claimed in last hour", active: true },
  { id: "4", text: "Premium access granted to a new member", active: true },
  { id: "5", text: "Offer expires soon - high demand detected", active: true },
]

const MOCK_SOCIAL_LINKS: SocialLink[] = [
  { id: "1", platform: "Facebook", url: "https://facebook.com" },
  { id: "2", platform: "Twitter/X", url: "https://x.com" },
  { id: "3", platform: "Instagram", url: "https://instagram.com" },
  { id: "4", platform: "Telegram", url: "https://t.me" },
]

const DEFAULT_SECTIONS: SectionOrder[] = [
  { id: "titan", name: "Titan Slider", visible: true },
  { id: "ad-heavy", name: "Heavy Ad Zone", visible: false },
  { id: "premium", name: "Premium 3D Carousel", visible: true },
  { id: "ad-top", name: "Ad - Top", visible: true },
  { id: "articles", name: "Articles Hub", visible: true },
  { id: "ad-middle", name: "Ad - Middle", visible: true },
  { id: "network", name: "Network / Friendly Sites", visible: true },
  { id: "ad-bottom", name: "Ad - Bottom", visible: true },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES)
  const [friendlySites, setFriendlySites] = useState<FriendlySite[]>(MOCK_SITES)
  const [adSlots, setAdSlots] = useState<AdSlot[]>(MOCK_ADS)
  const [settings, setSettings] = useState<SiteSettings>({
    name: "Vorqenox",
    description: "The Sovereign Conversion Engine",
    contactEmail: "admin@vorqenox.com",
    privacyText: "Your privacy is our priority. We collect minimal data necessary for providing our services.",
    policyText: "By using this platform, you agree to our terms of service and content policies.",
    facebookPixel: "",
    tiktokPixel: "",
    snapPixel: "",
    googlePixel: "",
    cpaApiUrl: "",
    cpaApiKey: "",
  })
  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>(DEFAULT_SECTIONS)
  const [silentRefresh, setSilentRefresh] = useState(false)
  const [visitors, setVisitors] = useState(0)

  // Defer random visitor count to client-only to prevent hydration mismatch
  useEffect(() => {
    setVisitors(Math.floor(Math.random() * 5000) + 1200)
  }, [])
  const [socialProofs, setSocialProofs] = useState<SocialProof[]>(MOCK_SOCIAL_PROOFS)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(MOCK_SOCIAL_LINKS)

  return (
    <StoreContext.Provider
      value={{
        articles, setArticles,
        friendlySites, setFriendlySites,
        adSlots, setAdSlots,
        settings, setSettings,
        sectionOrder, setSectionOrder,
        silentRefresh, setSilentRefresh,
        visitors,
        socialProofs, setSocialProofs,
        socialLinks, setSocialLinks,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
