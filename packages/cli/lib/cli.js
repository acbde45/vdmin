const { Command } = require('commander');

const {
  docsDev
} = require('./index');

const program = new Command();

program
  .command('docs')
  .description('Open the project document')
  .action(docsDev);

program.parse();
