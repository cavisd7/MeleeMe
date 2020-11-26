import { UserService } from './UserService';
import { ChatService } from '../chat/ChatService';
//import { userRepository } from '../../domain/repository/user/index';

const userService = new UserService();
const chatService = new ChatService();

export { userService, chatService };