"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image?: string
  category: string
  cardType: "titan" | "premium" | "normal"
  showAds: boolean
  showLandingPage: boolean
  autoRefresh: boolean
  createdAt: string
}

export interface FriendlySite {
  id: string
  name: string
  url: string
  logo?: string
}

export interface AdSlot {
  id: string
  position: "top" | "middle" | "bottom" | "heavy"
  content: string
  active: boolean
}

export interface SiteSettings {
  name: string
  description: string
  neonHue: number
  facebookPixel: string
  tiktokPixel: string
  snapPixel: string
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
}

const StoreContext = createContext<StoreContextType | null>(null)

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "The Future of Neural Interfaces",
    excerpt: "Exploring the next generation of brain-computer interfaces that will revolutionize human interaction.",
    content: "Full article content about neural interfaces...",
    image: "",
    category: "Technology",
    cardType: "titan",
    showAds: true,
    showLandingPage: true,
    autoRefresh: false,
    createdAt: "2026-02-10",
  },
  {
    id: "2",
    title: "Quantum Computing Breakthroughs",
    excerpt: "Latest advances in quantum computing architecture promise exponential performance gains.",
    content: "Full article content about quantum computing...",
    image: "",
    category: "Science",
    cardType: "titan",
    showAds: true,
    showLandingPage: false,
    autoRefresh: false,
    createdAt: "2026-02-09",
  },
  {
    id: "3",
    title: "Cybersecurity in 2026",
    excerpt: "How zero-trust architecture is reshaping enterprise security.",
    content: "Full article content about cybersecurity...",
    image: "",
    category: "Security",
    cardType: "premium",
    showAds: false,
    showLandingPage: true,
    autoRefresh: true,
    createdAt: "2026-02-08",
  },
  {
    id: "4",
    title: "AI-Powered Code Generation",
    excerpt: "The rise of autonomous development systems and their impact on software engineering.",
    content: "Full article about AI code generation...",
    image: "",
    category: "AI",
    cardType: "premium",
    showAds: true,
    showLandingPage: false,
    autoRefresh: false,
    createdAt: "2026-02-07",
  },
  {
    id: "5",
    title: "Decentralized Identity Systems",
    excerpt: "Blockchain-based identity verification is changing how we prove who we are.",
    content: "Full article about decentralized identity...",
    image: "",
    category: "Blockchain",
    cardType: "normal",
    showAds: true,
    showLandingPage: true,
    autoRefresh: false,
    createdAt: "2026-02-06",
  },
  {
    id: "6",
    title: "Edge Computing Revolution",
    excerpt: "Processing data closer to the source for ultra-low latency applications.",
    content: "Full article about edge computing...",
    image: "",
    category: "Infrastructure",
    cardType: "normal",
    showAds: false,
    showLandingPage: false,
    autoRefresh: false,
    createdAt: "2026-02-05",
  },
  {
    id: "7",
    title: "The Metaverse Economy",
    excerpt: "Virtual economies are generating real-world wealth at unprecedented scale.",
    content: "Full article about metaverse...",
    image: "",
    category: "Virtual Reality",
    cardType: "normal",
    showAds: true,
    showLandingPage: false,
    autoRefresh: false,
    createdAt: "2026-02-04",
  },
  {
    id: "8",
    title: "Autonomous Drone Networks",
    excerpt: "Swarm intelligence enables coordinated drone operations for logistics and surveillance.",
    content: "Full article about drones...",
    image: "",
    category: "Robotics",
    cardType: "normal",
    showAds: true,
    showLandingPage: true,
    autoRefresh: true,
    createdAt: "2026-02-03",
  },
]

const MOCK_SITES: FriendlySite[] = [
  { id: "1", name: "NeonTech", url: "https://neontech.dev" },
  { id: "2", name: "CyberForge", url: "https://cyberforge.io" },
  { id: "3", name: "QuantumLab", url: "https://quantumlab.ai" },
  { id: "4", name: "DataVault", url: "https://datavault.net" },
]

const MOCK_ADS: AdSlot[] = [
  { id: "1", position: "top", content: "Top Banner Ad", active: true },
  { id: "2", position: "middle", content: "Mid-Page Ad", active: true },
  { id: "3", position: "bottom", content: "Footer Ad", active: true },
  { id: "4", position: "heavy", content: "Heavy Full-Screen Ad", active: false },
]

const DEFAULT_SECTIONS: SectionOrder[] = [
  { id: "titan", name: "Titan Slider", visible: true },
  { id: "premium", name: "Premium Slider", visible: true },
  { id: "ad-top", name: "Ad - Top", visible: true },
  { id: "articles", name: "Articles Grid", visible: true },
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
    description: "Ultimate Psychological Conversion Platform",
    neonHue: 185,
    facebookPixel: "",
    tiktokPixel: "",
    snapPixel: "",
  })
  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>(DEFAULT_SECTIONS)
  const [silentRefresh, setSilentRefresh] = useState(false)
  const [visitors] = useState(Math.floor(Math.random() * 5000) + 1200)

  return (
    <StoreContext.Provider
      value={{
        articles,
        setArticles,
        friendlySites,
        setFriendlySites,
        adSlots,
        setAdSlots,
        settings,
        setSettings,
        sectionOrder,
        setSectionOrder,
        silentRefresh,
        setSilentRefresh,
        visitors,
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
