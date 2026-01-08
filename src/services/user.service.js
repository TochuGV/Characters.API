import logger from "../logger/index.js";
import { getHashedPassword } from "../utils/user.utils.js";

export default class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  };

  async getByEmail(email){
    logger.debug(`Service: Fetching user by email: ${email}`);
    return await this.userRepository.getByEmail(email);
  };

  async create(data){
    logger.debug("Service: Hashing password and persisting new user");
    const hashedPassword = await getHashedPassword(data.password);
    const userData = {
      ...data,
      password: hashedPassword
    };
    return await this.userRepository.create(userData);
  };
};