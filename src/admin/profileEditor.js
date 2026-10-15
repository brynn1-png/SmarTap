import { normalizeProfileInput } from '../../convex/profileValidation.js';

export function draftInput(fields) {
  return normalizeProfileInput(fields);
}

export function imageError(file) {
  if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Choose a JPEG, PNG, or WebP image.';
  if (file.size > 8 * 1024 * 1024) return 'Choose an image under 8 MB.';
  return '';
}

export function publishedUrl(slug) {
  return `https://smartap-png.vercel.app/p/${slug}`;
}
