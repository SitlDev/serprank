import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, TrendingUp, BarChart3, Lightbulb, Search, Shield } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = React.useState('')

  const features = [
    {
      icon: Zap,
      title: 'Instant SERP Analysis',
      description: 'Get real-time insights into search results and identify ranking opportunities in seconds.',
      color: 'brand'
    },
    {
      icon: TrendingUp,
      title: 'Smart Opportunity Scoring',
      description: 'Our algorithm finds keywords where you can realistically rank, not just traffic volume.',
      color: 'accent'
    },
    {
      icon: BarChart3,
      title: 'Competitive Intelligence',
      description: 'Understand what your competitors rank for and where the gaps are in your strategy.',
      color: 'brand'
    },
    {
      icon: Lightbulb,
      title: 'Content Gap Discovery',
      description: 'Find missing content opportunities that competitors haven\'t covered yet.',
      color: 'accent'
    },
    {
      icon: Search,
      title: 'Deep SERP Features',
      description: 'Detect all SERP features affecting your visibility and click-through rates.',
      color: 'brand'
    },
    {
      icon: Shield,
      title: 'Bulk Analysis',
      description: 'Analyze 1000+ keywords at once and track changes over time automatically.',
      color: 'accent'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-brand-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
              SR
            </div>
            <span className="text-xl font-bold text-slate-900">SERPRank</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-brand-600 transition">Features</a>
            <Link to="/pricing" className="text-slate-600 hover:text-brand-600 transition">Pricing</Link>
            <a href="https://docs.serprank.io" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-brand-600 transition">Docs</a>
            <Link to="/login" className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition">Sign In</Link>
            <Link to="/dashboard" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <div className="inline-block bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                ✨ Stop guessing which keywords you can rank for
              </div>
              <h1 className="heading-lg mb-6 text-slate-900">
                Find ranking <span className="text-gradient">opportunities</span> your competitors missed
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                SERPRank identifies weaknesses in search results and scores keywords by realistic ranking potential. Not just difficulty – actual opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary text-center">
                  Start Free Trial
                </Link>
                <button className="btn-outline text-center">Watch Demo</button>
              </div>
              <p className="mt-6 text-sm text-slate-500">No credit card required. Get 1,000 free credits.</p>
            </div>
            
            <div className="relative animate-fadeInUp">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-200 to-accent-200 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 overflow-hidden">
                <img src="/dashboard-mockup.svg" alt="SERPRank Dashboard" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-md mb-4">Powerful tools built for SEOs</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to find, analyze, and track keywords that matter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              const bgColor = feature.color === 'brand' ? 'bg-brand-100' : 'bg-accent-100'
              const textColor = feature.color === 'brand' ? 'text-brand-600' : 'text-accent-600'
              
              return (
                <div key={i} className="card group hover:-translate-y-1 transition-transform duration-300">
                  <div className={`${bgColor} ${textColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="heading-sm mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-brand rounded-3xl p-12 md:p-16 text-white text-center">
            <h2 className="text-4xl font-bold font-display mb-6">Ready to find your next ranking opportunity?</h2>
            <p className="text-lg opacity-90 mb-8">Join 5,000+ SEOs discovering keywords their competitors missed</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 outline-none"
              />
              <button className="px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap">
                <Link to="/register" className="block w-full h-full">Get Started</Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-brand"></div>
                <span className="font-bold">SERPRank</span>
              </div>
              <p className="text-sm text-slate-600">Find keywords you can actually rank for</p>
              <p className="text-xs text-slate-500 mt-4">© 2024-2026 Knotstranded LLC</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#features" className="hover:text-brand-600">Features</a></li>
                <li><Link to="/pricing" className="hover:text-brand-600">Pricing</Link></li>
                <li><a href="https://docs.serprank.io" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">Documentation</a></li>
                <li><a href="#" className="hover:text-brand-600">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="https://knotstranded.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">About</a></li>
                <li><a href="#" className="hover:text-brand-600">Blog</a></li>
                <li><a href="mailto:hello@knotstranded.com" className="hover:text-brand-600">Contact</a></li>
                <li><a href="#" className="hover:text-brand-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="mailto:support@serprank.io" className="hover:text-brand-600">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-600">Community</a></li>
                <li><a href="#" className="hover:text-brand-600">Status</a></li>
                <li><a href="mailto:bugs@serprank.io" className="hover:text-brand-600">Report Bug</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/legal/privacy" className="hover:text-brand-600">Privacy</Link></li>
                <li><Link to="/legal/terms" className="hover:text-brand-600">Terms</Link></li>
                <li><Link to="/legal/security" className="hover:text-brand-600">Security</Link></li>
                <li><a href="#" className="hover:text-brand-600">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
            <p>Knotstranded LLC, USA | support@serprank.io | +1-555-SERP-RANK</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-brand-600">Twitter</a>
              <a href="#" className="hover:text-brand-600">LinkedIn</a>
              <a href="#" className="hover:text-brand-600">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
