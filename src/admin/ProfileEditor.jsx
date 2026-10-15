import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { accentColors, darkColors, defaultAppearance } from '../../convex/profileValidation.js';
import { draftInput, imageError, publishedUrl } from './profileEditor.js';

const initialFields = profile => ({
  name: profile.name || '', headline: profile.headline || '', description: profile.description || '',
  phone: profile.phone || '', email: profile.email || '', address: profile.address || '', mapsLocation: profile.mapsLocation || '',
  social: { facebook: '', instagram: '', tiktok: '', messenger: '', ...profile.social },
  portraitKind: profile.portraitKind || 'cutout', appearance: { ...defaultAppearance, ...profile.appearance },
});

const textFields = [
  ['headline', 'Headline', 80], ['phone', 'Phone', 24], ['email', 'Email', 254],
  ['address', 'Address', 160], ['mapsLocation', 'Maps location', 200],
];
const socialFields = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['messenger', 'Messenger']];
const sliders = [
  ['portraitX', 'Portrait horizontal position', -50, 100, 1],
  ['portraitY', 'Portrait vertical position', -50, 100, 1],
  ['portraitScale', 'Portrait size', 0.5, 2, 0.05],
  ['backgroundX', 'Background horizontal position', 0, 100, 1],
  ['backgroundY', 'Background vertical position', 0, 100, 1],
  ['backgroundOverlay', 'Background dark overlay', 0, 1, 0.05],
];

function Field({ label, id, children }) {
  return <div className="admin-field"><label htmlFor={id}>{label}</label>{children}</div>;
}

export default function ProfileEditor({ profile, onBack }) {
  const [fields, setFields] = useState(() => initialFields(profile));
  const [tab, setTab] = useState('details');
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [previewAttempt, setPreviewAttempt] = useState(0);
  const frame = useRef(null);
  const save = useMutation(api.profiles.save);
  const publish = useMutation(api.profiles.publish);
  const unpublish = useMutation(api.profiles.unpublish);
  const archive = useMutation(api.profiles.archive);
  const generateUploadUrl = useMutation(api.profiles.generateUploadUrl);
  const attachImage = useMutation(api.profiles.attachImage);
  const discardUpload = useMutation(api.profiles.discardUpload);

  function change(key, value, group) {
    setFields(current => group ? { ...current, [group]: { ...current[group], [key]: value } } : { ...current, [key]: value });
    setDirty(true);
    setFeedback('');
  }

  async function run(label, action) {
    setBusy(label);
    setError('');
    setFeedback('');
    try { await action(); } catch (reason) { setFeedback(''); setError(reason?.message || `${label} failed. Try again.`); }
    finally { setBusy(''); }
  }

  async function saveFields() {
    const input = draftInput(fields);
    await save({ id: profile._id, input });
    setDirty(false);
    setFeedback('Changes saved.');
  }

  async function upload(kind, file) {
    const problem = imageError(file);
    if (problem) { setError(problem); return; }
    await run(`Uploading ${kind}`, async () => {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      if (!response.ok) throw new Error(`Could not upload ${kind}. Try again.`);
      const { storageId } = await response.json();
      try { await attachImage({ id: profile._id, kind, storageId }); }
      catch (reason) { await discardUpload({ storageId }).catch(() => {}); throw reason; }
      setFeedback(`${kind === 'portrait' ? 'Portrait' : 'Background'} uploaded.`);
    });
  }

  async function publishFields() {
    await saveFields();
    await publish({ id: profile._id });
    setFeedback('Page published. Copy its URL to your NFC card.');
  }

  const previewProfile = { ...profile, ...fields, portraitUrl: profile.portraitUrl, backgroundUrl: profile.backgroundUrl };
  useEffect(() => {
    function receive(event) {
      if (event.source === frame.current?.contentWindow && event.origin === window.location.origin && event.data?.type === 'smartap:ready') setPreviewReady(true);
    }
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  useEffect(() => {
    if (previewReady) frame.current?.contentWindow?.postMessage({ type: 'smartap:preview', profile: previewProfile }, window.location.origin);
  }, [previewReady, fields, profile]);
  useEffect(() => {
    if (tab !== 'preview' || previewReady) return;
    const timeout = window.setTimeout(() => setPreviewError(true), 4000);
    return () => window.clearTimeout(timeout);
  }, [tab, previewReady, previewAttempt]);

  return <div className="admin-editor">
    <button className="admin-text-button" type="button" onClick={() => { if (!dirty || window.confirm('Discard unsaved changes?')) onBack(); }}>Back to profiles</button>
    <div className="admin-editor-heading"><div><h1>{profile.name}</h1><p><code>/p/{profile.slug}</code> <span className={`admin-status admin-status-${profile.status}`}>{profile.status}</span></p></div></div>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
    {feedback && <p className="admin-form-success" role="status">{feedback}</p>}
    <nav className="admin-editor-tabs" aria-label="Profile sections">{[['details', 'Details'], ['images', 'Images'], ['customization', 'Customization'], ['preview', 'Preview']].map(([id, label]) => <button key={id} type="button" aria-current={tab === id ? 'page' : undefined} onClick={() => { setPreviewReady(false); setPreviewError(false); setTab(id); }}>{label}</button>)}</nav>
    <fieldset className="admin-editor-section" disabled={Boolean(busy)} aria-busy={Boolean(busy)}>

    {tab === 'details' && <div className="admin-form-grid">
      <Field id="profile-name" label="Full name"><input id="profile-name" maxLength="80" required value={fields.name} onChange={event => change('name', event.target.value)} /></Field>
      {textFields.map(([id, label, max]) => <Field key={id} id={`profile-${id}`} label={label}><input id={`profile-${id}`} type={id === 'email' ? 'email' : 'text'} maxLength={max} value={fields[id]} onChange={event => change(id, event.target.value)} /></Field>)}
      <Field id="profile-description" label="Description"><textarea id="profile-description" maxLength="400" rows="4" value={fields.description} onChange={event => change('description', event.target.value)} /></Field>
      <h2>Social links</h2><p className="admin-field-help">Use full HTTPS links. Leave unused platforms blank.</p>
      {socialFields.map(([id, label]) => <Field key={id} id={`profile-${id}`} label={label}><input id={`profile-${id}`} type="url" maxLength="500" value={fields.social[id]} onChange={event => change(id, event.target.value, 'social')} /></Field>)}
    </div>}

    {tab === 'images' && <div className="admin-image-grid">{[['portrait', 'Portrait', profile.portraitUrl], ['background', 'Background', profile.backgroundUrl]].map(([kind, label, url]) => <section key={kind} className="admin-image-field"><h2>{label}</h2><p>JPEG, PNG, or WebP under 8 MB.</p>{url ? <img src={url} alt={`${label} for ${profile.name}`} /> : <p className="admin-image-empty">No {kind} uploaded</p>}<label htmlFor={`upload-${kind}`}>Replace {kind}</label><input id={`upload-${kind}`} type="file" accept="image/jpeg,image/png,image/webp" disabled={Boolean(busy)} onChange={event => { const file = event.target.files?.[0]; if (file) upload(kind, file); event.target.value = ''; }} /></section>)}
      <Field id="portrait-kind" label="Portrait style"><select id="portrait-kind" value={fields.portraitKind} onChange={event => change('portraitKind', event.target.value)}><option value="cutout">Transparent cutout</option><option value="photo">Ordinary photo</option></select></Field>
    </div>}

    {tab === 'customization' && <div className="admin-customization"><p>Adjust the photos and choose from the approved colors. The page layout stays the same.</p>{sliders.map(([id, label, min, max, step]) => <Field key={id} id={`setting-${id}`} label={`${label}: ${fields.appearance[id]}`}><input id={`setting-${id}`} type="range" min={min} max={max} step={step} value={fields.appearance[id]} onChange={event => change(id, Number(event.target.value), 'appearance')} /></Field>)}
      <Field id="accent-color" label="Accent color"><select id="accent-color" value={fields.appearance.accentColor} onChange={event => change('accentColor', event.target.value, 'appearance')}>{accentColors.map(color => <option key={color} value={color}>{color}</option>)}</select></Field>
      <Field id="dark-color" label="Dark color"><select id="dark-color" value={fields.appearance.darkColor} onChange={event => change('darkColor', event.target.value, 'appearance')}>{darkColors.map(color => <option key={color} value={color}>{color}</option>)}</select></Field>
    </div>}

    {tab === 'preview' && <div className="admin-preview"><p>Review the current fields before publishing. Unsaved text changes appear here; uploaded images are saved immediately.</p>{!previewReady && !previewError && <p role="status">Waiting for the template preview…</p>}{previewError && <div className="admin-preview-error" role="alert"><p>Preview unavailable. Save your changes and try again later.</p><button type="button" onClick={() => { setPreviewError(false); setPreviewReady(false); setPreviewAttempt(value => value + 1); }}>Retry preview</button></div>}<iframe key={previewAttempt} ref={frame} className={previewReady ? '' : 'admin-preview-pending'} src="/p/preview" title={`Preview of ${fields.name || 'profile'}`} /></div>}
    </fieldset>

    <div className="admin-editor-actions">
      <button className="admin-primary" type="button" disabled={Boolean(busy) || !dirty} onClick={() => run('Save', saveFields)}>{busy === 'Save' ? 'Saving…' : 'Save changes'}</button>
      {profile.status !== 'published' && <button type="button" disabled={Boolean(busy)} onClick={() => run('Publish', publishFields)}>{busy === 'Publish' ? 'Publishing…' : 'Publish'}</button>}
      {profile.status === 'published' && <><button type="button" disabled={Boolean(busy) || dirty} onClick={() => run('Unpublish', async () => { await unpublish({ id: profile._id }); setFeedback('Page unpublished. The NFC URL now shows unavailable.'); })}>Unpublish</button><button type="button" onClick={() => run('Copy URL', async () => { await navigator.clipboard.writeText(publishedUrl(profile.slug)); setFeedback('Published URL copied.'); })}>Copy URL</button></>}
      {profile.status !== 'archived' && <button className="admin-danger" type="button" disabled={Boolean(busy) || dirty} onClick={() => { if (window.confirm('Archive this profile? Its public page will become unavailable.')) run('Archive', async () => { await archive({ id: profile._id }); onBack(); }); }}>Archive</button>}
    </div>
  </div>;
}
