let renderer;
try {
  const url = new URL(process.env.TAGATAP_ORIGIN);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error();
  renderer = url.origin;
} catch {
  throw new Error('TAGATAP_ORIGIN must be the HTTPS origin of the TAGATAP deployment');
}

export const config = {
  rewrites: [
    { source: '/admin', destination: '/admin/index.html' },
    { source: '/admin/', destination: '/admin/index.html' },
    { source: '/p/:slug', destination: `${renderer}/p/:slug` },
    { source: '/tagatap/:path*', destination: `${renderer}/tagatap/:path*` },
  ],
};
