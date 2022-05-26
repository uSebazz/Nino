import { Listener, type Events, type UserError } from '@sapphire/framework'

export class chatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
  public override run(error: UserError) {
    console.log(error)
  }
}
