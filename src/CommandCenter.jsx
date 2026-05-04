import { useState, useCallback } from 'react';
import { PROFILE, SECTIONS, VIDEOS, CONTACT, ADMIN, PORTFOLIO } from './data.js';
import client from './insforge.js';

/* ── TAB CONFIG ── */
const TABS = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'sections', label: 'Sections', icon: '📂' },
  { id: 'contact', label: 'Contact', icon: '📞' },
  { id: 'theme', label: 'Theme', icon: '🎨' },
  { id: 'media', label: 'Media', icon: '🎬' },
  { id: 'portfolio', label: 'Portfolio', icon: '💼' },
  { id: 'security', label: 'Security', icon: '🔐' },
];

/* ── ICONS ── */
const SECTION_ICONS = {
  'extra-curricular': '🏆', 'internship': '💼', 'academy': '🎓',
  'workshops': '🛠️', 'ncc': '🎖️', 'sports': '⚡',
  'social-activities': '🤝', 'projects': '💻', 'technical-activities': '🔬',
  'entrepreneurship': '🚀'
};

export default function CommandCenter({ onBack }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  /* ── PROFILE STATE ── */
  const [profile, setProfile] = useState({
    name: PROFILE.name,
    role: PROFILE.role,
    intro: PROFILE.intro,
    image: PROFILE.image
  });

  /* ── SECTIONS STATE ── */
  const [sections, setSections] = useState(
    SECTIONS.map(s => ({ ...s, items: [...s.items], visible: true }))
  );

  /* ── CONTACT STATE ── */
  const [contact, setContact] = useState({ 
    phone: CONTACT.phone || '',
    whatsapp: CONTACT.whatsapp || '',
    email: CONTACT.email || '',
    linkedin: CONTACT.linkedin || '',
    github: CONTACT.github || '',
    location: CONTACT.location || ''
  });

  /* ── THEME STATE ── */
  const [activeColor, setActiveColor] = useState(getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim() || '#00ffcc');
  const [customColor, setCustomColor] = useState(activeColor);
  const colors = ['#00ffcc', '#ff2d55', '#ccff00', '#007aff', '#ff9500', '#af52de', '#e91e63', '#00bcd4'];

  /* ── MEDIA STATE ── */
  const [videos, setVideos] = useState(VIDEOS.map(v => ({...v})));
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });

  /* ── SECURITY STATE ── */
  const [security, setSecurity] = useState({
    currentPass: '', newPass: '', confirmPass: '', newAdminName: ADMIN.name
  });

  /* ── NEW SECTION STATE ── */
  const [newSection, setNewSection] = useState({
    key: '', title: '', theme: 'dark', image: '', items: ['']
  });

  /* ── PORTFOLIO STATE ── */
  const [portfolio, setPortfolio] = useState({
    resumeId: PORTFOLIO.resumeId,
    heroAccent: PORTFOLIO.heroAccent,
    footerSub: PORTFOLIO.footerSub
  });

  /* ── HELPERS ── */
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const applyTheme = (color) => {
    setActiveColor(color);
    document.documentElement.style.setProperty('--cyan', color);
    document.documentElement.style.setProperty('--teal', color);
    document.documentElement.style.setProperty('--purple', color);
    document.documentElement.style.setProperty('--glow', `0 0 20px ${color}80`);
    document.documentElement.style.setProperty('--glow-sm', `0 0 10px ${color}80`);
    showToast(`Theme color updated to ${color}`);
  };

  /* ── SECTION HANDLERS ── */
  const updateSectionField = (idx, field, value) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const updateSectionItem = (secIdx, itemIdx, value) => {
    setSections(prev => prev.map((s, i) => {
      if (i !== secIdx) return s;
      const items = [...s.items];
      items[itemIdx] = value;
      return { ...s, items };
    }));
  };
  const addSectionItem = (secIdx) => {
    setSections(prev => prev.map((s, i) =>
      i === secIdx ? { ...s, items: [...s.items, ''] } : s
    ));
  };
  const removeSectionItem = (secIdx, itemIdx) => {
    setSections(prev => prev.map((s, i) => {
      if (i !== secIdx) return s;
      return { ...s, items: s.items.filter((_, j) => j !== itemIdx) };
    }));
  };
  const removeSection = (idx) => {
    setSections(prev => prev.filter((_, i) => i !== idx));
    showToast('Section removed');
  };
  const moveSection = (idx, dir) => {
    setSections(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };
  const addNewSection = () => {
    if (!newSection.key || !newSection.title) {
      showToast('Section ID and Title are required', 'error');
      return;
    }
    setSections(prev => [...prev, {
      ...newSection,
      items: newSection.items.filter(i => i.trim()),
      visible: true
    }]);
    setNewSection({ key: '', title: '', theme: 'dark', image: '', items: [''] });
    showToast(`Section "${newSection.title}" added!`);
  };

  /* ── VIDEO HANDLERS ── */
  const addVideo = () => {
    if (!newVideo.title || !newVideo.url) { showToast('Fill in video title and URL', 'error'); return; }
    setVideos(prev => [...prev, { ...newVideo }]);
    setNewVideo({ title: '', url: '' });
    showToast('Video added!');
  };
  const removeVideo = (idx) => {
    setVideos(prev => prev.filter((_, i) => i !== idx));
    showToast('Video removed');
  };

  /* ── SECURITY HANDLER ── */
  const changePassword = () => {
    const { currentPass, newPass, confirmPass } = security;
    if (currentPass !== ADMIN.password) { showToast('Current password is incorrect', 'error'); return; }
    if (newPass.length < 4) { showToast('New password must be at least 4 characters', 'error'); return; }
    if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return; }
    ADMIN.password = newPass;
    setSecurity({ currentPass: '', newPass: '', confirmPass: '', newAdminName: security.newAdminName });
    showToast('Password changed successfully! 🔐');
  };

  const changeAdminName = () => {
    if (!security.newAdminName.trim()) { showToast('Name cannot be empty', 'error'); return; }
    ADMIN.name = security.newAdminName.trim();
    showToast('Admin name updated!');
  };

  /* ── SAVE ALL ── */
  const saveAll = async () => {
    // Update the live data objects locally
    PROFILE.name = profile.name;
    PROFILE.role = profile.role;
    PROFILE.intro = profile.intro;
    PROFILE.image = profile.image;
    CONTACT.phone = contact.phone;
    CONTACT.whatsapp = contact.whatsapp;
    CONTACT.email = contact.email;
    CONTACT.linkedin = contact.linkedin;
    CONTACT.github = contact.github;
    CONTACT.location = contact.location;
    
    // Update sections
    SECTIONS.length = 0;
    sections.forEach(s => SECTIONS.push({ ...s }));
    
    // Update videos
    VIDEOS.length = 0;
    videos.forEach(v => VIDEOS.push({ ...v }));

    // Prepare payload for DB
    const payload = {
      profile: PROFILE,
      sections: SECTIONS,
      videos: VIDEOS,
      contact: CONTACT,
      admin: ADMIN,
      themeColor: activeColor,
      portfolio: portfolio
    };

    try {
      const { error } = await client.database
        .from('portfolio_data')
        .upsert({ id: 'main', payload });
        
      if (error) throw error;
      showToast('All changes saved to database! ✓');
    } catch (err) {
      console.error(err);
      showToast('Error saving to database', 'error');
    }
  };

  /* ── LOAD DATA ── */
  useState(() => {
    const loadData = async () => {
      try {
        const { data } = await client.database.from('portfolio_data').select('payload').eq('id', 'main').single();
        if (data?.payload) {
          const p = data.payload;
          if (p.themeColor) {
            setActiveColor(p.themeColor);
            setCustomColor(p.themeColor);
            applyTheme(p.themeColor);
          }
          if (p.portfolio) {
            setPortfolio(p.portfolio);
          }
        }
      } catch (err) { console.error("Load error:", err); }
    };
    loadData();
  });

  /* ── RENDER ── */
  return (
    <div className="command-center">
      {/* NAV */}
      <nav className="admin-nav">
        <h1>⚡ PORTFOLIO COMMAND CENTER</h1>
        <div className="admin-nav-actions">
          <button className="btn-save-all" onClick={saveAll}>💾 SAVE ALL</button>
          <button className="btn-view-live" onClick={onBack}>← VIEW LIVE SITE</button>
        </div>
      </nav>

      {/* TAB BAR */}
      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`admin-tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">

        {/* ═══════ PROFILE TAB ═══════ */}
        {activeTab === 'profile' && (
          <section className="admin-section" key="profile">
            <div className="admin-section-header">
              <h2>👤 Profile Information</h2>
              <p className="admin-section-desc">Edit your name, role, bio text, and profile image</p>
            </div>

            <div className="admin-card-bg">
              <div className="admin-grid">
                <div className="admin-field">
                  <label>FULL NAME</label>
                  <input className="admin-input" value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label>ROLE / TAGLINE</label>
                  <input className="admin-input" value={profile.role}
                    onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>INTRODUCTION / BIO</label>
                  <textarea className="admin-textarea" value={profile.intro}
                    onChange={e => setProfile(p => ({ ...p, intro: e.target.value }))} />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>PROFILE IMAGE URL</label>
                  <input className="admin-input" value={profile.image}
                    onChange={e => setProfile(p => ({ ...p, image: e.target.value }))} />
                  {profile.image && (
                    <div className="admin-img-preview">
                      <img src={profile.image} alt="Preview" onError={e => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════ SECTIONS TAB ═══════ */}
        {activeTab === 'sections' && (
          <section className="admin-section" key="sections">
            <div className="admin-section-header">
              <h2>📂 Journey Sections</h2>
              <p className="admin-section-desc">Edit, reorder, add or remove portfolio sections and their content items</p>
            </div>

            {/* Existing Sections */}
            {sections.map((sec, sIdx) => (
              <div className="admin-card-bg section-editor" key={sec.key + sIdx}>
                <div className="section-editor-header">
                  <span className="section-editor-icon">{SECTION_ICONS[sec.key] || '⭐'}</span>
                  <div className="section-editor-title-area">
                    <input
                      className="admin-input section-title-input"
                      value={sec.title}
                      onChange={e => updateSectionField(sIdx, 'title', e.target.value)}
                      placeholder="Section Title"
                    />
                    <div className="section-editor-meta">
                      <span className="meta-badge">KEY: {sec.key}</span>
                      <select className="admin-select-sm"
                        value={sec.theme} onChange={e => updateSectionField(sIdx, 'theme', e.target.value)}>
                        <option value="dark">Dark</option>
                        <option value="teal">Teal</option>
                        <option value="purple">Purple</option>
                      </select>
                      <label className="vis-toggle-inline">
                        <input type="checkbox" checked={sec.visible !== false}
                          onChange={e => updateSectionField(sIdx, 'visible', e.target.checked)} />
                        <span>{sec.visible !== false ? 'Visible' : 'Hidden'}</span>
                      </label>
                    </div>
                  </div>
                  <div className="section-editor-actions">
                    <button className="btn-icon" onClick={() => moveSection(sIdx, -1)} title="Move Up">▲</button>
                    <button className="btn-icon" onClick={() => moveSection(sIdx, 1)} title="Move Down">▼</button>
                    <button className="btn-icon btn-icon-danger" onClick={() => removeSection(sIdx)} title="Delete">✕</button>
                  </div>
                </div>

                {/* Image URL */}
                <div className="admin-field" style={{ marginBottom: 16 }}>
                  <label>IMAGE URL</label>
                  <input className="admin-input" value={sec.image || ''}
                    onChange={e => updateSectionField(sIdx, 'image', e.target.value)} />
                </div>

                {/* Items */}
                <div className="section-items-list">
                  <label className="items-label">CONTENT ITEMS ({sec.items.length})</label>
                  {sec.items.map((item, iIdx) => (
                    <div className="section-item-row" key={iIdx}>
                      <span className="item-number">{iIdx + 1}</span>
                      <input
                        className="admin-input item-input"
                        value={item}
                        onChange={e => updateSectionItem(sIdx, iIdx, e.target.value)}
                        placeholder={`Item ${iIdx + 1}`}
                      />
                      <button className="btn-icon-sm btn-icon-danger"
                        onClick={() => removeSectionItem(sIdx, iIdx)} title="Remove item">✕</button>
                    </div>
                  ))}
                  <button className="btn-add-item" onClick={() => addSectionItem(sIdx)}>
                    + Add Item
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Section */}
            <div className="admin-card-bg new-section-card">
              <h3>➕ Add New Section</h3>
              <div className="admin-grid" style={{ marginTop: 20 }}>
                <div className="admin-field">
                  <label>SECTION ID (e.g. "awards")</label>
                  <input className="admin-input" value={newSection.key}
                    onChange={e => setNewSection(p => ({ ...p, key: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="e.g. awards" />
                </div>
                <div className="admin-field">
                  <label>TITLE</label>
                  <input className="admin-input" value={newSection.title}
                    onChange={e => setNewSection(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Awards & Recognition" />
                </div>
                <div className="admin-field">
                  <label>THEME</label>
                  <select className="admin-select" value={newSection.theme}
                    onChange={e => setNewSection(p => ({ ...p, theme: e.target.value }))}>
                    <option value="dark">Dark</option>
                    <option value="teal">Teal</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>IMAGE URL</label>
                  <input className="admin-input" value={newSection.image}
                    onChange={e => setNewSection(p => ({ ...p, image: e.target.value }))}
                    placeholder="https://..." />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>ITEMS (one per line)</label>
                  {newSection.items.map((item, i) => (
                    <div className="section-item-row" key={i} style={{ marginBottom: 8 }}>
                      <input className="admin-input item-input" value={item}
                        onChange={e => {
                          const items = [...newSection.items];
                          items[i] = e.target.value;
                          setNewSection(p => ({ ...p, items }));
                        }}
                        placeholder={`Item ${i + 1}`} />
                    </div>
                  ))}
                  <button className="btn-add-item"
                    onClick={() => setNewSection(p => ({ ...p, items: [...p.items, ''] }))}>
                    + Add Item
                  </button>
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: 24, padding: '14px 32px', borderRadius: 12 }}
                onClick={addNewSection}>
                ADD SECTION
              </button>
            </div>
          </section>
        )}

        {/* ═══════ CONTACT TAB ═══════ */}
        {activeTab === 'contact' && (
          <section className="admin-section" key="contact">
            <div className="admin-section-header">
              <h2>📞 Contact Information</h2>
              <p className="admin-section-desc">Update your phone, email, social links, and location</p>
            </div>

            <div className="admin-card-bg">
              <div className="admin-grid">
                <div className="admin-field">
                  <label>📞 PHONE NUMBER</label>
                  <input className="admin-input" value={contact.phone}
                    onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label>💬 WHATSAPP NUMBER</label>
                  <input className="admin-input" value={contact.whatsapp}
                    onChange={e => setContact(c => ({ ...c, whatsapp: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label>✉️ EMAIL ADDRESS</label>
                  <input className="admin-input" value={contact.email}
                    onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label>💼 LINKEDIN URL</label>
                  <input className="admin-input" value={contact.linkedin}
                    onChange={e => setContact(c => ({ ...c, linkedin: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label>🐙 GITHUB URL</label>
                  <input className="admin-input" value={contact.github}
                    onChange={e => setContact(c => ({ ...c, github: e.target.value }))} />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>📍 LOCATION</label>
                  <input className="admin-input" value={contact.location}
                    onChange={e => setContact(c => ({ ...c, location: e.target.value }))} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════ THEME TAB ═══════ */}
        {activeTab === 'theme' && (
          <section className="admin-section" key="theme">
            <div className="admin-section-header">
              <h2>🎨 Theme & Appearance</h2>
              <p className="admin-section-desc">Customize the accent color used throughout the portfolio</p>
            </div>

            <div className="admin-card-bg">
              <h3 style={{ marginBottom: 20 }}>Preset Colors</h3>
              <div className="theme-settings">
                {colors.map(c => (
                  <div
                    key={c}
                    className={`theme-circle${activeColor === c ? ' active' : ''}`}
                    style={{ backgroundColor: c, color: c }}
                    onClick={() => applyTheme(c)}
                  />
                ))}
              </div>

              <h3 style={{ marginBottom: 16, marginTop: 32 }}>Custom Color</h3>
              <div className="custom-color-row">
                <input type="color" className="color-picker" value={customColor}
                  onChange={e => setCustomColor(e.target.value)} />
                <input className="admin-input" value={customColor}
                  onChange={e => setCustomColor(e.target.value)}
                  style={{ maxWidth: 200 }}
                  placeholder="#00ffcc" />
                <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: 12 }}
                  onClick={() => applyTheme(customColor)}>
                  APPLY COLOR
                </button>
              </div>

              <div className="theme-preview" style={{ marginTop: 32 }}>
                <h3 style={{ marginBottom: 16 }}>Preview</h3>
                <div className="theme-preview-box">
                  <div className="preview-swatch" style={{ background: activeColor }} />
                  <div>
                    <p style={{ color: activeColor, fontWeight: 800, fontSize: '1.2rem' }}>Active Color: {activeColor}</p>
                    <p style={{ color: 'var(--dim)', fontSize: '.85rem', marginTop: 4 }}>
                      This color is applied to buttons, accents, links, and glows
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════ MEDIA TAB ═══════ */}
        {activeTab === 'media' && (
          <section className="admin-section" key="media">
            <div className="admin-section-header">
              <h2>🎬 Media & Videos</h2>
              <p className="admin-section-desc">Manage your achievement reel videos and section images</p>
            </div>

            {/* Video Management */}
            <div className="admin-card-bg" style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 20 }}>Achievement Reel Videos</h3>
              {videos.map((v, i) => (
                <div className="admin-video-card" key={i}>
                  <div className="admin-field" style={{ flex: 1 }}>
                    <label>TITLE</label>
                    <input className="admin-input" value={v.title}
                      onChange={e => setVideos(prev => prev.map((vid, j) =>
                        j === i ? { ...vid, title: e.target.value } : vid))} />
                  </div>
                  <div className="admin-field" style={{ flex: 2 }}>
                    <label>URL</label>
                    <input className="admin-input" value={v.url}
                      onChange={e => setVideos(prev => prev.map((vid, j) =>
                        j === i ? { ...vid, url: e.target.value } : vid))} />
                  </div>
                  <button className="btn-delete" onClick={() => removeVideo(i)}>DELETE</button>
                </div>
              ))}
              <div className="admin-video-card" style={{ background: 'rgba(0,255,204,.03)', borderColor: 'rgba(0,255,204,.15)' }}>
                <div className="admin-field" style={{ flex: 1 }}>
                  <label>NEW VIDEO TITLE</label>
                  <input className="admin-input" value={newVideo.title}
                    onChange={e => setNewVideo(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Project Demo" />
                </div>
                <div className="admin-field" style={{ flex: 2 }}>
                  <label>VIDEO URL</label>
                  <input className="admin-input" value={newVideo.url}
                    onChange={e => setNewVideo(p => ({ ...p, url: e.target.value }))}
                    placeholder="https://drive.google.com/..." />
                </div>
                <button className="btn-primary" style={{ padding: '12px 20px', borderRadius: 12, whiteSpace: 'nowrap' }}
                  onClick={addVideo}>+ ADD</button>
              </div>
            </div>

            {/* Section Images Quick Edit */}
            <div className="admin-card-bg">
              <h3 style={{ marginBottom: 20 }}>Section Images (Quick Edit)</h3>
              <div className="admin-grid">
                <div className="admin-field">
                  <label>HERO / PROFILE IMAGE</label>
                  <input className="admin-input" value={profile.image}
                    onChange={e => setProfile(p => ({ ...p, image: e.target.value }))} />
                </div>
                {sections.map((s, i) => (
                  <div className="admin-field" key={s.key}>
                    <label>{(SECTION_ICONS[s.key] || '⭐') + ' ' + s.title.toUpperCase()}</label>
                    <input className="admin-input" value={s.image || ''}
                      onChange={e => updateSectionField(i, 'image', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════ PORTFOLIO TAB ═══════ */}
        {activeTab === 'portfolio' && (
          <section className="admin-section" key="portfolio">
            <div className="admin-section-header">
              <h2>💼 Portfolio Settings</h2>
              <p className="admin-section-desc">Manage global portfolio assets and text elements</p>
            </div>

            <div className="admin-card-bg">
              <div className="admin-grid">
                <div className="admin-field">
                  <label>RESUME GOOGLE DRIVE ID</label>
                  <input className="admin-input" value={portfolio.resumeId}
                    onChange={e => setPortfolio(p => ({ ...p, resumeId: e.target.value }))}
                    placeholder="e.g. 1nntVDhbix2AiPEjwTGH..." />
                  <p className="field-hint">The ID from your Google Drive share link</p>
                </div>
                <div className="admin-field">
                  <label>HERO ACCENT INITIAL</label>
                  <input className="admin-input" value={portfolio.heroAccent}
                    onChange={e => setPortfolio(p => ({ ...p, heroAccent: e.target.value }))}
                    placeholder="e.g. S" />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label>FOOTER SUBTITLE / TAGS</label>
                  <input className="admin-input" value={portfolio.footerSub}
                    onChange={e => setPortfolio(p => ({ ...p, footerSub: e.target.value }))} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════ SECURITY TAB ═══════ */}
        {activeTab === 'security' && (
          <section className="admin-section" key="security">
            <div className="admin-section-header">
              <h2>🔐 Security Settings</h2>
              <p className="admin-section-desc">Change your admin credentials and manage access</p>
            </div>

            {/* Change Admin Name */}
            <div className="admin-card-bg" style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 20 }}>Admin Username</h3>
              <div className="admin-grid">
                <div className="admin-field">
                  <label>CURRENT ADMIN NAME</label>
                  <div className="readonly-value">{ADMIN.name}</div>
                </div>
                <div className="admin-field">
                  <label>NEW ADMIN NAME</label>
                  <input className="admin-input" value={security.newAdminName}
                    onChange={e => setSecurity(s => ({ ...s, newAdminName: e.target.value }))} />
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: 20, padding: '12px 28px', borderRadius: 12 }}
                onClick={changeAdminName}>
                UPDATE USERNAME
              </button>
            </div>

            {/* Change Password */}
            <div className="admin-card-bg">
              <h3 style={{ marginBottom: 20 }}>Change Password</h3>
              <div className="admin-grid">
                <div className="admin-field">
                  <label>CURRENT PASSWORD</label>
                  <input className="admin-input" type="password" value={security.currentPass}
                    onChange={e => setSecurity(s => ({ ...s, currentPass: e.target.value }))}
                    placeholder="Enter current password" />
                </div>
                <div className="admin-field">
                  <label>NEW PASSWORD</label>
                  <input className="admin-input" type="password" value={security.newPass}
                    onChange={e => setSecurity(s => ({ ...s, newPass: e.target.value }))}
                    placeholder="Enter new password" />
                </div>
                <div className="admin-field">
                  <label>CONFIRM NEW PASSWORD</label>
                  <input className="admin-input" type="password" value={security.confirmPass}
                    onChange={e => setSecurity(s => ({ ...s, confirmPass: e.target.value }))}
                    placeholder="Confirm new password" />
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: 20, padding: '12px 28px', borderRadius: 12 }}
                onClick={changePassword}>
                CHANGE PASSWORD
              </button>
            </div>

            {/* Danger Zone */}
            <div className="admin-card-bg danger-zone" style={{ marginTop: 32 }}>
              <h3>⚠️ Danger Zone</h3>
              <p style={{ color: 'var(--dim)', marginTop: 8, marginBottom: 16, fontSize: '.85rem' }}>
                These actions cannot be undone. Proceed with caution.
              </p>
              <button className="btn-danger" onClick={() => {
                if (confirm('Reset all sections to default? This cannot be undone.')) {
                  setSections(SECTIONS.map(s => ({ ...s, items: [...s.items], visible: true })));
                  showToast('Sections reset to default');
                }
              }}>
                RESET ALL SECTIONS
              </button>
            </div>
          </section>
        )}

      </div>

      {/* Toast */}
      {toast && (
        <div className={`cc-toast cc-toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span> {toast.message}
        </div>
      )}
    </div>
  );
}
