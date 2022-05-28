import { createRequire } from 'module';
import { join } from 'path';
import vitePluginMd from 'vite-plugin-md';
import vitePluginVue from '@vitejs/plugin-vue';
import vitePluginJsx from '@vitejs/plugin-vue-jsx';
import { injectHtml } from 'vite-plugin-html';
import hljs from 'highlight.js';
import { setBuildTarget, getVdminConfig, isDev } from '../common/index.js';
import { SITE_SRC_DIR, THEME_DIR } from '../common/constants.js';
import genSiteMobileShared from '../compiler/gen-site-mobile-shared.js';
import genSiteDesktopShared from '../compiler/gen-site-desktop-shared.js';

function markdownHighlight(str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    // https://github.com/highlightjs/highlight.js/issues/2277
    return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
  }

  return '';
}

function getSiteConfig(config) {
  const siteConfig = config.site;

  if (siteConfig?.locales) {
    return siteConfig.locales[siteConfig?.defaultLang || 'en-US'];
  }

  return siteConfig;
}

function resolveAlias() {
  return [
    {
      find: /^@vdmin\/docs\/theme$/,
      replacement: join(THEME_DIR, 'index')
    },
  ];
}


function getTitle(config) {
  let title = config?.title;

  if (config?.description) {
    title += ` - ${config.description}`;
  }

  return title;
}

function getHTMLMeta(config) {
  const meta = config.site?.htmlMeta;

  if (meta) {
    return Object.keys(meta)
      .map((key) => `<meta name="${key}" content="${meta[key]}">`)
      .join('\n');
  }

  return '';
}

// add target="_blank" to all links
function markdownLinkOpen(md) {
  const defaultRender = md.renderer.rules.link_open;

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const aIndex = tokens[idx].attrIndex('target');

    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank']); // add new attribute
    }

    if (defaultRender) {
      return defaultRender(tokens, idx, options, env, self);
    }

    return self.renderToken(tokens, idx, options);
  };
}

function markdownCardWrapper(htmlCode) {
  const group = htmlCode
    .replace(/<h3/g, ':::<h3')
    .replace(/<h2/g, ':::<h2')
    .split(':::');

  return group
    .map((fragment) => {
      if (fragment.indexOf('<h3') !== -1) {
        return `<div class="vdmin-doc-card">${fragment}</div>`;
      }

      return fragment;
    })
    .join('');
}

function vitePluginGenVdminBaseCode() {
  const virtualMobileModuleId = 'site-mobile-shared';
  const resolvedMobileVirtualModuleId = `vdmin-cli:${virtualMobileModuleId}`;

  const virtualDesktopModuleId = 'site-desktop-shared';
  const resolvedDesktopVirtualModuleId = `vdmin-cli:${virtualDesktopModuleId}`;

  return {
    name: 'vite-plugin(vdmin-cli):gen-site-base-code',
    resolveId(id) {
      if (id === virtualMobileModuleId) {
        return resolvedMobileVirtualModuleId;
      }

      if (id === virtualDesktopModuleId) {
        return resolvedDesktopVirtualModuleId;
      }
    },
    load(id) {
      switch (id) {
        case resolvedMobileVirtualModuleId:
          return genSiteMobileShared();
        case resolvedDesktopVirtualModuleId:
          return genSiteDesktopShared();
        default:
          break;
      }
    },
  };
}

export function getViteConfigForSiteDev() {
  setBuildTarget('site');

  const vdminConfig = getVdminConfig();
  const siteConfig = getSiteConfig(vdminConfig);
  const title = getTitle(siteConfig);
  const enableVConsole = isDev() && vdminConfig.site?.enableVConsole;

  return {
    root: SITE_SRC_DIR,

    resolve: {
      alias: resolveAlias(),
    },

    plugins: [
      vitePluginGenVdminBaseCode(),
      vitePluginVue({
        include: [/\.vue$/, /\.md$/],
      }),
      vitePluginMd({
        wrapperClasses: 'vdmin-doc-markdown-body',
        transforms: {
          after: markdownCardWrapper,
        },
        markdownItOptions: {
          typographer: false, // https://markdown-it.github.io/markdown-it/#MarkdownIt
          highlight: markdownHighlight,
        },
        markdownItSetup(md) {
          const require = createRequire(import.meta.url);
          const { slugify } = require('transliteration');
          const markdownItAnchor = require('markdown-it-anchor');

          markdownLinkOpen(md);

          md.use(markdownItAnchor, {
            level: 2,
            slugify,
          });
        },
      }),
      vitePluginJsx(),
      injectHtml({
        data: {
          ...siteConfig,
          title,
          // `description` is used by the HTML ejs template,
          // so it needs to be written explicitly here to avoid error: description is not defined
          description: siteConfig?.description,
          enableVConsole,
          meta: getHTMLMeta(vdminConfig),
        },
      }),
    ],

    server: {
      host: '0.0.0.0',
    },
  };
}
