const vitePluginMd = require('vite-plugin-md').default;
const vitePluginVue = require('@vitejs/plugin-vue');
const vitePluginJsx = require('@vitejs/plugin-vue-jsx');
const { createHtmlPlugin } = require('vite-plugin-html');
const hljs = require('highlight.js');
const { setBuildTarget, getVdminConfig, isDev } = require('../common/index');
const { SITE_SRC_DIR } = require('../common/constants');

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

function getViteConfigForSiteDev() {
  setBuildTarget('site');

  const vdminConfig = getVdminConfig();
  const siteConfig = getSiteConfig(vdminConfig);
  const title = getTitle(siteConfig);
  const enableVConsole = isDev() && vdminConfig.site?.enableVConsole;

  return {
    root: SITE_SRC_DIR,

    plugins: [
      // vitePluginGenVantBaseCode(),
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
      createHtmlPlugin({
        inject: {
          data: {
            ...siteConfig,
            title,
            // `description` is used by the HTML ejs template,
            // so it needs to be written explicitly here to avoid error: description is not defined
            description: siteConfig?.description,
            enableVConsole,
            meta: getHTMLMeta(vdminConfig),
          },
        },
      }),
    ],

    server: {
      host: '0.0.0.0',
    },
  };
}

module.exports = {
  getViteConfigForSiteDev,
};
