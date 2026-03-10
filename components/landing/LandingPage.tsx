'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
} from 'lucide-react'

const SERVICES = [
  { name: 'Cursor Pro', category: 'AI Code Editor', price: 75 },
  { name: 'ChatGPT Plus', category: 'AI Assistant', price: 95 },
  { name: 'Midjourney', category: 'AI Image Generator', price: 85 },
  { name: 'Adobe Creative', category: 'Design Suite', price: 120 },
  { name: 'Notion Pro', category: 'Productivity', price: 45 },
  { name: 'Figma Pro', category: 'UI Design', price: 65 },
] as const

const FAQ_ITEMS = [
  { q: "Comment fonctionne le paiement ?", a: "Tu recharges ton wallet Tunixo en TND via D17, virement ou carte locale. Ensuite tu utilises ce solde pour commander n'importe quel service." },
  { q: "Combien de temps prend la livraison ?", a: "La plupart des services sont livrés automatiquement en moins d'une heure. Dans certains cas, notre équipe traite la commande manuellement sous 24h." },
  { q: "Est-ce que c'est légal en Tunisie ?", a: "Oui. Tunixo est une marketplace de services numériques enregistrée en Tunisie (SUARL). Notre modèle met en relation des utilisateurs au sein d'une communauté d'entraide digitale. Toutes les transactions entre utilisateurs sont effectuées en dinars tunisiens (TND), conformément aux réglementations de la BCT." },
  { q: "Comment fonctionne la mise en relation ?", a: "Les membres de notre communauté qui ont des revenus sur des plateformes digitales peuvent choisir de financer des abonnements pour d'autres utilisateurs. En échange, ils reçoivent des crédits TND dans leur wallet Tunixo, retirables via D17 ou virement bancaire sous 24h." },
  { q: "Que se passe-t-il si mon abonnement ne fonctionne pas ?", a: "Notre équipe support intervient immédiatement pour résoudre le problème ou te rembourser intégralement." },
] as const

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white antialiased">
      <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/5 bg-black/50 backdrop-blur-md' : ''}`}>
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-[#6366f1]">Tunixo</Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white">Se connecter</Link>
            <Link href="/register" className="rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5558e3]">Commencer</Link>
          </div>
        </nav>
      </header>

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6366f1]/20 blur-[120px]" />
          <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-purple-600/15 blur-[80px]" />
          <div className="absolute bottom-1/4 left-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-[60px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#6366f1]/50 bg-[#6366f1]/5 px-3 py-1 text-xs font-medium text-gray-300">🇹🇳 Fait pour les Tunisiens</span>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-white">Accède aux services digitaux mondiaux</span>
            <br />
            <span className="text-white">en payant localement en </span>
            <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">TND</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-gray-400 sm:text-lg">Cursor, ChatGPT, Midjourney, Adobe — tous tes outils favoris accessibles depuis la Tunisie. Paie en dinars, sans carte internationale.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#5558e3]">Commencer maintenant <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10">Voir les services</Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center"><div className="text-2xl font-bold text-white sm:text-3xl">500+</div><div className="mt-1 text-sm text-gray-500">Utilisateurs actifs</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-white sm:text-3xl">20+</div><div className="mt-1 text-sm text-gray-500">Services disponibles</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-white sm:text-3xl">24h</div><div className="mt-1 text-sm text-gray-500">Délai de traitement max</div></div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Comment ça marche ?</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-gray-400">Simple, rapide, sécurisé</p>
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-6">
            {[
              { step: 1, Icon: Wallet, title: 'Recharge ton wallet', desc: 'Paie en TND via D17, virement ou carte bancaire locale' },
              { step: 2, Icon: ShoppingCart, title: 'Choisis ton service', desc: "Parcours notre catalogue et sélectionne l'abonnement dont tu as besoin" },
              { step: 3, Icon: Zap, title: 'Reçois ton accès instantanément', desc: 'Tes identifiants sont livrés automatiquement en quelques minutes' },
            ].map(({ step, Icon, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/20 text-sm font-bold text-[#6366f1]">{step}</div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-[#111111] text-[#6366f1]"><Icon className="h-6 w-6" /></div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Services disponibles</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-gray-400">Et bien plus encore...</p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.name} className="group rounded-lg border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-[#6366f1]/50">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded border border-white/10 px-2 py-0.5 text-xs text-gray-400">{s.category}</span>
                    <h3 className="mt-2 text-lg font-semibold text-white">{s.name}</h3>
                  </div>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-gray-500">Livraison &lt; 1h</span>
                </div>
                <p className="mt-3 text-sm text-gray-500">Abonnement mensuel — accès immédiat après paiement.</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-[#6366f1]">{s.price} TND <span className="text-sm font-normal text-gray-500">/mois</span></span>
                  <Link href="/services" className="rounded-lg border border-[#6366f1]/50 bg-[#6366f1]/10 px-4 py-2 text-sm font-medium text-[#6366f1] transition-colors hover:bg-[#6366f1]/20">Commander</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-[#6366f1] transition-colors hover:text-[#818cf8]">Voir tous les services <ExternalLink className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-block rounded-full border border-[#6366f1]/50 bg-[#6366f1]/5 px-3 py-1 text-xs font-medium text-gray-300">💡 Rejoins notre communauté</span>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Tu es freelance ou créateur ?</h2>
              <p className="mt-4 text-gray-400">Tu as des revenus sur des plateformes digitales ? Rejoins la communauté Tunixo et aide d&apos;autres utilisateurs à accéder aux outils dont ils ont besoin. En échange, reçois des crédits TND utilisables ou retirables localement.</p>
              <ul className="mt-6 space-y-3">
                {['Aide la communauté tunisienne', 'Reçois des crédits TND en retour', 'Retrait via D17 ou virement bancaire'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-300"><Check className="h-5 w-5 shrink-0 text-[#6366f1]" />{item}</li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-[#6366f1] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#6366f1] transition-all duration-300 hover:bg-[#6366f1]/10">Rejoindre la communauté <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="relative flex justify-center">
              <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#111111] p-6 shadow-xl" style={{ animation: 'float 6s ease-in-out infinite' }}>
                <div className="flex items-center gap-2 text-sm text-gray-500"><Sparkles className="h-4 w-4 text-[#6366f1]" /> Service financé ✅</div>
                <div className="mt-4 text-lg font-semibold text-white">Abonnement Cursor Pro</div>
                <p className="mt-1 text-sm text-gray-400">Financé via communauté Tunixo</p>
                <div className="mt-4 border-t border-white/10 pt-4"><span className="text-xl font-bold text-[#6366f1]">Crédits TND: +142.5 TND</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Pourquoi Tunixo ?</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-gray-400">La solution pensée pour les Tunisiens</p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Lock, title: '100% Sécurisé', desc: 'Transactions protégées et données chiffrées' },
              { icon: Zap, title: 'Livraison instantanée', desc: 'Accès livrés automatiquement dès confirmation du paiement' },
              { icon: CreditCard, title: 'Paiement local', desc: 'D17, virement, carte bancaire locale — aucune carte internationale' },
              { icon: Headphones, title: 'Support réactif', desc: 'Notre équipe répond dans les 2 heures' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-[#6366f1]/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#6366f1]/10 text-[#6366f1]"><item.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Questions fréquentes</h2>
          <div className="mt-12 space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-[#111111] transition-all duration-300">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:bg-white/5">
                  {item.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="border-t border-white/10 px-5 py-4 text-sm text-gray-400">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/5 px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-900/95 to-purple-900" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Prêt à accéder au digital mondial ?</h2>
          <p className="mt-4 text-lg text-white/80">Rejoins des centaines de Tunisiens qui utilisent déjà Tunixo</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/register" className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-base font-semibold text-indigo-900 transition-all duration-300 hover:bg-gray-100">Créer mon compte</Link>
            <Link href="/services" className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20">Voir les services</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-[#0a0a0a] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="text-xl font-bold text-[#6366f1]">Tunixo</Link>
              <p className="mt-2 text-sm text-gray-500">Tunisia&apos;s Digital Gateway</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Plateforme</h4>
              <ul className="mt-4 space-y-2">
                {['Services', 'Comment ça marche', 'Tarifs', 'FAQ'].map((label) => (
                  <li key={label}><Link href={label === 'Services' ? '/services' : label === 'FAQ' ? '#faq' : '/'} className="text-sm text-gray-500 transition-colors hover:text-gray-300">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Communauté</h4>
              <ul className="mt-4 space-y-2">
                {['Rejoindre la communauté', 'Financer des abonnements', 'Retirer des TND'].map((label) => (
                  <li key={label}><Link href="/register" className="text-sm text-gray-500 transition-colors hover:text-gray-300">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Support</h4>
              <ul className="mt-4 space-y-2">
                {['Contact', 'Politique de confidentialité', "Conditions d'utilisation"].map((label) => (
                  <li key={label}><Link href="/" className="text-sm text-gray-500 transition-colors hover:text-gray-300">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
            <p className="text-sm text-gray-500">© 2026 Tunixo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: '@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }' }} />
    </div>
  )
}
