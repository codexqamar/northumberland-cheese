// Mock catalog. Replace with Sage 50 inventory feed (Zync) when API spec lands.
export type Milk = "cow" | "goat" | "sheep";

export interface Cheese {
  slug: string;
  sku: string;
  name: string;
  tagline: string;
  milk: Milk;
  pricePerKg: number;     // £/kg (trade and retail reference)
  retailPrice: number;    // £ per typical retail piece
  retailWeightG: number;  // typical weight of a retail piece
  baseUnitWeightKg: number; // catch-weight reference (wheels)
  catchWeight: boolean;
  description: string;
  notes: string[];
  agedMonths: number;
  image: string;
}

export const CHEESES: Cheese[] = [
  {
    slug: "cheviot",
    sku: "NCC-CHEV-WHEEL",
    name: "Cheviot",
    tagline: "Our signature cow's milk wheel",
    milk: "cow",
    pricePerKg: 12.5,
    retailPrice: 7.5,
    retailWeightG: 220,
    baseUnitWeightKg: 2.5,
    catchWeight: true,
    description:
      "A buttery, semi-hard cow's milk cheese with a gentle tang and supple paste. The cheese that built the dairy.",
    notes: ["Butter", "Hay", "Soft tang"],
    agedMonths: 3,
    image: "/Cheviot Hills_Cheese Board.jpg",
  },
  {
    slug: "coquetdale",
    sku: "NCC-COQ-200",
    name: "Coquetdale",
    tagline: "Washed-rind, named for the river",
    milk: "cow",
    pricePerKg: 18,
    retailPrice: 6.2,
    retailWeightG: 200,
    baseUnitWeightKg: 1.6,
    catchWeight: true,
    description:
      "A characterful washed-rind cheese with a rosy bloom, mellow funk and a long, savoury finish.",
    notes: ["Brassica", "Cured ham", "Wet stone"],
    agedMonths: 5,
    image: "/Coquet Valley_Cheese Board Gravite.jpg",
  },
  {
    slug: "elsdon",
    sku: "NCC-ELS-180",
    name: "Elsdon",
    tagline: "Fresh goat, lemon-bright",
    milk: "goat",
    pricePerKg: 22,
    retailPrice: 5.8,
    retailWeightG: 180,
    baseUnitWeightKg: 1.2,
    catchWeight: false,
    description:
      "A soft, lactic goat cheese rolled in vine ash. Bright, citric, and clean as a frost morning.",
    notes: ["Lemon zest", "Fresh cream", "Ash"],
    agedMonths: 1,
    image: "/elsdon.jpg",
  },
  {
    slug: "rothbury-ewe",
    sku: "NCC-RTH-WHEEL",
    name: "Rothbury Ewe",
    tagline: "Hard sheep wheel, aged six months",
    milk: "sheep",
    pricePerKg: 26,
    retailPrice: 9.5,
    retailWeightG: 250,
    baseUnitWeightKg: 2.0,
    catchWeight: true,
    description:
      "A firm sheep's milk cheese with a nutty heart and crystalline sparkle from long ageing.",
    notes: ["Roasted hazelnut", "Lanolin", "Caramel"],
    agedMonths: 6,
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "berwick-edge",
    sku: "NCC-BWK-200",
    name: "Berwick Edge",
    tagline: "Gouda-style, deep amber",
    milk: "cow",
    pricePerKg: 19.5,
    retailPrice: 6.8,
    retailWeightG: 200,
    baseUnitWeightKg: 4.0,
    catchWeight: true,
    description:
      "An amber, gouda-style cow's milk cheese with a fudge sweetness and protein crunch.",
    notes: ["Toffee", "Pineapple", "Crystal crunch"],
    agedMonths: 9,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "redesdale",
    sku: "NCC-RED-200",
    name: "Redesdale",
    tagline: "Pasteurised sheep, gentle",
    milk: "sheep",
    pricePerKg: 24,
    retailPrice: 6.5,
    retailWeightG: 200,
    baseUnitWeightKg: 1.4,
    catchWeight: false,
    description:
      "A pale, supple sheep's milk cheese with a soft lactic curd and a clean, restrained finish.",
    notes: ["Yoghurt", "Almond", "Cool grass"],
    agedMonths: 2,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop&q=80",
  },
];

export const findCheese = (slug: string) => CHEESES.find(c => c.slug === slug);

// Trade tier multipliers (vs retail pricePerKg)
export type TradeTier = "bronze" | "silver" | "gold";
export const TRADE_DISCOUNT: Record<TradeTier, number> = {
  bronze: 0.80, // 20% off
  silver: 0.72, // 28% off
  gold: 0.65,   // 35% off
};

export const tradePricePerKg = (c: Cheese, tier: TradeTier) =>
  +(c.pricePerKg * TRADE_DISCOUNT[tier]).toFixed(2);

// Catch-weight estimation: W_est = baseUnitWeightKg × qty
export const estimateLine = (c: Cheese, qty: number, perKg: number) => {
  const weight = +(c.baseUnitWeightKg * qty).toFixed(3);
  const total = +(weight * perKg).toFixed(2);
  return { weight, total };
};
