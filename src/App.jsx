import { useState, useEffect, useRef, useCallback } from 'react';
import client from './insforge.js';
import { PROFILE, SECTIONS, VIDEOS, CONTACT, ADMIN } from './data.js';

/* ─── SECTION ICONS ─── */
const ICONS = {
  'extra-curricular': '🏆', 'internship': '💼', 'academy': '🎓',
  'workshops': '🛠️', 'ncc': '🎖️', 'sports': '⚡',
  'social-activities': '🤝', 'projects': '💻', 'technical-activities': '🔬',
  'entrepreneurship': '🚀'
};

/* ─── CUSTOM CURSOR ─── */
function CustomCursor() {
  const dot = useRef(null), ring = useRef(null);
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const [hov, setHov] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    const onMove = e => { pos.current.x = e.clientX; pos.current.y = e.clientY; };
    const onOver = e => setHov(!!e.target.closest('a,button,[data-hover]'));
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    let raf;
    const tick = () => {
      const p = pos.current;
      p.rx += (p.x - p.rx) * 0.12; p.ry += (p.y - p.ry) * 0.12;
      if (dot.current) { dot.current.style.left = p.x + 'px'; dot.current.style.top = p.y + 'px'; }
      if (ring.current) { ring.current.style.left = p.rx + 'px'; ring.current.style.top = p.ry + 'px'; }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseover', onOver); cancelAnimationFrame(raf); };
  }, []);
  return (<>
    <div ref={dot} className={`cursor-dot${hov ? ' hover' : ''}`} />
    <div ref={ring} className={`cursor-ring${hov ? ' hover' : ''}`} />
  </>);
}

/* ─── BACKGROUND MESH ─── */
function BgMesh() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const onMove = e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return (
    <div className="bg-mesh" ref={ref}>
      <div className="orb" /><div className="orb" /><div className="orb" />
    </div>
  );
}

/* ─── PARTICLES CANVAS ─── */
function Particles() {
  const canvas = useRef(null);
  useEffect(() => {
    const c = canvas.current, ctx = c.getContext('2d');
    let w, h, pts = [], raf;
    const resize = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    };
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < 150; i++) {
      // r is size, o is opacity
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.7 + 0.3
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.o})`;
        // Draw squares as seen in the screenshot
        ctx.fillRect(p.x, p.y, p.r, p.r);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvas} className="particles-container" />;
}

/* ─── ENTRY SCREEN ─── */
function EntryScreen({ onEnter }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 600); }, []);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter your name to continue'); return; }
    setLoading(true); setError('');
    try {
      await client.database.from('visitors').insert([{ name: trimmed }]);
    } catch (e) { console.warn('DB:', e); }
    localStorage.setItem('visitor_name', trimmed);
    setLoading(false); onEnter(trimmed);
  };

  return (
    <div className="entry-screen">
      <BgMesh /><Particles />
      <div className="entry-card">
        <div className="entry-logo">
          <img src={PROFILE.image} alt="S. Manohar" />
        </div>
        <h1>Welcome</h1>
        <p>Enter your name to explore S. Manohar's portfolio</p>
        <div className={`entry-field${error ? ' has-error' : ''}`}>
          <input
            ref={inputRef} id="visitor-name" type="text"
            placeholder=" " autoComplete="off"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            aria-label="Your name"
          />
          <label htmlFor="visitor-name">Your Name</label>
          <div className="field-line" />
        </div>
        {error && <p className="entry-error" role="alert">⚠ {error}</p>}
        <button
          id="enter-btn" className="entry-btn" onClick={submit}
          disabled={loading} data-hover
        >
          {loading
            ? <><span className="spinner" />Entering...</>
            : <>Enter Portfolio <span className="btn-arrow">→</span></>}
        </button>
      </div>
    </div>
  );
}

/* ─── NAVBAR ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const ids = ['hero', 'sections', 'video', 'resume', 'contact'];
      for (const id of ids.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { label: 'Home', id: 'hero' }, { label: 'Journey', id: 'sections' },
    { label: 'Reel', id: 'video' }, { label: 'Resume', id: 'resume' }, { label: 'Contact', id: 'contact' }
  ];
  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };
  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav-logo" data-hover onClick={() => scrollTo('hero')}>
        MANOHAR<span className="logo-bracket">_S</span>
      </div>
      <ul className={`nav-links${open ? ' open' : ''}`} role="list">
        {links.map(l => (
          <li key={l.id}>
            <button className={`nav-link-btn${active === l.id ? ' active' : ''}`}
              onClick={() => scrollTo(l.id)} data-hover>
              {l.label}
            </button>
          </li>
        ))}
      </ul>
      <button className="mobile-menu-btn" onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
        <span className={open ? 'open' : ''} /><span className={open ? 'open' : ''} /><span className={open ? 'open' : ''} />
      </button>
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  const wrap = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  useEffect(() => {
    const el = wrap.current;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / 40;
      const y = (e.clientY - r.top - r.height / 2) / 40;
      el.style.transform = `perspective(1200px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    };
    const onLeave = () => { el.style.transform = 'perspective(1200px)'; };
    el.addEventListener('mousemove', onMove); el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);
  return (
    <section className="hero" id="hero" aria-label="Hero section">
      <div className={`hero-content${loaded ? ' loaded' : ''}`} ref={wrap}>
        <div className="hero-text">
          <h1 className="hero-name hero-name-single">
            <span>Manohar</span><span className="hero-name-dot"> .</span><span className="hero-name-accent">S</span>
          </h1>
          <p className="hero-intro">{PROFILE.intro}</p>

          <div className="hero-cta">
            <button className="btn-primary" data-hover onClick={() => document.getElementById('sections')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Journey
            </button>
          </div>
        </div>
        <div className="hero-img-wrap">
          <div className="hero-img-ring" />
          <div className="hero-img-ring ring2" />
          <div className="hero-img-inner">
            <img
              className="hero-img"
              src={PROFILE.image}
              alt={`${PROFILE.name} profile photo`}
              loading="eager"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="hero-img-fallback" style={{ display: 'none' }}>
              <span>SM</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}

/* ── SECTION CARD ── */
function AltCard({ section, index, editMode }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const onTilt = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
    ref.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
  };
  const resetTilt = () => { ref.current && (ref.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)'); };

  const isReverse = index % 2 !== 0;
  const icon = ICONS[section.key] || '⭐';
  const theme = section.theme || (isReverse ? 'teal' : 'dark');

  return (
    <article
      ref={ref}
      className={`alt-card theme-${theme}${isReverse ? ' reverse' : ''}${visible ? ' visible' : ''}`}
      onMouseMove={onTilt} onMouseLeave={resetTilt}
      aria-label={section.title}
    >
      <div className="alt-card-image">
        {!imgErr ? (
          <img
            src={section.image}
            alt={section.title}
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="img-fallback">
            <span className="img-fallback-icon">{icon}</span>
            <span className="img-fallback-label">{section.title}</span>
          </div>
        )}
      </div>

      <div className="alt-card-content">
        <div className="card-section-badge">
          <span>{icon}</span> {section.key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </div>
        <h3 contentEditable={editMode || undefined} suppressContentEditableWarning>
          {section.title}
        </h3>
        <ul>
          {section.items.map((item, i) => (
            <li key={i} contentEditable={editMode || undefined} suppressContentEditableWarning>
              <span className="li-dot">◆</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ─── VIDEO SECTION ─── */
function VideoSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const activeVideo = VIDEOS[activeVideoIndex];

  return (
    <section className="section" id="video" ref={ref} aria-label="Achievements reel" style={{ paddingBottom: '100px' }}>
      <h2 className="section-title" style={{ textAlign: 'left', textTransform: 'uppercase', marginBottom: '8px' }}>
        Achievements <span className="highlight">Reel</span>
      </h2>
      <div className="title-underline" style={{ width: '120px', height: '4px', background: 'var(--cyan)', marginBottom: '40px' }}></div>

      <div className={`video-layout${visible ? ' visible' : ''}`}>
        <div className="video-player-side">
          <div className="video-glow-wrap">
            <div className="video-container">
              {activeVideo && visible ? (
                <iframe
                  key={activeVideo.url}
                  src={activeVideo.url}
                  title={activeVideo.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  loading="lazy"
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="video-playlist-side">
          <h3 className="playlist-heading">UP NEXT / PLAYLIST</h3>
          <div className="playlist-list">
            {VIDEOS.map((video, index) => {
              const isActive = index === activeVideoIndex;
              return (
                <div
                  key={index}
                  className={`playlist-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveVideoIndex(index)}
                >
                  <div className="playlist-item-number">{index + 1}</div>
                  <div className="playlist-item-content">
                    <div className="playlist-item-title">{video.title}</div>
                    {isActive && <div className="playlist-active-indicator"></div>}
                  </div>
                  {!isActive && <div className="playlist-item-ring"></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── RESUME ─── */
function ResumeSection() {
  const resumeImgId = '1nntVDhbix2AiPEjwTGH591tbO-A0YcHO';
  const resumeUrl = `https://drive.google.com/thumbnail?id=${resumeImgId}&sz=w1600`;
  
  return (
    <section className="section" id="resume" aria-label="Resume section">
      <h2 className="section-title">My <span className="highlight">Resume</span></h2>
      <p className="section-sub">A brief overview of my professional experience and skills</p>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--glow)',
        border: '1px solid rgba(0, 255, 204, 0.2)'
      }}>
        <img 
          src={resumeUrl} 
          alt="Manohar's Resume" 
          style={{ width: '100%', display: 'block', height: 'auto' }}
          loading="lazy"
        />
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function ContactSection() {
  const contactItems = [
    { id: 'phone', icon: '📞', label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
    { id: 'whatsapp', icon: '💬', label: 'WhatsApp', value: CONTACT.whatsapp, href: `https://wa.me/91${CONTACT.whatsapp}` },
    { id: 'email', icon: '✉️', label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { id: 'linkedin', icon: '💼', label: 'LinkedIn', value: 'Manohar Sudhakar', href: CONTACT.linkedin },
    { id: 'github', icon: '🐙', label: 'GitHub', value: 'Manohar12095', href: CONTACT.github },
    { id: 'location', icon: '📍', label: 'Location', value: CONTACT.location }
  ];
  return (
    <section className="section" id="contact" aria-label="Contact section">
      <h2 className="section-title">Get In <span className="highlight">Touch</span></h2>
      <p className="section-sub">Let's connect and build something amazing together</p>
      <div className="contact-grid" role="list">
        {contactItems.map((c, i) => (
          <div key={c.id} id={`contact-${c.id}`} className="contact-card" data-hover
            style={{ animationDelay: `${i * 0.08}s` }} role="listitem">
            <div className="contact-icon">{c.icon}</div>
            <div className="contact-info">
              <h4>{c.label}</h4>
              {c.href
                ? <a href={c.href} target="_blank" rel="noopener noreferrer">{c.value}</a>
                : <p>{c.value}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── ADMIN MODAL ─── */
function AdminModal({ onClose, onLogin }) {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (name === ADMIN.name && pass === ADMIN.password) { onLogin(); onClose(); }
    else { setError('Access Denied — Invalid credentials'); }
  };
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon">🔐</div>
          <h2 id="admin-modal-title">Admin Access</h2>
          <p>Enter your credentials to enable edit mode</p>
        </div>
        <input id="admin-name" className="modal-input" placeholder="Admin Name"
          value={name} onChange={e => { setName(e.target.value); setError(''); }}
          autoFocus />
        <input id="admin-pass" className="modal-input" placeholder="Password" type="password"
          value={pass} onChange={e => { setPass(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && submit()} />
        {error && <p className="entry-error" role="alert">⚠ {error}</p>}
        <div className="modal-actions">
          <button className="modal-cancel" id="admin-cancel" onClick={onClose} data-hover>Cancel</button>
          <button className="modal-login" id="admin-login" onClick={submit} data-hover>Login</button>
        </div>
      </div>
    </div>
  );
}

/* ─── TOAST ─── */
function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <span className="toast-icon">{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
}

/* ─── EDIT SAVE HANDLER ─── */
async function saveEdits(setToast, setEditMode) {
  try {
    const cards = document.querySelectorAll('.alt-card');
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const title = card.querySelector('h3')?.textContent?.trim() || '';
      const items = Array.from(card.querySelectorAll('li span:last-child')).map(s => s.textContent?.trim());
      const key = SECTIONS[i]?.key;
      if (key) {
        await client.database.from('portfolio_content').upsert(
          [{ section_key: key, title, content: JSON.stringify(items), sort_order: i }],
          { onConflict: 'section_key' }
        );
      }
    }
    setToast({ message: '✓ Changes saved to database!', type: 'success' });
  } catch (e) {
    console.error(e);
    setToast({ message: 'Save failed — please try again', type: 'error' });
  }
  setEditMode(false);
}

/* ─── APP ─── */
import CommandCenter from './CommandCenter.jsx';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [entered, setEntered] = useState(() => !!localStorage.getItem('visitor_name'));
  const [editMode, setEditMode] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState(null);
  const [view, setView] = useState('portfolio'); // 'portfolio' or 'admin'

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await client.database
          .from('portfolio_data')
          .select('payload')
          .eq('id', 'main')
          .single();

        if (data && data.payload) {
          const p = data.payload;
          Object.assign(PROFILE, p.profile);
          Object.assign(CONTACT, p.contact);
          Object.assign(ADMIN, p.admin);

          if (p.sections) {
            SECTIONS.length = 0;
            p.sections.forEach(s => SECTIONS.push(s));
          }
          if (p.videos) {
            VIDEOS.length = 0;
            p.videos.forEach(v => VIDEOS.push(v));
          }
        }
      } catch (err) {
        console.error('Failed to load DB data, using local fallback:', err);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleEnter = useCallback(name => {
    setEntered(true);
    setToast({ message: `Welcome, ${name}! 👋`, type: 'success' });
  }, []);

  const handleAdminLogin = useCallback(() => {
    setView('admin');
    setToast({ message: 'Welcome to Command Center!', type: 'success' });
  }, []);

  if (isLoading) return (
    <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#050505', color: 'var(--cyan)', fontSize: '1.2rem', fontWeight: '600', letterSpacing: '0.1em' }}>
      Loading Portfolio...
    </div>
  );

  if (!entered) return (
    <>
      <CustomCursor />
      <EntryScreen onEnter={handleEnter} />
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );

  if (view === 'admin') return (
    <>
      <CustomCursor />
      <CommandCenter onBack={() => setView('portfolio')} />
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );

  return (
    <>
      <CustomCursor />
      <BgMesh />
      <Particles />
      <div className={`portfolio${editMode ? ' edit-mode' : ''}`}>
        <Navbar />

        <Hero />

        <section className="section" id="sections" aria-label="Journey sections">
          <h2 className="section-title">My <span className="highlight">Journey</span></h2>
          <div className="sections-list">
            {SECTIONS.map((s, i) => (
              <AltCard key={s.key} section={s} index={i} editMode={editMode} />
            ))}
          </div>
        </section>

        <VideoSection />
        <ResumeSection />
        <ContactSection />

        <footer className="footer" role="contentinfo">
          <div className="footer-logo">Manohar <span>.S</span></div>
          <p>© {new Date().getFullYear()} S. Manohar — Crafted with passion & code</p>
          <p className="footer-sub">CSE Student | Developer | NCC Cadet | Entrepreneur | Athlete | Leader</p>
        </footer>
      </div>

      {/* Floating admin button */}
      {!editMode ? (
        <button id="admin-fab" className="admin-fab" onClick={() => setShowAdmin(true)} data-hover aria-label="Edit portfolio">
          ✏️ Edit Portfolio
        </button>
      ) : (
        <div className="edit-bar">
          <span className="edit-indicator">● EDIT MODE</span>
          <button className="btn-primary save-edit-btn" id="save-edits-btn"
            onClick={() => saveEdits(setToast, setEditMode)} data-hover>
            💾 Save Changes
          </button>
          <button className="btn-outline cancel-edit-btn" id="cancel-edits-btn"
            onClick={() => setEditMode(false)} data-hover>
            Cancel
          </button>
        </div>
      )}

      {showAdmin && (
        <AdminModal onClose={() => setShowAdmin(false)} onLogin={handleAdminLogin} />
      )}
      {toast && <Toast key={toast.message} {...toast} onDone={() => setToast(null)} />}
    </>
  );
}
