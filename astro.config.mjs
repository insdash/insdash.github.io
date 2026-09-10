// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';


// https://astro.build/config
export default defineConfig({
   site: 'https://insdash.ch',
  // repo name
  base: '/',
  integrations: [
      sitemap({
        // Was `() => true`, which is the same as no filter and left ESLint
        // flagging an unused `page`. The human-readable index duplicates this
        // file, so keep it out.
        filter: (page) => !page.endsWith('/sitemap/'),
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
