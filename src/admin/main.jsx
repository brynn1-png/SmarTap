import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import AdminApp from './AdminApp.jsx';
import './admin.css';

const url = import.meta.env.VITE_CONVEX_URL;
const client = url ? new ConvexReactClient(url) : null;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {client ? <ConvexAuthProvider client={client}><AdminApp /></ConvexAuthProvider> : (
      <main className="admin-setup-error">
        <h1>Admin is not configured</h1>
        <p>This site needs its Convex deployment URL before admin sign-in can work.</p>
      </main>
    )}
  </React.StrictMode>,
);
