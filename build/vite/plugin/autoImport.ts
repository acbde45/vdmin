import type { Plugin } from 'vite';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import AutoImport from 'unplugin-auto-import/vite';
import AutoImportComponents from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export function configAutoImportPlugin(): Plugin | Plugin[] {
  const plugins: Plugin[] = [
    Pages({
      dirs: [{ dir: 'src/views', baseRoute: '' }],
      extensions: ['vue'],
      exclude: ['**/components/*.vue'],
      importMode: 'async',
      resolver: 'vue',
      routeBlockLang: 'yaml',
    }),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'MainLayout/MainLayout',
      extensions: ['vue'],
      importMode: () => 'sync',
      exclude: ['**/!(*Layout).vue'],
    }),
    // auto import APIs
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // global imports to register
      imports: [
        // presets
        'vue',
        'vue-router',
        'pinia',
        // custom
        {
          '@vueuse/core': [
            // named imports
            'useElementSize', // import { useElementSize } from '@vueuse/core',
            'useThrottleFn',
            // alias
            // ["useFetch", "useMyFetch"], // import { useFetch as useMyFetch } from '@vueuse/core',
          ],
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      // Auto import for module exports under directories
      // by default it only scan one level of modules under the directory
      dirs: [
        './hooks',
        './composables', // only root modules
        // './composables/**', // all nested modules
        // ...
      ],
      // Filepath to generate corresponding .d.ts file.
      // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
      // Set `false` to disable.
      dts: './types/auto-imports.d.ts',

      // Auto import inside Vue template
      // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
      vueTemplate: true,

      // Custom resolvers, compatible with `unplugin-vue-components`
      // see https://github.com/antfu/unplugin-auto-import/pull/23/
      resolvers: [],

      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: false, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
    AutoImportComponents({
      // relative paths to the directory to search for components.
      dirs: ['src/components'],

      // valid file extensions for components.
      extensions: ['vue'],
      // search for subdirectories
      deep: true,
      // resolvers for custom components
      resolvers: [NaiveUiResolver()],

      // generate `components.d.ts` global declarations,
      // also accepts a path for custom filename
      // default: `true` if package typescript is installed
      dts: './types/auto-import-components.d.ts',
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],

      // Allow subdirectories as namespace prefix for components.
      directoryAsNamespace: false,
      // Subdirectory paths for ignoring namespace prefixes
      // works when `directoryAsNamespace: true`
      globalNamespaces: [],

      // auto import for directives
      // default: `true` for Vue 3, `false` for Vue 2
      // Babel is needed to do the transformation for Vue 2, it's disabled by default for performance concerns.
      // To install Babel, run: `npm install -D @babel/parser`
      directives: true,

      // Transform path before resolving
      importPathTransform: (v) => v,

      // Allow for components to override other components with the same name
      allowOverrides: false,

      // filters for transforming targets
      include: [/\.vue$/, /\.vue\?vue/],
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],

      // Vue version of project. It will detect automatically if not specified.
      // Acceptable value: 2 | 2.7 | 3
      version: 3,
    }),
  ];

  return plugins;
}
