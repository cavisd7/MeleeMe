import { CurrentMatchesController } from './CurrentMatchesController';
import { CurrentMatchesControllerLogic } from './CurrentMatchesControllerLogic';
import config from '../../../../infra/config/index';
//import RedisClient from '../../../../infra/store/RedisClient';
import Redis from 'ioredis';

//TODO: better solution
const store = new Redis(config.redisPort, config.redisHost);
const currentMatchesLogic = new CurrentMatchesControllerLogic(store);
const currentMatchesController = new CurrentMatchesController(currentMatchesLogic);

export { currentMatchesController };