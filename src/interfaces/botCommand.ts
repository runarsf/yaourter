export interface BotCommand {
  name: string,
  execute(interaction: Promise<any>): Promise<any>
}
