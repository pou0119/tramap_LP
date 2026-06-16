import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { 
  MapPin, 
  Train, 
  Users, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  Compass, 
  Car,
  Heart,
  Sparkle,
  Mail
} from 'lucide-react'

const FAQS = [
  {
    q: 'How does it help me with Japan’s complex trains and subways?',
    a: 'Japan’s transit is legendary but can be incredibly confusing (JR lines, local subways, private railways, local buses). As you add stops, our system automatically calculates train routes, transfers, and walking connections so you never get lost in the schedules.'
  },
  {
    q: 'Can I fully customize my plan?',
    a: 'Yes! We believe the best trips are the ones you design yourself. Unlike rigid tour templates, you start with a blank canvas, search for places you want to visit, and drag-and-drop to create your own unique plan.'
  },
  {
    q: 'Can I design plans with my travel buddies?',
    a: 'Absolutely! Planning together is half the fun. Share a real-time link and brainstorm, swap spots, and watch your itinerary evolve together on the same screen.'
  },
  {
    q: 'Is this available for all of Japan?',
    a: 'Yes! From the bustling streets of Tokyo to the hidden temples of Shikoku, you can search, discover, and add places from all 47 prefectures.'
  }
]

export default function App() {
  const appUrl = import.meta.env.VITE_APP_URL || 'https://app.tripplan.app'
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [joinedWaitlist, setJoinedWaitlist] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCount() {
      try {
        const { data, error } = await supabase.rpc('get_waitlist_count')
        if (!error && data !== null) {
          setWaitlistCount(data)
        }
      } catch (err) {
        console.error('Failed to fetch waitlist count:', err)
      }
    }
    fetchCount()
  }, [])

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault()
    const targetEmail = email.trim()
    if (targetEmail) {
      try {
        const { error } = await supabase.from('waitlist').insert([{ email: targetEmail }])
        if (!error) {
          setJoinedWaitlist(true)
          setWaitlistCount(prev => prev !== null ? prev + 1 : null)
          
          // Send welcome/confirmation email via Supabase Edge Function
          try {
            await supabase.functions.invoke('send-welcome-email', {
              body: { email: targetEmail }
            })
          } catch (mailErr) {
            console.error('Failed to send welcome email:', mailErr)
          }
        } else {
          // If already registered or error, show success state to be user-friendly
          setJoinedWaitlist(true)
        }
      } catch (err) {
        console.error('Failed to submit waitlist:', err)
        setJoinedWaitlist(true)
      }
      setEmail('')
    }
  }

  return (
    <div style={{ 
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", 
      background: '#07090e', 
      color: '#f8fafc', 
      overflowX: 'hidden',
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
    }}>
      {/* Glow backgrounds simulating travel sparks */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '90%', height: '700px', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, rgba(7,9,14,0) 80%)',
        zIndex: 0, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '700px', right: '-10%',
        width: '600px', height: '600px', background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, rgba(7,9,14,0) 75%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .btn-hover {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(99,102,241,0.35);
        }
        .bento-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.04);
          background: rgba(13, 18, 30, 0.7);
          backdrop-filter: blur(12px);
        }
        .bento-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99,102,241,0.25);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .text-glow {
          text-shadow: 0 0 30px rgba(99,102,241,0.3);
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7, 9, 14, 0.75)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: 70,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366F1, #F59E0B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
          }}>
            <Compass size={16} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.7px', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TripPlan</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '80px 5% 100px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 30, padding: '6px 16px', marginBottom: 28,
          fontSize: 13, fontWeight: 600, color: '#f59e0b',
        }}>
          <Sparkle size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />
          Plan Your Own Japan Trip. A Journey Uniquely Yours.
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 900,
          lineHeight: 1.05, letterSpacing: '-2.5px', marginBottom: 24,
          background: 'linear-gradient(to bottom, #ffffff 40%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Design your own Japan trip.<br />
          <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #fbcfe8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="text-glow">A plan uniquely yours.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 19px)', color: '#cbd5e1', lineHeight: 1.7,
          maxWidth: 720, margin: '0 auto 44px', fontWeight: 500
        }}>
          Japan’s public transit network is legendary, but juggling local trains, subways, JR lines, and buses makes scheduling incredibly complex. We take the confusion out of the maps so you can enjoy the pure excitement of crafting your custom itinerary.
        </p>

        {/* Waitlist Box */}
        <div style={{ maxWidth: 480, margin: '0 auto 64px' }}>
          {joinedWaitlist ? (
            <div style={{
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 16, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12,
              justifyContent: 'center', color: '#34d399', fontSize: 15, fontWeight: 600
            }}>
              <Check size={18} /> You are on the invite list! Let's start crafting soon.
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} style={{
              display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 30, padding: 6, gap: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, paddingLeft: 16 }}>
                <Mail size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: 'white', fontSize: 14, padding: '8px 0'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #818cf8)', color: 'white', border: 'none',
                  borderRadius: 24, padding: '10px 24px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0
                }}
                className="btn-hover"
              >
                Join Waitlist <ArrowRight size={14} />
              </button>
            </form>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              Join {waitlistCount !== null ? 1480 + waitlistCount : '1,480'}+ travelers designing custom itineraries
            </span>
          </div>
        </div>

        {/* Real App Screenshot Showcase in Browser Mockup */}
        <div style={{
          maxWidth: 1040, margin: '64px auto 0',
          position: 'relative',
          zIndex: 5
        }}>
          {/* macOS Browser Mockup */}
          <div style={{
            background: '#141824',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            overflow: 'hidden'
          }}>
            {/* Browser Header Bar */}
            <div style={{
              background: '#0d111d',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              {/* Dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              {/* Address bar */}
              <div style={{
                flex: 1,
                maxWidth: 480,
                margin: '0 auto',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '5px 12px',
                textAlign: 'center',
                fontSize: '11px',
                color: '#94a3b8',
                fontWeight: 600,
                letterSpacing: '0.02em',
                userSelect: 'none'
              }}>
                tripplan.app/plan/kochi-shikoku
              </div>
            </div>

            {/* App Screen Capture Image */}
            <img 
              src="/app_screenshot.png" 
              alt="TripPlan Application Dashboard" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '0 0 16px 16px',
                imageRendering: '-webkit-optimize-contrast'
              }}
            />
          </div>
        </div>
      </section>

      {/* Solving Japan's Transit Problem Showcase */}
      <section style={{ padding: '100px 5%', maxWidth: 1200, margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800,
            letterSpacing: '-1px', marginBottom: 16, color: 'white',
          }}>
            Conquer Japan’s Complex Transit
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 700, margin: '0 auto' }}>
            Subways, JR local trains, Shinkansen bullet trains, and city buses—navigating Japan’s legendary transport is amazing, but planning it by yourself can be overwhelming. We solve that.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Solution 1 */}
          <div style={{ padding: 32, borderRadius: 20, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <Train size={18} color="#818cf8" style={{ margin: '0 auto' }} />
            </div>
            <h4 style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 10 }}>Seamless Train & Subway Calculations</h4>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
              No more searching on five different route finders. Drop spots into your day, and the planner automatically coordinates lines, transfer stations, and fares for you.
            </p>
          </div>

          {/* Solution 2 */}
          <div style={{ padding: 32, borderRadius: 20, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <Car size={18} color="#f59e0b" style={{ margin: '0 auto' }} />
            </div>
            <h4 style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 10 }}>Driving Routes & Highway Tolls (ETC)</h4>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
              Planning a road trip through Hokkaido or Fuji? We calculate driving durations and Japanese highway ETC toll costs instantly so you can stay within budget.
            </p>
          </div>

          {/* Solution 3 */}
          <div style={{ padding: 32, borderRadius: 20, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <MapPin size={18} color="#fb7185" style={{ margin: '0 auto' }} />
            </div>
            <h4 style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 10 }}>Romaji Map Visualizer</h4>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
              Looking at map pins in Kanji can be frustrating. Our map layers automatically display in clean Romaji/English so you instantly understand where you are.
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Showcase Section */}
      <section style={{ padding: '100px 5%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800,
            letterSpacing: '-1px', marginBottom: 16, color: 'white',
          }}>
            Every Feature You Need to Create Your Plan
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
            We replace boring spreadsheets with a playful, visual sandbox. Rediscover the fun of organizing your stops.
          </p>
        </div>

        {/* Bento Box Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 20,
          gridAutoRows: 'minmax(200px, auto)'
        }}>
          {/* Bento Card 1: The Canvas (colspan 3) */}
          <div style={{ gridColumn: 'span 3', borderRadius: 20, padding: 32 }} className="bento-card">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>
                  Your Creative Travel Canvas
                </h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                  No rigid templates. No pre-packaged schedules. Add temples, ramen stalls, and secret viewpoints, then arrange them freely to match your vibe.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Map sketch (colspan 3) */}
          <div style={{ gridColumn: 'span 3', borderRadius: 20, padding: 32 }} className="bento-card">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>
                  Sketch Your Own Adventure Map
                </h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                  Watch stops connect automatically on a beautiful Mapbox map as you define your route. It's like drawing a pirate map of your future memories.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Wishlist (colspan 2) */}
          <div style={{ gridColumn: 'span 2', borderRadius: 20, padding: 32 }} className="bento-card">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: 'rgba(244,63,94,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
                }}>
                  <Heart size={18} color="#fb7185" fill="#fb7185" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 10 }}>
                  Curate Without Limits
                </h3>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                  Collect interesting spots from Instagram, TikTok, and blogs. Drop them in your Wishlist first, and play around with combinations later.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Collaborative Brainstorming (colspan 4) */}
          <div style={{ gridColumn: 'span 4', borderRadius: 20, padding: 32 }} className="bento-card">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: 'rgba(168,85,247,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
                }}>
                  <Users size={18} color="#c084fc" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>
                  Share the Anticipation
                </h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                  Planning with family or friends? Share a live link, edit simultaneously, and turn planning into a collaborative brainstorming game. Swap ideas in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section style={{ padding: '100px 5%', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800,
          letterSpacing: '-1px', marginBottom: 48, color: 'white',
        }}>
          Planning Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              style={{
                background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: 16, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{faq.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    color: '#94a3b8', transition: 'transform 0.25s',
                    transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)'
                  }}
                />
              </div>
              {openFaq === idx && (
                <div style={{ marginTop: 14, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>



      {/* Footer */}
      <footer style={{
        padding: '40px 5%',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#64748b', fontSize: 13, flexWrap: 'wrap', gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Compass size={12} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: '#94a3b8' }}>TripPlan</span>
        </div>
        <div>© 2026 TripPlan. All rights reserved. Built for explorers.</div>
      </footer>
    </div>
  )
}
