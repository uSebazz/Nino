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
			return LanguageKeys.Precondition.CommandDmOnly;
		case Identifiers.PreconditionGuildNewsOnly:
			return LanguageKeys.Precondition.CommandGuildNewsOnly;
		case Identifiers.PreconditionGuildNewsThreadOnly:
			return LanguageKeys.Precondition.CommandGuildNewsThread;
		case Identifiers.PreconditionGuildOnly:
		case DecoratorIdentifiers.RequiresClientPermissionsGuildOnly:
		case DecoratorIdentifiers.RequiresUserPermissionsGuildOnly:
			return LanguageKeys.Precondition.CommandGuildOnly;
		case Identifiers.PreconditionGuildPrivateThreadOnly:
			return LanguageKeys.Precondition.CommandGuildPrivateThreadOnly;
		case Identifiers.PreconditionGuildPublicThreadOnly:
			return LanguageKeys.Precondition.CommandGuildPublicThreadOnly;
		case Identifiers.PreconditionGuildTextOnly:
			return LanguageKeys.Precondition.CommandGuildTextOnly;
		case Identifiers.PreconditionNSFW:
			return LanguageKeys.Precondition.CommandNSFW;
		case Identifiers.PreconditionClientPermissions:
		case DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions:
			return LanguageKeys.Precondition.RequireClientPermissions;
		case Identifiers.PreconditionUserPermissions:
		case DecoratorIdentifiers.RequiresUserPermissionsMissingPermissions:
			return LanguageKeys.Precondition.RequireUserPermissions;
		case Identifiers.PreconditionThreadOnly:
			return LanguageKeys.Precondition.CommandThreadOnly;
		default:
			return identifier;
	}
}
