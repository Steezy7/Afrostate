import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist } from "@/lib/afrostate/waitlist.functions";

export function WaitlistModal({ open, onOpenChange, likedDesign, onJoined }: { open: boolean; onOpenChange: (open: boolean) => void; likedDesign?: { id: string; name: string } | null; onJoined?: (designId: string | null) => void }) {
  const submit = useServerFn(joinWaitlist);
  const [state, setState] = useState<"form" | "success" | "duplicate">("form");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await submit({ data: {
        fullName: String(form.get("fullName") ?? ""),
        phoneNumber: String(form.get("phoneNumber") ?? ""),
        email: String(form.get("email") ?? ""),
        likedDesignId: likedDesign?.id ?? "",
      }});
      if (result.status === "invalid_phone") setError("Use 08012345678 or +2348012345678.");
      else {
        setState(result.status === "duplicate" ? "duplicate" : "success");
        onJoined?.(likedDesign?.id ?? null);
      }
    } catch {
      setError("Something got in the way. Try again.");
    } finally { setBusy(false); }
  }

  function setOpen(next: boolean) {
    onOpenChange(next);
    if (!next) window.setTimeout(() => { setState("form"); setError(""); }, 250);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-none border-4 border-foreground bg-primary p-0 shadow-[10px_10px_0_var(--foreground)] sm:max-w-xl">
        {state === "form" ? (
          <div className="grid gap-0 sm:grid-cols-[100px_1fr]">
            <div className="leopard-strip hidden border-r-4 border-foreground sm:block" />
            <form onSubmit={handleSubmit} className="p-7 sm:p-10">
              <div className="mb-8 inline-block rotate-[-2deg] border-2 border-foreground bg-background px-3 py-1 text-xs font-black uppercase">{likedDesign ? `LIKING ${likedDesign.name}` : "Drop 001 / Early Access"}</div>
              <DialogTitle className="font-display text-5xl uppercase leading-[0.85] sm:text-6xl">Get in<br/>early.</DialogTitle>
              <DialogDescription className="mt-4 max-w-sm text-base font-semibold text-foreground/75">{likedDesign ? `Drop your details to like ${likedDesign.name} and get notified when AFROSTATE goes live.` : "Drop your details. We'll let you know when AFROSTATE goes live."}</DialogDescription>
              <div className="mt-8 space-y-5">
                <div><Label htmlFor="fullName" className="font-black">FULL NAME *</Label><Input id="fullName" name="fullName" required minLength={2} maxLength={100} autoComplete="name" className="mt-2 h-12 rounded-none border-2 border-foreground bg-background font-bold" /></div>
                <div><Label htmlFor="phoneNumber" className="font-black">PHONE NUMBER *</Label><Input id="phoneNumber" name="phoneNumber" required inputMode="tel" autoComplete="tel" placeholder="08012345678" className="mt-2 h-12 rounded-none border-2 border-foreground bg-background font-bold" /></div>
                <div><Label htmlFor="email" className="font-black">EMAIL ADDRESS <span className="font-medium opacity-60">(OPTIONAL)</span></Label><Input id="email" name="email" type="email" maxLength={255} autoComplete="email" className="mt-2 h-12 rounded-none border-2 border-foreground bg-background font-bold" /></div>
              </div>
              {error && <p role="alert" className="mt-4 border-l-4 border-destructive pl-3 text-sm font-bold">{error}</p>}
              <Button type="submit" variant="streetDark" size="lg" disabled={busy} className="mt-7 w-full justify-between text-base">{busy ? "JOINING..." : "JOIN THE STATE"}<ArrowRight /></Button>
            </form>
          </div>
        ) : (
          <div className="flex min-h-[480px] flex-col items-center justify-center p-10 text-center">
            <div className="relative mb-7 grid size-24 place-items-center rotate-6 border-4 border-foreground bg-background shadow-[7px_7px_0_var(--foreground)]"><Check className="size-12" strokeWidth={4}/><Sparkles className="absolute -right-8 -top-6 size-9"/></div>
            <DialogTitle className="font-display text-6xl uppercase leading-none">{state === "duplicate" ? "You're already in." : "You're in."}</DialogTitle>
            <DialogDescription className="mt-4 text-lg font-bold text-foreground">{state === "duplicate" ? "Your number is already on the list." : "Welcome to AFROSTATE."}</DialogDescription>
            <Button variant="streetDark" className="mt-8" onClick={() => setOpen(false)}>BACK TO THE STATE</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}