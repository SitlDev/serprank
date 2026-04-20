import React from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Zap } from 'lucide-react'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = React.useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for freelancers and small businesses',
      monthlyPrice: 29,
      annualPrice: 290,
      monthlyCredits: 5000,
      features: [
        { text: 'Up to 5,000 monthly credits', included: true },
        { text: 'SERP analysis for keywords', included: true },
        { text: 'Trending keywords from 5 sources', included: true },
        { text: 'Bulk analysis up to 100 keywords', included: true },
        { text: 'Keyword difficulty scoring', included: true },
        { text: 'Competitive intelligence', included: true },
        { text: 'Up to 3 tracked campaigns', included: true },
        { text: 'Weekly CSV exports', included: true },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false },
        { text: 'Team collaboration (5 seats)', included: false },
        { text: 'Historical data (90 days)', included: false },
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      description: 'For agencies and growing businesses',
      monthlyPrice: 99,
      annualPrice: 990,
      monthlyCredits: 25000,
      features: [
        { text: 'Up to 25,000 monthly credits', included: true },
        { text: 'SERP analysis for keywords', included: true },
        { text: 'Trending keywords from all 11 sources', included: true },
        { text: 'Unlimited bulk analysis', included: true },
        { text: 'Keyword difficulty scoring', included: true },
        { text: 'Competitive intelligence', included: true },
        { text: 'Unlimited tracked campaigns', included: true },
        { text: 'Daily automated exports', included: true },
        { text: 'API access (10K requests/month)', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Team collaboration (10 seats)', included: true },
        { text: 'Historical data (2 years)', included: true },
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
  ]

  const faqs = [
    {
      question: 'What are credits and how do they work?',
      answer: 'Credits are used for SERP analyses. Each keyword analysis costs 1 credit. For example, analyzing 100 keywords costs 100 credits. Bulk analysis discounts apply when analyzing 50+ keywords at once. Unused credits roll over each month (up to 3x your monthly allowance).'
    },
    {
      question: 'Can I upgrade or downgrade anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be prorated for the difference. If you downgrade, the change takes effect at the start of your next billing cycle.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual plans are billed upfront at a 17% discount compared to monthly billing. That\'s like getting 2 months free!'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and wire transfers for annual plans.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All new users get 1,000 free credits to explore SERPRank. No credit card required. The credits expire after 30 days if not used.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 14-day money-back guarantee if you\'re not satisfied. After 14 days, subscriptions are non-refundable but you can cancel anytime.'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-brand-50">
      {/* Header */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-lg mb-6 text-slate-900">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Choose the plan that fits your business. Always know what you're paying for.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg bg-slate-200 p-1">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  !isAnnual
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  isAnnual
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annual <span className="text-xs ml-1 text-accent-600">Save 17%</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl transition-all ${
                  plan.highlighted
                    ? 'ring-2 ring-brand-500 bg-white shadow-2xl scale-105'
                    : 'bg-white shadow-lg'
                } overflow-hidden`}
              >
                {plan.highlighted && (
                  <div className="bg-gradient-brand text-white py-3 px-6 text-center font-semibold flex items-center justify-center gap-2">
                    <Zap size={16} /> Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-6 text-sm">{plan.description}</p>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-slate-900">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-slate-600">
                        {isAnnual ? '/year' : '/month'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {plan.monthlyCredits.toLocaleString()} monthly credits
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={plan.highlighted ? '/register' : '/register'}
                    className={`block w-full text-center py-3 rounded-lg font-semibold mb-8 transition-all ${
                      plan.highlighted
                        ? 'gradient-brand text-white hover:shadow-lg'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X size={20} className="text-slate-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included ? 'text-slate-700' : 'text-slate-400'
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-md mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Everything you need to know about our pricing</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-slate-50 rounded-lg text-center">
            <p className="text-slate-700 mb-4">Still have questions?</p>
            <a href="mailto:support@serprank.io" className="text-brand-600 hover:text-brand-700 font-semibold">
              Contact our support team →
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-6 mt-24">
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
                <li><a href="#" className="hover:text-brand-600">Features</a></li>
                <li><a href="/pricing" className="hover:text-brand-600">Pricing</a></li>
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
