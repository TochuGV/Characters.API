import { getHashedPassword } from "../utils/user.utils.js";

export default class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  };

  async getByEmail(email){
    console.log("This is a function on the service");
    return await this.userRepository.getByEmail(email);
  };

  async create(email, password){
    console.log("This is a function on the service");
    const hashedPassword = getHashedPassword(password);
    return await this.userRepository.create(email, hashedPassword);
  };
};