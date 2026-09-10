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
  // Canonicals and the sitemap already end in a slash, and GitHub Pages answers
  // `/about` with a 301 to `/about/`. Internal links have to carry the slash;
  // this makes the dev server flag the ones that do not.
  trailingSlash: 'always',
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
