import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDownRight, ArrowRight, Asterisk, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { brand, designs, navigation, socials } from "@/lib/afrostate/config";
import { getDesignLikeCounts } from "@/lib/afrostate/waitlist.functions";
import { WaitlistModal } from "./WaitlistModal";

type Design = (typeof designs)[number];

function JoinButton({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return <Button variant={dark ? "streetDark" : "street"} size="lg" className={`group ${className}`} onClick={() => window.dispatchEvent(new Event("open-waitlist"))}>JOIN THE WAITLIST <ArrowRight className="transition-transform group-hover:translate-x-1" /></Button>;
}

function Marquee({ small = false }: { small?: boolean }) {
  const words = small ? "STREET • CULTURE • ENERGY • AFRICA • STYLE • AFROSTATE • " : "AFROSTATE ★ THE STATE IS COMING ★ ";
  return <div className={`marquee overflow-hidden border-y-4 border-foreground ${small ? "bg-primary py-3" : "bg-foreground py-4 text-background"}`}><div className="marquee-track flex w-max font-display uppercase"><span>{words.repeat(5)}</span><span aria-hidden>{words.repeat(5)}</span></div></div>;
}

function Sticker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-block border-2 border-foreground bg-primary px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0_var(--foreground)] ${className}`}>{children}</span>;
}

export function PublicSite() {
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dropCursor, setDropCursor] = useState({ x: 0, y: 0, visible: false });
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<string[]>([]);
  const [selected, setSelected] = useState<Design | null>(null);
  const [pendingLike, setPendingLike] = useState<{ id: string; name: string } | null>(null);
  const loadCounts = useServerFn(getDesignLikeCounts);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const open = () => { setPendingLike(null); setModal(true); };
    window.addEventListener("open-waitlist", open);
    void loadCounts().then(setLikeCounts).catch(() => {});
    try { setLiked(JSON.parse(localStorage.getItem("afrostate-likes") ?? "[]") as string[]); } catch { /* ignore */ }
    return () => window.removeEventListener("open-waitlist", open);
  }, [loadCounts]);

  function openLike(design: Design) {
    setPendingLike({ id: design.id, name: design.name });
    setModal(true);
  }
  function handleJoined(designId: string | null) {
    void loadCounts().then(setLikeCounts).catch(() => {});
    if (!designId) return;
    setLiked((current) => {
      const next = current.includes(designId) ? current : [...current, designId];
      localStorage.setItem("afrostate-likes", JSON.stringify(next));
      return next;
    });
  }
  function moveHero(event: React.MouseEvent<HTMLElement>) {
    const el = heroRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    el.style.setProperty("--hero-x", `${x}px`); el.style.setProperty("--hero-y", `${y}px`);
  }
  return <div id="top" className="overflow-hidden bg-background">
    <header className="sticky top-0 z-40 border-b-4 border-foreground bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 md:px-8" aria-label="Main navigation">
        <a href="#top" className="block w-28 md:w-36"><img src={brand.logo} alt="AFROSTATE" className="w-full" /></a>
        <div className="hidden items-center gap-9 md:flex">{navigation.map((item) => <a key={item.label} href={item.href} className="story-link text-sm font-black">{item.label}</a>)}</div>
        <JoinButton className="hidden md:inline-flex" />
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</Button>
      </nav>
      {menu && <div className="border-t-2 border-foreground bg-primary p-5 md:hidden">{navigation.map((item) => <a key={item.label} href={item.href} onClick={() => setMenu(false)} className="block border-b-2 border-foreground py-3 font-display text-2xl">{item.label}</a>)}<JoinButton dark className="mt-5 w-full"/></div>}
    </header>

    <main>
      <section ref={heroRef} onMouseMove={moveHero} className="hero-grid relative min-h-[calc(100svh-80px)] border-b-4 border-foreground bg-secondary px-4 pb-7 pt-7 md:px-8">
        <div className="absolute left-[43%] top-8 z-20 hidden rotate-6 md:block"><Sticker>COMING SOON</Sticker></div>
        <div className="relative z-10 flex flex-col justify-center md:pb-16">
          <p className="mb-4 font-mono text-xs font-bold">AFROSTATE® / DROP 001</p>
          <h1 className="hero-title font-display uppercase"><span>Welcome</span><span>to the</span><span className="text-primary">state.</span></h1>
          <p className="mt-6 max-w-xs text-sm font-black uppercase leading-relaxed">{brand.tagline}</p>
          <JoinButton className="mt-7 w-fit" />
        </div>
        <div className="hero-photo relative min-h-[48vh] overflow-hidden border-4 border-foreground bg-muted shadow-[9px_9px_0_var(--foreground)] md:min-h-0">
          <img src={designs[0].image} alt={designs[0].alt} width={1280} height={1600} fetchPriority="high" className="h-full w-full object-cover object-center" />
          <span className="absolute bottom-4 right-4 rotate-[-5deg] border-2 border-foreground bg-primary px-4 py-2 font-display text-2xl">001</span>
        </div>
        <img src={brand.logo} alt="" aria-hidden className="hero-logo pointer-events-none absolute bottom-1 left-[38%] z-20 hidden w-64 rotate-[-8deg] border-4 border-foreground md:block" />
        <div className="absolute right-4 top-4 z-20 font-mono text-xs font-bold [writing-mode:vertical-rl]">NO FIXED ADDRESS / 2026</div>
      </section>
      <Marquee />

      <section id="about" className="relative grid gap-12 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-32 lg:px-20">
        <div><Sticker className="rotate-[-3deg]">STATE OF MIND →</Sticker><h2 className="section-title mt-7 font-display uppercase">This is<br/>Afrostate.</h2></div>
        <div className="flex items-end"><p className="max-w-2xl text-2xl font-bold leading-tight md:text-4xl">{brand.intro}</p></div>
        <Asterisk className="absolute right-5 top-8 size-16 text-primary md:right-16 md:size-28" />
      </section>

      <section id="drop" className="border-y-4 border-foreground bg-foreground px-4 py-20 text-background md:px-8 md:py-28">
        <div className="mx-auto max-w-[1500px]"><div className="mb-10 flex items-end justify-between"><div><p className="font-mono text-sm text-primary">THE FIRST STATE / 001—003</p><h2 className="section-title font-display uppercase">Drop 001</h2></div><ArrowDownRight className="hidden size-20 text-primary md:block"/></div>
          <div className="lookbook-grid">
            {designs.map((design, index) => <article key={design.id} onMouseEnter={() => setDropCursor((cursor) => ({ ...cursor, visible: true }))} onMouseLeave={() => setDropCursor((cursor) => ({ ...cursor, visible: false }))} onMouseMove={(event) => setDropCursor({ x: event.clientX, y: event.clientY, visible: true })} className={`design-card group relative overflow-hidden border-4 border-background ${index === 0 ? "design-one" : index === 1 ? "design-two" : "design-three"}`}>
              <img src={design.image} alt={design.alt} width={index === 2 ? 1536 : index === 0 ? 1280 : 1024} height={index === 2 ? 1024 : index === 0 ? 1600 : 1280} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] group-hover:rotate-[0.4deg]" />
              <div className="absolute inset-x-0 bottom-0 flex translate-y-1 items-center justify-between bg-primary p-4 text-foreground transition-transform group-hover:translate-y-0"><div><span className="font-mono text-xs">{design.category}</span><h3 className="font-display text-2xl">{design.name}</h3></div><ArrowRight className="size-7"/></div>
            </article>)}
          </div>
          <div aria-hidden className={`drop-cursor ${dropCursor.visible ? "opacity-100" : "opacity-0"}`} style={{ transform: `translate3d(${dropCursor.x + 16}px,${dropCursor.y + 16}px,0)` }}>VIEW DROP →</div>
        </div>
      </section>

      <section className="relative min-h-[88vh] overflow-hidden border-b-4 border-foreground">
        <img src={designs[2].image} alt={designs[2].alt} width={1536} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/25" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-background md:p-12"><p className="font-mono font-bold">DROP 001</p><p className="font-display text-[clamp(5rem,17vw,15rem)] uppercase leading-[0.72]">Afrostate</p></div>
      </section>

      <section className="where-section grid min-h-[70vh] place-items-center border-b-4 border-foreground bg-primary px-5 py-20 text-center"><div><p className="mb-5 font-mono text-sm font-bold">YOU FOUND US.</p><h2 className="section-title font-display uppercase">Where are<br/>we going?</h2><p className="mt-3 font-display text-[clamp(4rem,14vw,11rem)] uppercase leading-none text-background [text-shadow:4px_4px_0_var(--foreground)]">Everywhere.</p><div className="mt-8 flex justify-center gap-3 text-4xl"><span>↗</span><span>→</span><span>↘</span></div></div></section>
      <Marquee small />

      <section className="grid border-b-4 border-foreground md:grid-cols-2">
        <div className="min-h-[520px] overflow-hidden border-b-4 border-foreground md:border-b-0 md:border-r-4"><img src={designs[1].image} alt={designs[1].alt} width={1024} height={1280} loading="lazy" className="h-full w-full object-cover" /></div>
        <div className="flex flex-col justify-center bg-background p-7 md:p-14 lg:p-20"><Sticker className="mb-8 w-fit rotate-3">MORE THAN A FIT</Sticker><h2 className="section-title font-display uppercase">More than<br/>clothes.</h2><p className="mt-7 max-w-lg text-xl font-bold leading-relaxed">Identity in motion. Culture without a dress code. AFROSTATE is for the loud ideas, the individual choices and the creativity that refuses to sit still.</p></div>
      </section>

      <section className="relative overflow-hidden bg-foreground px-5 py-24 text-background md:px-10 md:py-36"><div className="leopard-block absolute -right-12 -top-16 size-72 rotate-12 border-4 border-background"/><div className="relative mx-auto max-w-6xl"><p className="font-mono text-sm text-primary">EARLY ACCESS / NO QUEUE JUMPING</p><h2 className="section-title mt-4 font-display uppercase">You want in?</h2><p className="mt-4 font-display text-3xl uppercase text-primary md:text-5xl">The first drop is coming.</p><p className="mt-5 text-lg font-bold">Get on the list before everybody else.</p><JoinButton className="mt-9" /></div></section>
    </main>

    <footer className="bg-secondary px-5 py-16 md:px-10"><div className="mx-auto max-w-[1500px]"><img src={brand.logo} alt="AFROSTATE" className="w-48 border-2 border-foreground md:w-64"/><div className="my-14 flex flex-col items-start justify-between gap-8 border-y-4 border-foreground py-10 md:flex-row md:items-end"><h2 className="font-display text-[clamp(4rem,11vw,10rem)] uppercase leading-[0.78]">See you in<br/>the state.</h2><JoinButton className="shrink-0"/></div><div className="flex flex-col justify-between gap-8 font-black md:flex-row md:items-end"><div className="flex gap-6">{socials.map((social) => <span key={social.label} className="cursor-default border-b-2 border-foreground">{social.label}</span>)}</div><p>© 2026 AFROSTATE</p></div></div></footer>
    <WaitlistModal open={modal} onOpenChange={setModal}/>
  </div>;
}