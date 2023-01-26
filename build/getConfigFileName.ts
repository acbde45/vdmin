/**
 * Get the configuration file variable name
 * @param env
 */
export const getConfigFileName = (env: Record<string, any>) => {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || 'APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '');
};
