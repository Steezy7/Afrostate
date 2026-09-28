import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { dropTotal, type Design } from "@/lib/afrostate/config";
import { ColorWheel } from "./ColorWheel";

const pad = (n: number) => String(n).padStart(2, "0");

export function DesignDetail({ design, likes, liked, onClose, onLike }: { design: Design | null; likes: number; liked: boolean; onClose: () => void; onLike: (design: Design, color: string) => void }) {
  return (
    <Dialog open={Boolean(design)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="h-[min(92svh,880px)] w-[calc(100vw-1.5rem)] max-w-6xl gap-0 overflow-hidden rounded-none border-4 border-foreground bg-background p-0 shadow-[10px_10px_0_var(--foreground)] sm:max-w-6xl sm:rounded-none">
        {design && <DetailBody key={design.id} design={design} likes={likes} liked={liked} onLike={onLike} />}
      </DialogContent>
    </Dialog>
  );
}

function DetailBody({ design, likes, liked, onLike }: { design: Design; likes: number; liked: boolean; onLike: (design: Design, color: string) => void }) {
  const [index, setIndex] = useState(0);
  const color = design.colors[index];
  // Every model shot is mounted at once and stacked, so switching colour is just an opacity flip — no loading gap.
  const needsBase = design.colors.length === 0 || design.colors.some((c) => !c.modelImage);
  const photos = [...new Set([...(needsBase ? [design.image] : []), ...design.colors.map((c) => c.modelImage).filter((src): src is string => Boolean(src))])];
  const photo = color?.modelImage ?? design.image;

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(0,34%)_minmax(0,1fr)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:grid-rows-1">
      <div className="relative min-h-0 overflow-hidden border-b-4 border-foreground bg-muted md:border-b-0 md:border-r-4">
        {photos.map((src) => (
          <img key={src} src={src} alt={src === photo ? `${design.alt}${color ? ` — ${color.name}` : ""}` : ""} aria-hidden={src !== photo} decoding="async" style={{ "--focus": design.focus ?? "center 45%" } as React.CSSProperties} className={`absolute inset-0 h-full w-full object-cover object-[var(--focus)] transition-opacity md:object-top duration-150 ease-out ${src === photo ? "opacity-100" : "opacity-0"}`} />
        ))}
        <span className="absolute left-4 top-4 border-2 border-foreground bg-background px-3 py-1 font-mono text-xs font-black">{design.id} / {dropTotal}</span>
        {color && <span className="absolute bottom-4 left-4 flex items-center gap-2 border-2 border-foreground bg-primary px-3 py-1.5 font-display text-lg uppercase shadow-[3px_3px_0_var(--foreground)]"><span className="size-3 rounded-full border border-foreground" style={{ background: color.swatch }} />{color.name}</span>}
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="px-5 pb-3 pt-4 pr-12 md:px-8 md:pb-4 md:pt-8">
          <span className="inline-block rotate-[-2deg] border-2 border-foreground bg-primary px-3 py-1 text-xs font-black uppercase">{design.category}</span>
          <DialogTitle className="mt-3 font-display text-4xl uppercase leading-[0.85] md:mt-5 md:text-6xl">{design.name}</DialogTitle>
          <DialogDescription className="mt-2 line-clamp-2 text-xs font-bold leading-snug text-foreground/70 md:mt-4 md:line-clamp-none md:text-sm">{design.description ?? design.alt}</DialogDescription>
          {design.tagline && <p className="mt-3 inline-block rotate-[-1.5deg] border-2 border-foreground bg-primary px-3 py-1 font-display text-xl uppercase leading-none shadow-[3px_3px_0_var(--foreground)] md:mt-4 md:text-3xl">{design.tagline}</p>}
        </div>

        {design.colors.length > 0 ? <>
          <div className="flex items-center justify-between border-t-2 border-foreground px-5 py-2 font-mono text-xs font-black md:px-8">
            <span>COLOURS — SCROLL</span>
            <span>{pad(index + 1)} / {pad(design.colors.length)}</span>
          </div>
          <div className="min-h-[96px] flex-1">
            <ColorWheel colors={design.colors} value={index} onChange={setIndex} label={`${design.name} colours`} />
          </div>
        </> : design.productShot ? <>
          <div className="flex items-center justify-between border-t-2 border-foreground px-5 py-2 font-mono text-xs font-black md:px-8">
            <span>FRONT / BACK</span>
            <span>ONE COLOURWAY</span>
          </div>
          <div className="flex min-h-[96px] flex-1 items-center justify-center bg-white p-3 md:p-6">
            <img src={design.productShot} alt={`${design.name} front and back`} className="h-full max-h-full w-full object-contain" />
          </div>
        </> : <div className="flex-1" />}

        <div className="border-t-4 border-foreground p-3 md:p-6">
          <p className="mb-2 font-mono text-xs font-black md:mb-3">{likes} {likes === 1 ? "LIKE" : "LIKES"}</p>
          <Button variant="street" size="lg" className="w-full" onClick={() => onLike(design, color?.name ?? "")}><Heart className={liked ? "fill-current" : ""} /> LIKE TO JOIN WAITLIST</Button>
        </div>
      </div>
    </div>
  );
}
