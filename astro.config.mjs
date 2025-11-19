// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';


// https://astro.build/config
export default defineConfig({
   site: 'https://insdash.github.io',
  // repo name
  base: '/',
  integrations: [
      sitemap({
        filter: (page) => true,
      }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  }
});
