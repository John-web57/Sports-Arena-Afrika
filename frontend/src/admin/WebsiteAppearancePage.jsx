import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, Monitor, Plus, Save, Smartphone, Tablet, Trash2 } from 'lucide-react';
import api from '../services/api';
import { defaultWebsiteAppearance } from '../config/websiteAppearance';

const sections = [
  ['breaking', 'Breaking news ticker'], ['hero', 'Hero story'], ['latest', 'Latest news'], ['kenya', 'Kenya sports'], ['africa', 'African coverage'],
  ['otherSports', 'Other sports'], ['features', 'Features & analysis'], ['interviews', 'Interviews'], ['events', 'Upcoming events'],
  ['categories', 'Explore categories'], ['transfers', 'Transfer centre'], ['women', 'Women’s football'], ['videos', 'Videos & podcasts'],
  ['community', 'Fan Arena & opinion poll'], ['newsletter', 'Newsletter']
];
const presets = {
  news: ['breaking', 'hero', 'latest', 'kenya', 'africa', 'otherSports', 'features', 'interviews', 'events', 'categories', 'transfers', 'women', 'videos', 'community', 'newsletter'],
  magazine: ['breaking', 'hero', 'features', 'interviews', 'latest', 'videos', 'africa', 'kenya', 'otherSports', 'events', 'categories', 'transfers', 'women', 'community', 'newsletter'],
  compact: ['breaking', 'hero', 'latest', 'kenya', 'africa', 'features']
};
const navigationLabels = ['Home', 'Sports', 'Africa', 'Global', 'News', 'Features', 'More'];
const colorFields = [
  ['primaryColor', 'Primary'], ['primaryDarkColor', 'Primary dark'], ['accentColor', 'Accent'],
  ['breakingColor', 'Breaking news'], ['backgroundColor', 'Background'], ['textColor', 'Text']
];

export default function WebsiteAppearancePage({ appearance = defaultWebsiteAppearance, onApply }) {
  const [settings, setSettings] = useState(() => ({ ...defaultWebsiteAppearance, ...appearance }));
  const [device, setDevice] = useState('desktop');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [newSection, setNewSection] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');

  useEffect(() => setSettings({ ...defaultWebsiteAppearance, ...appearance }), [appearance]);

  const setField = (key, value) => setSettings(current => ({ ...current, [key]: value }));
  const moveSection = (id, direction) => setSettings(current => {
    const order = [...(current.homepageSections || [])];
    const index = order.indexOf(id);
    const target = order[index + direction];
    if (index < 0 || !target) return current;
    const targetIndex = order.indexOf(target);
    [order[index], order[targetIndex]] = [order[targetIndex], order[index]];
    return { ...current, homepageSections: order };
  });
  const applyPreset = (layoutPreset) => setSettings(current => ({ ...current, layoutPreset, homepageSections: [...presets[layoutPreset]] }));
  const addSection = () => {
    if (!newSection) return;
    setSettings(current => ({ ...current, homepageSections: [...(current.homepageSections || []), newSection] }));
    setNewSection('');
  };
  const addCustomBlock = () => {
    const title = customTitle.trim();
    if (!title) return;
    const id = `custom:${crypto.randomUUID?.() || Date.now()}`;
    setSettings(current => ({
      ...current,
      homepageSections: [...(current.homepageSections || []), id],
      customHomepageBlocks: [...(current.customHomepageBlocks || []), { id, title, body: customBody.trim() }]
    }));
    setCustomTitle('');
    setCustomBody('');
  };
  const removeSection = (id) => setSettings(current => ({
    ...current,
    homepageSections: (current.homepageSections || []).filter(sectionId => sectionId !== id),
    customHomepageBlocks: (current.customHomepageBlocks || []).filter(block => block.id !== id)
  }));

  const save = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const saved = await api.saveWebsiteAppearance(settings);
      if (!saved || saved.theme !== settings.theme) throw new Error('The server did not confirm the saved settings.');
      onApply?.(saved);
      setMessage({
        type: 'success',
        text: 'Website appearance saved to server and applied to the public site.'
      });
    } catch (error) {
      const isAuth = /(?:API error: )?(401|403)\b/.test(error.message);
      const isNetwork = error.message.includes('Failed to fetch');

      if (isAuth) {
        setMessage({
          type: 'error',
          text: 'The server rejected this save. Sign in with a Chief Editor account connected to the backend; a local/offline newsroom session cannot save shared website settings.'
        });
      } else if (isNetwork) {
        // Fallback: apply locally in browser storage so the admin can continue configuring & previewing
        onApply?.(settings);
        setMessage({
          type: 'warning',
          text: `Applied locally in browser storage: The backend API is offline (${error.message.match(/\((.*?)\)/)?.[1] || 'localhost:8080'}). Your changes are active on this device. To sync globally for all readers, start the Spring Boot backend.`
        });
      } else {
        setMessage({
          type: 'error',
          text: `Could not save appearance settings: ${error.message}. Check that the backend is running and the database migration has been applied.`
        });
      }
    } finally {
      setBusy(false);
    }
  };

  const PreviewIcon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor;

  return <div className="min-h-screen space-y-6 bg-[#0B0B0F] p-5 text-white sm:p-8">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292938] pb-5">
      <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4B400]">Chief Editor · Public website</p><h1 className="mt-1 text-2xl font-black">Website Appearance</h1><p className="mt-1 text-sm text-gray-400">These settings apply to every reader. Readers cannot change the site theme.</p></div>
      <button type="button" onClick={save} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[#0B6E4F] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4"/>{busy ? 'Saving…' : 'Save Changes'}</button>
    </header>

    {message && (
      <div
        role="status"
        className={`flex items-start gap-3 rounded-lg border p-4 text-sm transition-all ${
          (typeof message === 'object' && message.type === 'success')
            ? 'border-emerald-600/50 bg-emerald-950/40 text-emerald-200'
            : (typeof message === 'object' && message.type === 'warning')
            ? 'border-amber-500/50 bg-amber-950/40 text-amber-200'
            : 'border-rose-600/50 bg-rose-950/40 text-rose-200'
        }`}
      >
        <span className="font-bold shrink-0">
          {(typeof message === 'object' && message.type === 'success') ? '✓ Saved:' : (typeof message === 'object' && message.type === 'warning') ? '⚠ Local Mode:' : '✕ Error:'}
        </span>
        <span className="leading-relaxed">{typeof message === 'object' ? message.text : message}</span>
      </div>
    )}

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
      <div className="space-y-6">
        <section className="rounded-xl border border-[#292938] bg-[#121218] p-5">
          <h2 className="font-bold">Website theme</h2><p className="mb-4 mt-1 text-sm text-gray-400">Choose the single theme all readers will see.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {['light', 'dark'].map(theme => <label key={theme} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${settings.theme === theme ? 'border-[#0B6E4F] bg-[#0B6E4F]/15' : 'border-[#343444]'}`}>
              <input type="radio" name="site-theme" value={theme} checked={settings.theme === theme} onChange={() => setSettings(current => ({ ...current, theme, backgroundColor: theme === 'dark' ? '#101817' : '#F7F8FA', textColor: theme === 'dark' ? '#F5F7F7' : '#17202A' }))}/><span className="font-semibold capitalize">{theme} mode</span>
            </label>)}
          </div>
        </section>

        <section className="rounded-xl border border-[#292938] bg-[#121218] p-5">
          <h2 className="font-bold">Homepage layout</h2><div className="mt-3 flex flex-wrap gap-2">{Object.keys(presets).map(preset => <button key={preset} onClick={() => applyPreset(preset)} className={`rounded-lg border px-3 py-2 text-sm capitalize ${settings.layoutPreset === preset ? 'border-[#0B6E4F] bg-[#0B6E4F]/20 text-white' : 'border-[#343444] text-gray-300'}`}>{preset} layout</button>)}</div>
          <p className="mb-3 mt-4 text-sm text-gray-400">Add or remove homepage blocks and use the arrows to reorder them. The breaking-news ticker stays in the header; the other blocks follow this order.</p>
          <div className="mb-4 flex flex-wrap gap-2">
            <select aria-label="Add homepage block" value={newSection} onChange={event => setNewSection(event.target.value)} className="min-w-56 flex-1 rounded-lg border border-[#343444] bg-[#181822] p-2 text-sm text-white">
              <option value="">Choose an available block…</option>
              {sections.filter(([id]) => !(settings.homepageSections || []).includes(id)).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
            <button type="button" disabled={!newSection} onClick={addSection} className="inline-flex items-center gap-2 rounded-lg bg-[#0B6E4F] px-3 py-2 text-sm font-bold text-white disabled:opacity-40"><Plus className="h-4 w-4"/>Add block</button>
          </div>
          <div className="mb-4 grid gap-2 rounded-lg border border-[#292938] bg-[#181822] p-3 sm:grid-cols-[1fr_2fr_auto]">
            <input aria-label="New custom block title" value={customTitle} onChange={event => setCustomTitle(event.target.value)} placeholder="New feature title" className="rounded border border-[#343444] bg-[#101017] px-3 py-2 text-sm text-white"/>
            <input aria-label="New custom block description" value={customBody} onChange={event => setCustomBody(event.target.value)} placeholder="Short intro shown on the homepage (optional)" className="rounded border border-[#343444] bg-[#101017] px-3 py-2 text-sm text-white"/>
            <button type="button" disabled={!customTitle.trim()} onClick={addCustomBlock} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#343444] px-3 py-2 text-sm font-bold text-white disabled:opacity-40"><Plus className="h-4 w-4"/>New custom feature</button>
          </div>
          <div className="space-y-2">{(settings.homepageSections || []).map((id, index) => {
            const customBlock = (settings.customHomepageBlocks || []).find(block => block.id === id);
            const label = customBlock?.title || sections.find(([sectionId]) => sectionId === id)?.[1] || id;
            return <div key={id} className="flex items-center gap-3 rounded-lg border border-[#292938] bg-[#181822] px-3 py-2">
              <span className="flex-1 text-sm">{index + 1}. {label}{customBlock && <span className="ml-2 text-xs text-gray-500">Custom feature</span>}</span>
              <button type="button" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => moveSection(id, -1)} className="rounded p-1 text-gray-300 hover:bg-[#292938] disabled:opacity-30"><ArrowUp className="h-4 w-4"/></button>
              <button type="button" aria-label={`Move ${label} down`} disabled={index === settings.homepageSections.length - 1} onClick={() => moveSection(id, 1)} className="rounded p-1 text-gray-300 hover:bg-[#292938] disabled:opacity-30"><ArrowDown className="h-4 w-4"/></button>
              <button type="button" aria-label={`Remove ${label}`} onClick={() => removeSection(id)} className="rounded p-1 text-red-300 hover:bg-red-950/50"><Trash2 className="h-4 w-4"/></button>
            </div>;
          })}</div>
        </section>

        <section className="rounded-xl border border-[#292938] bg-[#121218] p-5">
          <h2 className="font-bold">Navigation</h2><p className="mb-3 mt-1 text-sm text-gray-400">Choose and order the public top-level navigation items.</p>
          <div className="space-y-2">{navigationLabels.map(label => {
            const order = settings.navigationItems || [];
            const index = order.indexOf(label);
            return <div key={label} className="flex items-center gap-3 rounded-lg border border-[#292938] bg-[#181822] px-3 py-2">
              <input type="checkbox" aria-label={`Show ${label} navigation`} checked={index >= 0} onChange={() => setSettings(current => { const items = new Set(current.navigationItems || []); items.has(label) ? items.delete(label) : items.add(label); return { ...current, navigationItems: navigationLabels.filter(item => items.has(item)) }; })}/><span className="flex-1 text-sm">{label}</span>
              {index >= 0 && <><button type="button" aria-label={`Move ${label} navigation up`} disabled={index === 0} onClick={() => setSettings(current => { const items = [...current.navigationItems]; [items[index - 1], items[index]] = [items[index], items[index - 1]]; return { ...current, navigationItems: items }; })} className="rounded p-1 text-gray-300 hover:bg-[#292938] disabled:opacity-30"><ArrowUp className="h-4 w-4"/></button><button type="button" aria-label={`Move ${label} navigation down`} disabled={index === order.length - 1} onClick={() => setSettings(current => { const items = [...current.navigationItems]; [items[index + 1], items[index]] = [items[index], items[index + 1]]; return { ...current, navigationItems: items }; })} className="rounded p-1 text-gray-300 hover:bg-[#292938] disabled:opacity-30"><ArrowDown className="h-4 w-4"/></button></>}
            </div>;
          })}</div>
        </section>

        <section className="rounded-xl border border-[#292938] bg-[#121218] p-5">
          <h2 className="font-bold">Brand colors</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{colorFields.map(([key, label]) => <label key={key} className="flex items-center gap-3 text-sm text-gray-300"><input type="color" value={settings[key] || defaultWebsiteAppearance[key]} onChange={event => setField(key, event.target.value)} className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent"/><span>{label}</span><code className="ml-auto text-xs text-gray-400">{settings[key]}</code></label>)}</div>
        </section>

        <section className="rounded-xl border border-[#292938] bg-[#121218] p-5">
          <h2 className="font-bold">Header and article presentation</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.stickyHeader} onChange={e => setField('stickyHeader', e.target.checked)}/> Sticky header</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.showSearch} onChange={e => setField('showSearch', e.target.checked)}/> Search button</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.showSocial} onChange={e => setField('showSocial', e.target.checked)}/> Social icons</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.showSidebar} onChange={e => setField('showSidebar', e.target.checked)}/> Article sidebar</label>
            <label className="text-sm text-gray-300">Article layout<select value={settings.articleLayout} onChange={e => setField('articleLayout', e.target.value)} className="mt-1 block w-full rounded-lg border border-[#343444] bg-[#181822] p-2 text-white"><option value="standard">Standard</option><option value="wide">Wide</option><option value="sidebar">Article + sidebar</option></select></label>
            <label className="text-sm text-gray-300">Heading font<select value={settings.headingFont} onChange={e => setField('headingFont', e.target.value)} className="mt-1 block w-full rounded-lg border border-[#343444] bg-[#181822] p-2 text-white"><option>Montserrat</option><option>Poppins</option><option>Arial</option><option>Georgia</option></select></label>
            <label className="text-sm text-gray-300">Body font<select value={settings.bodyFont} onChange={e => setField('bodyFont', e.target.value)} className="mt-1 block w-full rounded-lg border border-[#343444] bg-[#181822] p-2 text-white"><option>Poppins</option><option>Montserrat</option><option>Arial</option><option>Georgia</option></select></label>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-xl border border-[#292938] bg-[#121218] p-5 xl:sticky xl:top-5">
        <div className="flex items-center justify-between gap-2"><div><h2 className="font-bold">Preview</h2><p className="text-xs text-gray-400">Preview only; public changes apply when saved.</p></div><Eye className="h-4 w-4 text-gray-400"/></div>
        <div className="mt-3 flex gap-2">{[['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]].map(([name, Icon]) => <button key={name} onClick={() => setDevice(name)} aria-label={`${name} preview`} className={`rounded p-2 ${device === name ? 'bg-[#0B6E4F] text-white' : 'text-gray-400 hover:bg-[#242432]'}`}><Icon className="h-4 w-4"/></button>)}</div>
        <div className={`mx-auto mt-4 overflow-hidden rounded-xl border border-gray-500 shadow-xl ${device === 'mobile' ? 'max-w-[250px]' : device === 'tablet' ? 'max-w-[420px]' : 'w-full'}`} style={{ background: settings.backgroundColor, color: settings.textColor }}>
          <div className="p-3 text-xs font-bold text-white" style={{ background: settings.primaryDarkColor }}>SPORTS ARENA AFRIKA <span className="float-right rounded px-2" style={{ background: settings.breakingColor }}>LIVE</span></div>
          <div className="p-4"><span className="rounded px-2 py-1 text-[10px] font-bold text-white" style={{ background: settings.accentColor }}>FEATURED</span><h3 className="mt-3 text-xl font-black" style={{ fontFamily: settings.headingFont }}>African sports, told by Africa.</h3><p className="mt-2 text-sm opacity-80" style={{ fontFamily: settings.bodyFont }}>A preview of your selected reader theme and colors.</p><button className="mt-4 rounded px-3 py-2 text-sm font-bold text-white" style={{ background: settings.primaryColor }}>Read the story</button></div>
        </div>
      </aside>
    </div>
  </div>;
}
