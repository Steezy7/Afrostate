import logo from "@/assets/afrostate-logo.png.asset.json";
import heroImage from "@/assets/afrostate-hero.jpg";
import duoImage from "@/assets/afrostate-duo.jpg";
import detailImage from "@/assets/afrostate-detail.jpg";

export const brand = {
  name: "AFROSTATE",
  logo: logo.url,
  tagline: "AFRICAN ENERGY. STREET CULTURE. NO RULES.",
  intro:
    "AFROSTATE is a streetwear project built around identity, creativity, movement and the energy of a generation creating its own rules.",
};

export const navigation = [
  { label: "HOME", href: "#top" },
  { label: "THE DROP", href: "#drop" },
  { label: "ABOUT", href: "#about" },
];

export const designs = [
  { id: "001", name: "AFROSTATE 001", image: heroImage, category: "DROP 001", alt: "Model wearing a navy and cream oversized AFROSTATE-inspired streetwear look" },
  { id: "002", name: "AFROSTATE 002", image: detailImage, category: "DROP 001", alt: "Model in a navy streetwear set with cream piping and leopard-print accents" },
  { id: "003", name: "AFROSTATE 003", image: duoImage, category: "DROP 001", alt: "Two models in coordinated cream, black, and navy streetwear looks" },
];

export const socials = [
  { label: "INSTAGRAM", href: "" },
  { label: "TIKTOK", href: "" },
  { label: "WHATSAPP", href: "" },
];