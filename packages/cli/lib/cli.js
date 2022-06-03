import { Command } from 'commander';

import {
  docsDev
} from './index.js';

const program = new Command();

program
  .command('dev')
  .description('Start a server for development')
  .option('--docs')
  .option('-c, --config [config]', 'Custom config file')
  .action((options) => {
    const { docs, config } = options;
    if (docs) {
      docsDev({ configPath: config, cliOptions: options });
    }
  });

program.parse();
