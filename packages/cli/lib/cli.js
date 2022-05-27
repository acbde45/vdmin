import { Command } from 'commander';

import {
  docsDev
} from './index.js';

const program = new Command();

program
  .command('docs')
  .description('Open the project document')
  .action(docsDev);

program.parse();
