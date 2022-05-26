import {
  Listener,
  type Events,
  type UserError
} from '@sapphire/framework'

export class UserListener extends Listener<typeof Events.MessageCommandDenied> {
  public override run(error: UserError) {
    console.log(error.identifier)
  }
}
