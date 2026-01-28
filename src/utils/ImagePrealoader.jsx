// utils/imagePreloader.js
import ganci from '../assets/ganci.jpg';
import custom from '../assets/custom.jpg';
import bungbung from '../assets/bungbung.jpg';

export const preloadImages = (imageSources) => {
  imageSources.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Preload gambar untuk Lemari Karya
export const lemariKaryaImages = [
  ganci,
  custom,
  bungbung,
];
