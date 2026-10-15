import React, { useState } from 'react';
import { useAuthActions, useConvexAuth } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ProfileEditor from './ProfileEditor.jsx';

function Brand() {
  return <a className="admin-brand" href="/" aria-label="SmarTap home"><img src="/smartap-logo-dark.svg" alt="SmarTap" /></a>;
}

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() { return { failed: true }; }

  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="admin-denied" role="alert">
      <Brand />
      <h1>Workspace unavailable</h1>
      <p>We could not load your admin data. Check your connection and try again.</p>
      <button className="admin-primary" type="button" onClick={() => window.location.reload()}>Try again</button>
    </main>;
  }
}

function SignIn() {
  const { signIn } = useAuthActions();
  const [setup, setSetup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');
    const setupCode = String(form.get('setupCode') || '').trim();
    if (setup && password.length < 14) {
      setError('Use a password with at least 14 characters.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const result = await signIn('password', {
        flow: setup ? 'signUp' : 'signIn',
        email,
        password,
        ...(setup ? { setupCode } : {}),
      });
      if (!result.signingIn) throw new Error('Sign-in did not complete.');
    } catch {
      setError(setup
        ? 'Setup failed. Check the authorized email, password, and one-time code.'
        : 'Sign-in failed. Check your email and password.');
      setBusy(false);
    }
  }

  return <main className="admin-auth-layout">
    <div className="admin-auth-side">
      <Brand />
      <div className="admin-auth-message">
        <p className="admin-overline">SmarTap workspace</p>
        <h1>Every introduction, in one place.</h1>
        <p>Manage the personal pages connected to your NFC cards.</p>
      </div>
      <span className="admin-side-foot">Private access for your team</span>
    </div>
    <div className="admin-auth-panel">
      <div className="admin-auth-form-wrap">
        <p className="admin-overline">Admin access</p>
        <h2>{setup ? 'Set up admin access' : 'Admin sign in'}</h2>
        <p className="admin-auth-intro">{setup
          ? 'Create the first account using the email authorized in Convex and its one-time setup code.'
          : 'Sign in with your authorized email and password.'}</p>
        <form onSubmit={submit}>
          <label htmlFor="admin-email">Email address</label>
          <input id="admin-email" name="email" type="email" autoComplete="username" required disabled={busy} />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" name="password" type="password" autoComplete={setup ? 'new-password' : 'current-password'} minLength={setup ? 14 : undefined} required disabled={busy} />
          {setup && <>
            <label htmlFor="admin-code">One-time setup code</label>
            <input id="admin-code" name="setupCode" type="password" autoComplete="off" required disabled={busy} />
          </>}
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button className="admin-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : setup ? 'Create admin account' : 'Sign in'}</button>
        </form>
        <button className="admin-text-button" type="button" onClick={() => { setSetup(!setup); setError(''); }} disabled={busy}>
          {setup ? 'Back to sign in' : 'Set up first account'}
        </button>
      </div>
    </div>
  </main>;
}

export function ProfileInventory({ profiles, onEdit }) {
  if (profiles === undefined) return <div className="admin-list-state" role="status">Loading profiles…</div>;
  if (profiles.length === 0) return <div className="admin-list-state"><h2>No profiles yet</h2><p>Profiles you create will appear here with their status and permanent URL.</p></div>;
  return <div className="admin-table-scroll"><table className="admin-table">
    <caption>{profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'}</caption>
    <thead><tr><th scope="col">Person</th><th scope="col">Page path</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col">Action</th></tr></thead>
    <tbody>{profiles.map(profile => <tr key={profile._id}>
      <th scope="row" data-label="Person">{profile.name}</th>
      <td data-label="Page path"><code>/p/{profile.slug}</code></td>
      <td data-label="Status"><span className={`admin-status admin-status-${profile.status}`}>{profile.status}</span></td>
      <td data-label="Updated"><time dateTime={new Date(profile.updatedAt).toISOString()}>{new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' }).format(profile.updatedAt)}</time></td>
      <td data-label="Action"><button type="button" onClick={() => onEdit?.(profile._id)}>Edit profile<span className="admin-sr-only">: {profile.name}</span></button></td>
    </tr>)}</tbody>
  </table></div>;
}

function EditorLoader({ id, onBack }) {
  const profile = useQuery(api.profiles.getForAdmin, { id });
  if (profile === undefined) return <div className="admin-list-state" role="status">Loading profile…</div>;
  if (profile === null) return <div className="admin-list-state"><h2>Profile not found</h2><button type="button" onClick={onBack}>Back to profiles</button></div>;
  return <ProfileEditor key={profile._id} profile={profile} onBack={onBack} />;
}

function Dashboard() {
  const profiles = useQuery(api.profiles.list, {});
  const createDraft = useMutation(api.profiles.createDraft);
  const { signOut } = useAuthActions();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(() => new URLSearchParams(window.location.search).get('profile'));
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingNew, setSavingNew] = useState(false);

  function choose(id) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('profile', id); else url.searchParams.delete('profile');
    window.history.pushState({}, '', url);
    setSelected(id);
    setError('');
  }

  React.useEffect(() => {
    const sync = () => setSelected(new URLSearchParams(window.location.search).get('profile'));
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  async function create(event) {
    event.preventDefault();
    setSavingNew(true);
    setError('');
    try {
      const id = await createDraft({ input: { name: newName } });
      setCreating(false);
      setNewName('');
      choose(id);
    } catch (reason) { setError(reason?.message || 'Could not create the draft. Try again.'); }
    finally { setSavingNew(false); }
  }

  async function leave() {
    setSigningOut(true);
    setError('');
    try { await signOut(); } catch { setError('Could not sign out. Try again.'); setSigningOut(false); }
  }

  return <div className="admin-dashboard">
    <header className="admin-header">
      <Brand />
      <div className="admin-header-actions"><span>Admin workspace</span><button type="button" onClick={leave} disabled={signingOut}>{signingOut ? 'Signing out…' : 'Sign out'}</button></div>
    </header>
    <main className="admin-main">
      {selected ? (
        profiles === undefined ? <div className="admin-list-state" role="status">Loading profiles…</div> :
        profiles.some(profile => profile._id === selected) ? <EditorLoader id={selected} onBack={() => choose(null)} /> :
        <div className="admin-list-state"><h2>Profile not found</h2><button type="button" onClick={() => choose(null)}>Back to profiles</button></div>
      ) : <>
      <div className="admin-page-heading"><div><p className="admin-overline">Your pages</p><h1>Profile dashboard</h1><p>See every personal page and its publication status.</p></div><div className="admin-heading-actions"><span className="admin-count">{profiles === undefined ? '—' : profiles.length} {profiles?.length === 1 ? 'profile' : 'profiles'}</span><button className="admin-primary" type="button" onClick={() => setCreating(value => !value)}>New profile</button></div></div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {creating && <form className="admin-new-form" onSubmit={create}><label htmlFor="new-profile-name">Full name</label><input id="new-profile-name" autoFocus maxLength="80" required value={newName} onChange={event => setNewName(event.target.value)} /><button className="admin-primary" type="submit" disabled={savingNew}>{savingNew ? 'Creating…' : 'Create draft'}</button></form>}
      <ProfileInventory profiles={profiles} onEdit={choose} />
      </>}
    </main>
  </div>;
}

function AdminGate() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const authorized = useQuery(api.admin.viewer, isAuthenticated ? {} : 'skip');
  const { signOut } = useAuthActions();
  const [signOutError, setSignOutError] = useState('');
  if (isLoading) return <div className="admin-gate-state" role="status">Checking your session…</div>;
  if (!isAuthenticated) return <SignIn />;
  if (authorized === undefined) return <div className="admin-gate-state" role="status">Checking admin access…</div>;
  if (!authorized) return <main className="admin-denied"><Brand /><h1>Access not authorized</h1><p>This account is signed in but is not on the admin allowlist.</p>{signOutError && <p className="admin-form-error" role="alert">{signOutError}</p>}<button className="admin-primary" type="button" onClick={async () => { try { await signOut(); } catch { setSignOutError('Could not sign out. Try again.'); } }}>Sign out</button></main>;
  return <Dashboard />;
}

export default function AdminApp() {
  return <AdminErrorBoundary><AdminGate /></AdminErrorBoundary>;
}
