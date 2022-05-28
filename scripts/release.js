const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const chalk = require('chalk');
const semver = require('semver');
const { prompt } = require('enquirer');
const execa = require('execa');
const globby = require('globby');

const versionIncrements = ['patch', 'minor', 'major'];

const inc = (i, c) => semver.inc(c, i);
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });
const step = (msg) => console.log(chalk.cyan(msg));

async function release(cwd, currentVersion) {
  let targetVersion;

  const { releaseType } = await prompt({
    type: 'select',
    name: 'releaseType',
    message: 'Select release type',
    choices: versionIncrements.map((i) => `${i} (${inc(i, currentVersion)})`).concat(['custom'])
  });

  if (releaseType === 'custom') {
    targetVersion = (
      await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion
      })
    ).version;
  } else {
    targetVersion = releaseType.match(/\((.*)\)/)[1];
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`);
  }

  const { yes: tagOk } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  });

  if (!tagOk) {
    return;
  }

  // Update the package version.
  step('\nUpdating the package version...');
  updatePackage(cwd, targetVersion);

  // Commit changes to the Git and create a tag.
  step('\nCommitting changes...');
  await run('git', ['commit', '-am', `release: v${targetVersion}`]);
  await run('git', ['tag', `v${targetVersion}`]);

  // Publish the package.
  step('\nPublishing the package...');
  await run('pnpm', ['publish', '--ignore-scripts', '--no-git-checks', '--access=public'], { cwd });

  // Push to GitHub.
  step('\nPushing to GitHub...');
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await run('git', ['push']);
}

function updatePackage(cwd, version) {
  const pkgPath = path.resolve(cwd, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  pkg.version = version;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

async function main() {
  const packagesDir = path.join(__dirname, '../packages');
  const files = await globby('*/package.json', { cwd: packagesDir });
  const packages = [];
  
  files.forEach(filePath => {
    filePath = path.join(packagesDir, filePath);
    const pkg = require(filePath);
    packages.push({
      name: pkg.name,
      version: pkg.version,
      cwd: path.dirname(filePath),
    });
  });

  let { package } = await prompt({
    type: 'select',
    name: 'package',
    message: 'Select which package',
    choices: packages.map(p => p.name) 
  });

  package = packages.find(p => p.name === package);
  release(package.cwd, package.version);
}

main().catch((err) => console.error(err))
