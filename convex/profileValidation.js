export const defaultAppearance = Object.freeze({
  portraitX: 0,
  portraitY: 8,
  portraitScale: 1,
  backgroundX: 50,
  backgroundY: 50,
  backgroundOverlay: 0.5,
  accentColor: '#a8f53b',
  darkColor: '#282e31',
});

export const accentColors = ['#a8f53b', '#6ee7b7', '#ffd166', '#93c5fd'];
export const darkColors = ['#282e31', '#1f2937', '#102a2a', '#242034'];

function boundedText(value, field, max) {
  const text = String(value || '').trim();
  if (text.length > max) throw new Error(`${field} is too long.`);
  return text;
}

function safeLink(value, field) {
  if (!value) return '';
  const text = boundedText(value, field, 500);
  let url;
  try { url = new URL(text); } catch { throw new Error(`${field} must be a valid HTTPS URL.`); }
  if (url.protocol !== 'https:') throw new Error(`${field} must be a valid HTTPS URL.`);
  return url.href;
}

function boundedNumber(value, field, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${field} is out of range.`);
  }
  return value;
}

export function slugBase(name) {
  return name.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48).replace(/-$/, '') || 'person';
}

export function normalizeProfileInput(input) {
  const name = boundedText(input.name, 'Name', 80);
  if (!name) throw new Error('Name is required.');
  const phone = boundedText(input.phone, 'Phone', 24).replace(/[\s().-]/g, '');
  if (phone && !/^\+?[1-9]\d{6,14}$/.test(phone)) throw new Error('Phone must be a valid international number.');
  const email = boundedText(input.email, 'Email', 254).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email is invalid.');
  const social = Object.fromEntries(['facebook', 'instagram', 'tiktok', 'messenger'].map(key => [key, safeLink(input.social?.[key], key)]));
  const rawAppearance = { ...defaultAppearance, ...input.appearance };
  const appearance = {
    portraitX: boundedNumber(rawAppearance.portraitX, 'Portrait X', -50, 100),
    portraitY: boundedNumber(rawAppearance.portraitY, 'Portrait Y', -50, 100),
    portraitScale: boundedNumber(rawAppearance.portraitScale, 'Portrait scale', 0.5, 2),
    backgroundX: boundedNumber(rawAppearance.backgroundX, 'Background X', 0, 100),
    backgroundY: boundedNumber(rawAppearance.backgroundY, 'Background Y', 0, 100),
    backgroundOverlay: boundedNumber(rawAppearance.backgroundOverlay, 'Background overlay', 0, 1),
    accentColor: rawAppearance.accentColor,
    darkColor: rawAppearance.darkColor,
  };
  if (!accentColors.includes(appearance.accentColor) || !darkColors.includes(appearance.darkColor)) {
    throw new Error('Choose colors from the available palette.');
  }
  return {
    name,
    headline: boundedText(input.headline, 'Headline', 80),
    description: boundedText(input.description, 'Description', 400),
    phone,
    email,
    address: boundedText(input.address, 'Address', 160),
    mapsLocation: boundedText(input.mapsLocation, 'Maps location', 200),
    social,
    portraitKind: input.portraitKind === 'photo' ? 'photo' : 'cutout',
    appearance,
  };
}

export function validatePublication(profile) {
  if (!profile.name?.trim()) throw new Error('Add a name before publishing.');
  if (!profile.portraitStorageId) throw new Error('Add a portrait before publishing.');
  if (!profile.backgroundStorageId) throw new Error('Add a background before publishing.');
  if (!profile.phone && !profile.email && !Object.values(profile.social || {}).some(Boolean)) {
    throw new Error('Add a phone, email, or social link before publishing.');
  }
}
