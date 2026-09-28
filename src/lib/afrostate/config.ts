import brandLogo from "/src/assets/afrostate-brand-optimized.jpg";
import heroImage from "@/assets/afrostate-hero-optimized.jpg";
import duoImage from "@/assets/afrostate-duo-optimized.jpg";
import detailImage from "@/assets/afrostate-detail-optimized.jpg";

export const brand = {
  name: "AFROSTATE",
  logo: brandLogo,
  tagline: "AFRICAN ENERGY. STREET CULTURE. NO RULES.",
  intro:
    "AFROSTATE is a streetwear project built around identity, creativity, movement and the energy of a generation creating its own rules.",
};

export const navigation = [
  { label: "HOME", href: "#top" },
  { label: "THE DROP", href: "#drop" },
  { label: "ABOUT", href: "#about" },
];

export type DesignColor = {
  name: string;
  /** Hex used for the little colour dot in the picker. */
  swatch: string;
  /** Product shot of the piece in this colour — shown in the colour wheel. */
  image: string;
  /** Optional: model wearing this colour. Replaces the main photo while this colour is selected. */
  modelImage?: string;
};

export type Design = {
  id: string;
  name: string;
  image: string;
  category: string;
  alt: string;
  colors: DesignColor[];
};

// Placeholder colourways until the real product shots are in. Give each design its own list:
// import the photo from src/assets and set `image` (and `modelImage` if you have one).
const placeholderColors: DesignColor[] = [
  { name: "Navy", swatch: "#1f2b5e", image: detailImage },
  { name: "Cream", swatch: "#efe3c8", image: heroImage },
  { name: "Black", swatch: "#161616", image: duoImage },
  { name: "Leopard", swatch: "#b5854b", image: detailImage },
  { name: "Sand", swatch: "#d9bb8b", image: heroImage },
];

export const designs = [
  { id: "001", name: "AFROSTATE 001", image: heroImage, category: "DROP 001", alt: "Model wearing a navy and cream oversized AFROSTATE-inspired streetwear look", colors: placeholderColors },
  { id: "002", name: "AFROSTATE 002", image: detailImage, category: "DROP 001", alt: "Model in a navy streetwear set with cream piping and leopard-print accents", colors: placeholderColors },
  { id: "003", name: "AFROSTATE 003", image: duoImage, category: "DROP 001", alt: "Two models in coordinated cream, black, and navy streetwear looks", colors: placeholderColors },
  { id: "004", name: "AFROSTATE 004", image: detailImage, category: "DROP 001", alt: "Editorial detail of navy streetwear with cream piping and leopard-print accents", colors: placeholderColors },
  { id: "005", name: "AFROSTATE 005", image: duoImage, category: "DROP 001", alt: "Wide campaign crop of two models in coordinated AFROSTATE-inspired looks", colors: placeholderColors },
  { id: "006", name: "AFROSTATE 006", image: heroImage, category: "DROP 001", alt: "Close campaign crop of an oversized navy and cream streetwear look", colors: placeholderColors },
  { id: "007", name: "AFROSTATE 007", image: duoImage, category: "DROP 001", alt: "Outdoor editorial view of coordinated cream, black, and navy streetwear", colors: placeholderColors },
  { id: "008", name: "AFROSTATE 008", image: detailImage, category: "DROP 001", alt: "Cropped AFROSTATE-inspired jacket detail against a yellow backdrop", colors: placeholderColors },
  { id: "009", name: "AFROSTATE 009", image: heroImage, category: "DROP 001", alt: "Full-length editorial view of a navy and cream streetwear silhouette", colors: placeholderColors },
  { id: "010", name: "AFROSTATE 010", image: duoImage, category: "DROP 001", alt: "Cinematic campaign view of two coordinated streetwear looks", colors: placeholderColors },
] as const satisfies readonly Design[];

export const socials = [
  { label: "INSTAGRAM", href: "" },
  { label: "TIKTOK", href: "https://www.tiktok.com/@beama044?_r=1&_t=ZS-9A13bGHdPL0" },
  { label: "WHATSAPP", href: "https://wa.me/2347013422690" },
];