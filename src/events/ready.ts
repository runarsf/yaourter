import { Logger } from '../utils/logger';

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    const guilds = client.guilds.cache.map(guild => guild.name);
    Logger.log(`Ready! Logged in as ${client.user.tag}`);
    Logger.log(`Bot is currently in ${guilds.length} guild(s):`);
    Logger.log(guilds.map(guild => ' - ' + guild).join('\n'));
    client.user.setPresence({
      activities: [{
        name: 'yoghurt',
        type: 'COMPETING'
      }],
      status: 'online'
    });
  },
};