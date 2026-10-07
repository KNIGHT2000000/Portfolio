import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/data/siteConfig.ts';

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  base: siteConfig.base || '/',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory'
  }
});
