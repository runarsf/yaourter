import 'module-alias/register';
import {DISCORD_TOKEN} from './config';
import {Yaourter} from './yaourter';

const yaourter = new Yaourter({
  token: DISCORD_TOKEN
});

yaourter.start();
