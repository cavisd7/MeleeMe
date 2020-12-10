import { UserService } from './UserService';
import { ChatService } from '../chat/ChatService';

const userService = new UserService();
const chatService = new ChatService();

export { userService, chatService };