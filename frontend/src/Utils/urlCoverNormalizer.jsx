// utils.js
export const normalizeCoverUrl = (url) => {
  if (!url) return ''; // or return a placeholder URL
  return url.replace('/media/media/', '/media/');
};
