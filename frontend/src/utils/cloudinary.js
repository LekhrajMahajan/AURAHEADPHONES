/**
 * Returns an optimised Cloudinary URL for a given image src.
 *
 * For Cloudinary URLs it injects transformations right after `/upload/`:
 *   f_auto  → serve WebP/AVIF automatically
 *   q_auto  → Cloudinary picks the best quality
 *   w_<W>   → resize to the requested width (default 800px)
 *
 * For local/static paths it returns them unchanged.
 */
export function getOptimizedUrl(src, { width = 800 } = {}) {
  if (!src) return src;
  const trimmed = src.trim();

  // Only transform Cloudinary URLs
  if (trimmed.includes('res.cloudinary.com')) {
    // Avoid double-injecting transformations
    if (trimmed.includes('/upload/f_auto') || trimmed.includes('/upload/q_auto')) {
      return trimmed;
    }
    return trimmed.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }

  // Local static path: just normalise (ensure leading slash)
  if (!trimmed.startsWith('http') && !trimmed.startsWith('/')) {
    return `/${trimmed}`;
  }
  return trimmed;
}
