import { LanguageKeys } from '#lib/i18n';
import { DecoratorIdentifiers } from '@sapphire/decorators';
import { Identifiers } from '@sapphire/framework';

export function translate(identifier: string) {
	switch (identifier) {
		case Identifiers.ArgumentBooleanError:
		case Identifiers.ArgumentChannelError:
		case Identifiers.ArgumentDateError:
		case Identifiers.ArgumentDateTooEarly:
		case Identifiers.ArgumentDateTooFar:
		case Identifiers.ArgumentDMChannelError:
		case Identifiers.ArgumentFloatError:
		case Identifiers.ArgumentFloatTooLarge:
		case Identifiers.ArgumentFloatTooSmall:
		case Identifiers.ArgumentGuildCategoryChannelError:
		case Identifiers.ArgumentGuildChannelError:
		case Identifiers.ArgumentGuildChannelMissingGuildError:
		case Identifiers.ArgumentGuildNewsChannelError:
		case Identifiers.ArgumentGuildNewsThreadChannelError:
		case Identifiers.ArgumentGuildPrivateThreadChannelError:
		case Identifiers.ArgumentGuildPublicThreadChannelError:
		case Identifiers.ArgumentGuildStageVoiceChannelError:
		case Identifiers.ArgumentGuildTextChannelError:
		case Identifiers.ArgumentGuildThreadChannelError:
		case Identifiers.ArgumentGuildVoiceChannelError:
		case Identifiers.ArgumentHyperlinkError:
		case Identifiers.ArgumentIntegerError:
		case Identifiers.ArgumentIntegerTooLarge:
		case Identifiers.ArgumentIntegerTooSmall:
		case Identifiers.ArgumentMemberError:
		case Identifiers.ArgumentMemberMissingGuild:
		case Identifiers.ArgumentMessageError:
		case Identifiers.ArgumentNumberError:
		case Identifiers.ArgumentNumberTooLarge:
		case Identifiers.ArgumentNumberTooSmall:
		case Identifiers.ArgumentRoleError:
		case Identifiers.ArgumentRoleMissingGuild:
		case Identifiers.ArgumentStringTooLong:
		case Identifiers.ArgumentStringTooShort:
		case Identifiers.ArgumentUserError:
			return `arguments:${identifier}`;
		case Identifiers.ArgsUnavailable:
			return 'arguments:unavailable';
		case Identifiers.ArgsMissing:
			return 'arguments:missing';
		case Identifiers.CommandDisabled:
			return 'precondition:disabled';
		case Identifiers.PreconditionCooldown:
			return LanguageKeys.Precondition.CommandCooldown;
		case Identifiers.PreconditionDMOnly:
			return 'precondition:dmOnly';
		case Identifiers.PreconditionGuildNewsOnly:
			return 'precondition:guildNewsOnly';
		case Identifiers.PreconditionGuildNewsThreadOnly:
			return 'precondition:guildNewsThreadOnly';
		case Identifiers.PreconditionGuildOnly:
		case DecoratorIdentifiers.RequiresClientPermissionsGuildOnly:
		case DecoratorIdentifiers.RequiresUserPermissionsGuildOnly:
			return 'precondition:guildOnly';
		case Identifiers.PreconditionGuildPrivateThreadOnly:
			return 'precondition:guildPrivateThreadOnly';
		case Identifiers.PreconditionGuildPublicThreadOnly:
			return 'precondition:guildPublicThreadOnly';
		case Identifiers.PreconditionGuildTextOnly:
			return 'precondition:guildTextOnly';
		case Identifiers.PreconditionNSFW:
			return 'precondition:nsfw';
		case Identifiers.PreconditionClientPermissions:
		case DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions:
			return 'precondition:clientPermissions';
		case Identifiers.PreconditionUserPermissions:
		case DecoratorIdentifiers.RequiresUserPermissionsMissingPermissions:
			return 'precondition:userPermissions';
		case Identifiers.PreconditionThreadOnly:
			return 'precondition:threadOnly';
		default:
			return identifier;
	}
}
