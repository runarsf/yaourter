import { Logger } from '@utils/logger';

module.exports = {
  name: 'ready',
  once: true,
  execute(client: any) {
    const guilds = client.guilds.cache.map((guild: any) => guild.name);
    Logger.info(`Ready! Logged in as ${client.user.tag}`);
    Logger.info(`Bot is currently in ${guilds.length} guild(s):`);
    Logger.info(guilds.map((guild: any) => ` - ${guild}`).join('\n'));
    client.user.setPresence({
      activities: [{
        name: 'yoghurt',
        type: 'COMPETING'
      }],
      status: 'online'
    });
  },
};
