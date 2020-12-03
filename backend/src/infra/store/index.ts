import { Client } from './Client';
import { PubSub as PubSubClient } from './PubSub';

const Store = new Client();
const PubSub = new PubSubClient();

export { Store, PubSub };