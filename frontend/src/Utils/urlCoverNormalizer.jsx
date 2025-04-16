// utils.js
export const normalizeCoverUrl = (url) => {
    // Replace '/media/media/' with '/media/'
    return url.replace('/media/media/', '/media/');
  };