process.env.NODE_ENV ??= 'development';

// import '@kaname-png/plugin-statcord/register';
import { rootFolder } from '#utils/constants';
import '@kaname-png/plugin-subcommands-advanced/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';
import { setup } from '@skyra/env-utilities';
import * as colorette from 'colorette';
import { join } from 'node:path';
import { inspect } from 'node:util';

setup(join(rootFolder, 'src', '.env'));

// Set default inspection depth
inspect.defaultOptions.depth = 1;

colorette.createColors({ useColor: true });
