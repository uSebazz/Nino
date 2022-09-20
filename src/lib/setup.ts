import '@kaname-png/plugin-subcommands-advanced/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';
import * as colorette from 'colorette';
import { inspect } from 'node:util';

// Set default inspection depth
inspect.defaultOptions.depth = 1;

colorette.createColors({ useColor: true });
