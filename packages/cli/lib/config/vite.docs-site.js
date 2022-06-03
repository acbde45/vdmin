import { createRequire } from 'module';
import vitePluginMd from 'vite-plugin-md';
import vitePluginVue from '@vitejs/plugin-vue';
import vitePluginJsx from '@vitejs/plugin-vue-jsx';
import { injectHtml } from 'vite-plugin-html';
import hljs from 'highlight.js';
import { SITE_SRC_DIR } from '../common/constants.js';
import genSiteMobileShared from '../compiler/gen-docs-site-mobile-shared.js';
import genSiteDesktopShared from '../compiler/gen-docs-site-desktop-shared.js';

function markdownHighlight(str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    // https://github.com/highlightjs/highlight.js/issues/2277
    return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
  }

  return '';
}

function getSiteConfig(config) {
  const siteConfig = config?.site || {};

  // TODO i18n
  if (siteConfig?.locales) {
    return siteConfig.locales[siteConfig?.defaultLang || 'en-US'];
  }

  return siteConfig;
}

function resolveAlias(context) {
  return [
    {
      find: /^@vdmin\/docs\/theme$/,
      replacement: context.docsThemeDir
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
  const meta = config?.htmlMeta;

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

function vitePluginGenVdminBaseCode(context) {
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
          return genSiteMobileShared(context);
        case resolvedDesktopVirtualModuleId:
          return genSiteDesktopShared(context);
        default:
          break;
      }
    }
  };
}

export function getViteConfigForDocsSiteDev(context) {
  const config = context.config;
  const siteConfig = getSiteConfig(config);
  const title = getTitle(siteConfig);
  const enableVConsole = context.isDev() && siteConfig?.enableVConsole;

  const viteConfig = {
    root: SITE_SRC_DIR,

    resolve: {
      alias: resolveAlias(context),
    },

    plugins: [
      vitePluginGenVdminBaseCode(context),
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
          meta: getHTMLMeta(siteConfig),
        },
      }),
    ],

    server: {
      host: '0.0.0.0',
    },
  };

  return context.mergeCustomViteConfig(viteConfig);
}
