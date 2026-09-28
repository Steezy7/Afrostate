import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Design } from "@/lib/afrostate/config";
import { ColorWheel } from "./ColorWheel";

const pad = (n: number) => String(n).padStart(2, "0");

export function DesignDetail({ design, likes, liked, onClose, onLike }: { design: Design | null; likes: number; liked: boolean; onClose: () => void; onLike: (design: Design) => void }) {
  return (
    <Dialog open={Boolean(design)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="h-[min(92svh,880px)] w-[calc(100vw-1.5rem)] max-w-6xl gap-0 overflow-hidden rounded-none border-4 border-foreground bg-background p-0 shadow-[10px_10px_0_var(--foreground)] sm:max-w-6xl sm:rounded-none">
        {design && <DetailBody key={design.id} design={design} likes={likes} liked={liked} onLike={onLike} />}
      </DialogContent>
    </Dialog>
  );
}

function DetailBody({ design, likes, liked, onLike }: { design: Design; likes: number; liked: boolean; onLike: (design: Design) => void }) {
  const [index, setIndex] = useState(0);
  const color = design.colors[index];
  const photo = color?.modelImage ?? design.image;

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(0,40%)_minmax(0,1fr)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:grid-rows-1">
      <div className="relative min-h-0 overflow-hidden border-b-4 border-foreground bg-muted md:border-b-0 md:border-r-4">
        <img key={photo} src={photo} alt={design.alt} className="h-full w-full object-cover animate-in fade-in duration-500" />
        <span className="absolute left-4 top-4 border-2 border-foreground bg-background px-3 py-1 font-mono text-xs font-black">{design.id} / 010</span>
        {color && <span className="absolute bottom-4 left-4 flex items-center gap-2 border-2 border-foreground bg-primary px-3 py-1.5 font-display text-lg uppercase shadow-[3px_3px_0_var(--foreground)]"><span className="size-3 rounded-full border border-foreground" style={{ background: color.swatch }} />{color.name}</span>}
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="px-5 pb-3 pt-5 pr-12 md:px-8 md:pb-4 md:pt-8">
          <span className="inline-block rotate-[-2deg] border-2 border-foreground bg-primary px-3 py-1 text-xs font-black uppercase">{design.category}</span>
          <DialogTitle className="mt-3 font-display text-4xl uppercase leading-[0.85] md:mt-5 md:text-6xl">{design.name}</DialogTitle>
          <DialogDescription className="sr-only text-sm font-bold text-foreground/70 md:not-sr-only md:mt-4 md:block">{design.alt}</DialogDescription>
        </div>

        {design.colors.length > 0 && <>
          <div className="flex items-center justify-between border-t-2 border-foreground px-5 py-2 font-mono text-xs font-black md:px-8">
            <span>COLOURS — SCROLL</span>
            <span>{pad(index + 1)} / {pad(design.colors.length)}</span>
          </div>
          <div className="min-h-[180px] flex-1">
            <ColorWheel colors={design.colors} value={index} onChange={setIndex} label={`${design.name} colours`} />
          </div>
        </>}

        <div className="border-t-4 border-foreground p-4 md:p-6">
          <p className="mb-3 font-mono text-xs font-black">{likes} {likes === 1 ? "LIKE" : "LIKES"}</p>
          <Button variant="street" size="lg" className="w-full" onClick={() => onLike(design)}><Heart className={liked ? "fill-current" : ""} /> LIKE TO JOIN WAITLIST</Button>
        </div>
      </div>
    </div>
  );
}
