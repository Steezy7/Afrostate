import brandLogo from "/src/assets/afrostate-brand-optimized.jpg";
import drop001Hero from "@/assets/drop001/hero-white.jpg";
import shirtWhite from "@/assets/drop001/shirt-white.jpg";
import shirtBlack from "@/assets/drop001/shirt-black.jpg";
import shirtRed from "@/assets/drop001/shirt-red.jpg";
import shirtRoyalBlue from "@/assets/drop001/shirt-royal-blue.jpg";
import shirtGreen from "@/assets/drop001/shirt-green.jpg";
import shirtCream from "@/assets/drop001/shirt-cream.jpg";
import shirtNavy from "@/assets/drop001/shirt-navy.jpg";
import shirtBrown from "@/assets/drop001/shirt-brown.jpg";
import shirtGrey from "@/assets/drop001/shirt-grey.jpg";
import modelWhite from "@/assets/drop001/model-white.jpg";
import modelBlack from "@/assets/drop001/model-black.jpg";
import modelRed from "@/assets/drop001/model-red.jpg";
import modelRoyalBlue from "@/assets/drop001/model-royal-blue.jpg";
import modelGreen from "@/assets/drop001/model-green.jpg";
import modelCream from "@/assets/drop001/model-cream.jpg";
import modelNavy from "@/assets/drop001/model-navy.jpg";
import modelBrown from "@/assets/drop001/model-brown.jpg";
import modelGrey from "@/assets/drop001/model-grey.jpg";
import drop002Hero from "@/assets/drop002/hero-black.jpg";
import drop003Model from "@/assets/drop003/model-black.jpg";
import drop003FrontBack from "@/assets/drop003/front-back.jpg";
import drop004Hero from "@/assets/drop004/hero-black.jpg";
import teeRed from "@/assets/drop004/tee-red.jpg";
import groupModelRed from "@/assets/drop004/model-red.jpg";
import teeBlack from "@/assets/drop004/tee-black.jpg";
import groupModelBlack from "@/assets/drop004/model-black.jpg";
import teeWhite from "@/assets/drop004/tee-white.jpg";
import groupModelWhite from "@/assets/drop004/model-white.jpg";
import shortsBlack from "@/assets/drop002/shorts-black.jpg";
import jortsModelBlack from "@/assets/drop002/model-black.jpg";
import shortsWhite from "@/assets/drop002/shorts-white.jpg";
import jortsModelWhite from "@/assets/drop002/model-white.jpg";
import shortsRed from "@/assets/drop002/shorts-red.jpg";
import jortsModelRed from "@/assets/drop002/model-red.jpg";
import shortsRoyalBlue from "@/assets/drop002/shorts-royal-blue.jpg";
import jortsModelRoyalBlue from "@/assets/drop002/model-royal-blue.jpg";
import shortsGreen from "@/assets/drop002/shorts-green.jpg";
import jortsModelGreen from "@/assets/drop002/model-green.jpg";
import shortsStone from "@/assets/drop002/shorts-stone.jpg";
import jortsModelStone from "@/assets/drop002/model-stone.jpg";
import shortsNavy from "@/assets/drop002/shorts-navy.jpg";
import jortsModelNavy from "@/assets/drop002/model-navy.jpg";
import shortsBrown from "@/assets/drop002/shorts-brown.jpg";
import jortsModelBrown from "@/assets/drop002/model-brown.jpg";
import shortsGrey from "@/assets/drop002/shorts-grey.jpg";
import jortsModelGrey from "@/assets/drop002/model-grey.jpg";

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
  /** Product copy shown in the detail view. Falls back to `alt`. */
  description?: string;
  /** Short catchy line shown on a yellow banner under the description. */
  tagline?: string;
  /** CSS object-position for the card photo and phone crops — point it at the product (e.g. "center 70%" for shorts). */
  focus?: string;
  /** Single-colour pieces: front/back product shot shown instead of the colour wheel. */
  productShot?: string;
  colors: DesignColor[];
};

// Drop 002 jorts: same model and pose in every shot, only the shorts change.
const drop002Colors: DesignColor[] = [
  { name: "Black", swatch: "#111111", image: shortsBlack, modelImage: jortsModelBlack },
  { name: "White", swatch: "#f4f4f2", image: shortsWhite, modelImage: jortsModelWhite },
  { name: "Red", swatch: "#d01419", image: shortsRed, modelImage: jortsModelRed },
  { name: "Royal Blue", swatch: "#1f3fd1", image: shortsRoyalBlue, modelImage: jortsModelRoyalBlue },
  { name: "Green", swatch: "#1d4a2a", image: shortsGreen, modelImage: jortsModelGreen },
  { name: "Stone", swatch: "#dcd2bd", image: shortsStone, modelImage: jortsModelStone },
  { name: "Navy", swatch: "#17214f", image: shortsNavy, modelImage: jortsModelNavy },
  { name: "Brown", swatch: "#4e2e1c", image: shortsBrown, modelImage: jortsModelBrown },
  { name: "Grey", swatch: "#c4c4c4", image: shortsGrey, modelImage: jortsModelGrey },
];

// Drop 004 AFRO graphic tee: same group shot in each colour, only the tees change.
const drop004Colors: DesignColor[] = [
  { name: "Black", swatch: "#111111", image: teeBlack, modelImage: groupModelBlack },
  { name: "Red", swatch: "#d8261b", image: teeRed, modelImage: groupModelRed },
  { name: "White", swatch: "#f4f4f2", image: teeWhite, modelImage: groupModelWhite },
];

// Drop 001 jersey: the model shots are all the same pose, so swapping them reads as only the shirt changing.
const drop001Colors: DesignColor[] = [
  { name: "White", swatch: "#f4f4f2", image: shirtWhite, modelImage: modelWhite },
  { name: "Black", swatch: "#111111", image: shirtBlack, modelImage: modelBlack },
  { name: "Red", swatch: "#d8121b", image: shirtRed, modelImage: modelRed },
  { name: "Royal Blue", swatch: "#1f3fd1", image: shirtRoyalBlue, modelImage: modelRoyalBlue },
  { name: "Green", swatch: "#1d4a2a", image: shirtGreen, modelImage: modelGreen },
  { name: "Cream", swatch: "#ece3cc", image: shirtCream, modelImage: modelCream },
  { name: "Navy", swatch: "#17214f", image: shirtNavy, modelImage: modelNavy },
  { name: "Brown", swatch: "#4e2e1c", image: shirtBrown, modelImage: modelBrown },
  { name: "Grey", swatch: "#c9c9c9", image: shirtGrey, modelImage: modelGrey },
];

export const designs = [
  { id: "001", name: "AFROSTATE 001", image: drop001Hero, category: "DROP 001", alt: "Model in the white AFROSTATE jersey crop top with leopard and Union Jack badges", description: "AFROSTATE women's cropped V-collar tee.", tagline: "Women's state of mind.", colors: drop001Colors },
  { id: "002", name: "AFROSTATE 002", image: drop002Hero, category: "DROP 002", alt: "Model in black AFROSTATE street jorts with a leopard-print waistband, styled with the black jersey crop tee", description: "AFROSTATE leopard-waist street jorts. Long-line, loose through the leg, finished with the running-man logo.", tagline: "Built for the block.", focus: "center 72%", colors: drop002Colors },
  { id: "003", name: "AFROSTATE 003", image: drop003Model, category: "DROP 003", alt: "Model in the black AFROSTATE leopard-panel jersey polo", description: "AFROSTATE leopard-panel jersey polo. Three-button placket, piped side panels, No. 16 across the back. Black only.", tagline: "Hush. The State is here.", productShot: drop003FrontBack, colors: [] },
  { id: "004", name: "AFROSTATE 004", image: drop004Hero, category: "DROP 004", alt: "Three models on a stairwell in matching black AFROSTATE AFRO graphic tees", description: "AFROSTATE AFRO graphic tee. Leopard-filled block letters, distressed print, running-man mark. Red, black or white.", tagline: "Rep the State.", focus: "center 30%", colors: drop004Colors },
] as const satisfies readonly Design[];

/** Number of drops, zero-padded ("004"), for the "001 / 004" style counters. */
export const dropTotal = String(designs.length).padStart(3, "0");

// The drop featured in the home page hero photo (by id, so likes keep their numbering).
export const heroDesign = designs.find((d) => d.id === "003") ?? designs[0];

export const socials = [
  { label: "INSTAGRAM", href: "" },
  { label: "TIKTOK", href: "https://www.tiktok.com/@beama044?_r=1&_t=ZS-9A13bGHdPL0" },
  { label: "WHATSAPP", href: "https://wa.me/2347013422690" },
];