"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Wallet,
  ShoppingCart,
  Zap,
  Lock,
  CreditCard,
  Headphones,
  ArrowRight,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const CATEGORIES_PREVIEW = [
  { name: "Free Fire", category: "Diamants", emoji: "🔥", href: "/products?category=free-fire" },
  { name: "PUBG Mobile", category: "UC", emoji: "🔫", href: "/products?category=pubg" },
  { name: "Google Play", category: "Cartes cadeaux", emoji: "🎁", href: "/products?category=google-play" },
  { name: "PlayStation", category: "PSN", emoji: "🎮", href: "/products?category=playstation" },
] as const;

const FAQ_ITEMS = [
  {
    q: "Comment fonctionne le paiement ?",
    a: "Tu recharges ton wallet Tunixo en TND via D17, virement ou carte locale. Ensuite tu utilises ce solde pour commander n'importe quel service.",
  },
  {
    q: "Combien de temps prend la livraison ?",
    a: "Cartes cadeaux : instantané. Top-up jeux : généralement en quelques minutes.",
  },
  {
    q: "Est-ce que c'est légal en Tunisie ?",
    a: "Oui. Tunixo est une marketplace de services numériques enregistrée en Tunisie (SUARL). Notre modèle met en relation des utilisateurs au sein d'une communauté d'entraide digitale. Toutes les transactions entre utilisateurs sont effectuées en dinars tunisiens (TND), conformément aux réglementations de la BCT.",
  },
  {
    q: "Combien de temps pour recevoir mon top-up ?",
    a: "Les cartes cadeaux (Google Play, PlayStation) sont livrées instantanément. Les top-up jeux (Free Fire, PUBG) sont traités en quelques minutes. En cas d'échec, ton wallet est remboursé automatiquement.",
  },
  {
    q: "Que se passe-t-il si mon top-up échoue ?",
    a: "Ton wallet est remboursé automatiquement. Tu peux réessayer ou contacter le support.",
  },
] as const;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white antialiased">
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-white/5 bg-black/50 backdrop-blur-md" : ""}`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Tunixo"
              width={130}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5558e3]"
            >
              Commencer
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6366f1]/20 blur-[120px]" />
          <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-purple-600/15 blur-[80px]" />
          <div className="absolute bottom-1/4 left-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <Image
            src="/assets/logo-icon.png"
            alt="Tunixo"
            width={80}
            height={80}
            className="mb-6 h-20 w-20"
            priority
          />
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#6366f1]/50 bg-[#6366f1]/5 px-3 py-1 text-xs font-medium text-gray-300">
            🇹🇳 Fait pour les Tunisiens
          </span>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-white">
              Top-up tes jeux en TND
            </span>
            <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent"> 🎮</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-gray-400 sm:text-lg">
            Free Fire, PUBG, Google Play et PlayStation — rechargez en dinars tunisiens. Paiement local via Konnect.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#5558e3]"
            >
              Commencer maintenant <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              Voir les offres
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                500+
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Utilisateurs actifs
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                4
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Catégories
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                Instantané
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Livraison
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
            Comment ça marche ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-gray-400">
            Simple, rapide, sécurisé
          </p>
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-6">
            {[
              {
                step: 1,
                Icon: Wallet,
                title: "Recharge ton wallet",
                desc: "Paie en TND via D17, virement ou carte bancaire locale",
              },
              {
                step: 2,
                Icon: ShoppingCart,
                title: "Choisis ton produit",
                desc: "Free Fire, PUBG, Google Play ou PlayStation — sélectionne ton top-up ou carte cadeau",
              },
              {
                step: 3,
                Icon: Zap,
                title: "Reçois en quelques secondes",
                desc: "Top-up crédité ou code cadeau livré instantanément",
              },
            ].map(({ step, Icon, title, desc }) => (
              <div
                key={step}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/20 text-sm font-bold text-[#6366f1]">
                  {step}
                </div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-[#111111] text-[#6366f1]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
            Top-up & Cartes cadeaux
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-gray-400">
            Free Fire, PUBG, Google Play, PlayStation
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES_PREVIEW.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className="group rounded-lg border border-white/10 bg-[#111111] p-6 text-center transition-all duration-300 hover:scale-[1.02] hover:border-[#6366f1]/50"
              >
                <span className="text-4xl">{c.emoji}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{c.category}</p>
                <span className="mt-3 inline-block text-sm font-medium text-[#6366f1] group-hover:underline">
                  Voir les offres →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6366f1] transition-colors hover:text-[#818cf8]"
            >
              Voir tous les produits <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-block rounded-full border border-[#6366f1]/50 bg-[#6366f1]/5 px-3 py-1 text-xs font-medium text-gray-300">
                💡 Simple et rapide
              </span>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Recharge en TND, reçois en secondes
              </h2>
              <p className="mt-4 text-gray-400">
                Plus besoin de carte internationale. Recharge ton wallet en dinars
                via Konnect, puis commande ton top-up Free Fire, PUBG ou ta carte
                Google Play / PlayStation. Livraison automatique.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Paiement 100% en TND",
                  "Livraison instantanée",
                  "Support réactif",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <Check className="h-5 w-5 shrink-0 text-[#6366f1]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-[#6366f1] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#6366f1] transition-all duration-300 hover:bg-[#6366f1]/10"
              >
                Créer un compte <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative flex justify-center">
              <div
                className="w-full max-w-sm rounded-xl border border-white/10 bg-[#111111] p-6 shadow-xl"
                style={{ animation: "float 6s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Sparkles className="h-4 w-4 text-[#6366f1]" /> Top-up livré ✅
                </div>
                <div className="mt-4 text-lg font-semibold text-white">
                  Free Fire 310 Diamonds
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  ​14 TND — Livré en &lt; 1 min
                </p>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <span className="text-xl font-bold text-[#6366f1]">
                    Player ID crédité
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
            Pourquoi Tunixo ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-gray-400">
            La solution pensée pour les Tunisiens
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Livraison instantanée",
                desc: "Top-up crédité en quelques secondes",
              },
              {
                icon: Lock,
                title: "100% Sécurisé",
                desc: "Paiement local en TND via Konnect",
              },
              {
                icon: CreditCard,
                title: "Tous vos jeux",
                desc: "Free Fire, PUBG, Google Play, PlayStation",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-[#6366f1]/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#6366f1]/10 text-[#6366f1]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
            Questions fréquentes
          </h2>
          <div className="mt-12 space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 bg-[#111111] transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:bg-white/5"
                >
                  {item.q}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${openFaq === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="border-t border-white/10 px-5 py-4 text-sm text-gray-400">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-900/95 to-purple-900"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Prêt à accéder au digital mondial ?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Rejoins des centaines de Tunisiens qui utilisent déjà Tunixo
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-base font-semibold text-indigo-900 transition-all duration-300 hover:bg-gray-100"
            >
              Créer mon compte
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
            >
              Voir les offres
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-[#0a0a0a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/assets/logo.png"
                  alt="Tunixo"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                Tunisia&apos;s Digital Gateway
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Plateforme</h4>
              <ul className="mt-4 space-y-2">
                {["Produits", "Comment ça marche", "FAQ"].map((label) => (
                  <li key={label}>
                    <Link
                      href={
                        label === "Produits"
                          ? "/products"
                          : label === "FAQ"
                            ? "#faq"
                            : "/"
                      }
                      className="text-sm text-gray-500 transition-colors hover:text-gray-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Compte</h4>
              <ul className="mt-4 space-y-2">
                {["Créer un compte", "Se connecter"].map((label) => (
                  <li key={label}>
                    <Link
                      href={label === "Créer un compte" ? "/register" : "/login"}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Support</h4>
              <ul className="mt-4 space-y-2">
                {[
                  "Contact",
                  "Politique de confidentialité",
                  "Conditions d'utilisation",
                ].map((label) => (
                  <li key={label}>
                    <Link
                      href="/"
                      className="text-sm text-gray-500 transition-colors hover:text-gray-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
            <p className="text-sm text-gray-500">
              © 2026 Tunixo. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html:
            "@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }",
        }}
      />
    </div>
  );
}
