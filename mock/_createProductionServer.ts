import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
import { MockMethod } from 'vite-plugin-mock';

const modules = import.meta.glob<{ default: MockMethod[] }>('./**/*.ts', { eager: true });

console.log(modules);

const mockModules: any[] = [];
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }
  mockModules.push(...modules[key].default);
});

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
