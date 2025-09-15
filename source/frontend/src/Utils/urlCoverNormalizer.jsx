
export const normalizeCoverUrl = (url) => {
  if (!url) return ''; 
  return url.replace('/media/media/', '/media/');
};
