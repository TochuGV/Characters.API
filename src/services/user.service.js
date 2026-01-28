import logger from "../logger/index.js";
import { getHashedPassword, comparePasswords } from "../utils/user.utils.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, decodeToken, createSessionPayload } from "../utils/token.utils.js";
import tryCatch from "../utils/try-catch.js";
import ErrorFactory from "../errors/error-factory.js";

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
    const newUser = await this.userRepository.create(userData);
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };
  };

  async #createTokensAndSession(user) {
    logger.debug(`Service: Creating tokens and session for user: ${user.id}`);
    const accessToken = generateAccessToken(user);
    const { token: refreshToken, tokenId } = generateRefreshToken(user);
    await this.userRepository.createUserSession(
      createSessionPayload(user.id, refreshToken, tokenId)
    );
    return { accessToken, refreshToken };
  };

  async generateUserSession(user) {
    logger.debug(`Service: Generating session for user: ${user.email}`);
    await this.userRepository.deleteExpiredSessions(user.id).catch(() => {});
    const { accessToken, refreshToken } = await this.#createTokensAndSession(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async login(email, password) {
    logger.debug(`Service: Login attempt for ${email}`);
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw ErrorFactory.unauthorized("Invalid credentials");
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) throw ErrorFactory.unauthorized("Invalid credentials");
    return await this.generateUserSession(user);
  };

  async logout(refreshToken) {
    logger.debug("Service: Revoking user session");
    if (!refreshToken) return;
    const decoded = decodeToken(refreshToken);
    if (decoded?.tokenId) await this.userRepository.updateUserSession(
      decoded.tokenId, { revoked: true }
    ).catch(() => {});
  };

  async refresh(refreshToken) {
    logger.debug("Service: Rotating user session tokens");
    if (!refreshToken) throw ErrorFactory.unauthorized("No refresh token provided");
    const validateToken = tryCatch(verifyRefreshToken, () => {
      throw ErrorFactory.forbidden("Invalid or expired refresh token");
    });
    const decoded = await validateToken(refreshToken);
    const session = await this.userRepository.findUserSessionById(decoded.tokenId);
    if (!session || session.revoked) {
      if (session) await this.userRepository.revokeAllUserSessions(session.userId);
      throw ErrorFactory.forbidden("Invalid session or token reuse detected");
    };
    await this.userRepository.updateUserSession(session.id, { revoked: true });
    const { accessToken, refreshToken: newRefreshToken } = await this.#createTokensAndSession(session.user);
    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  };
};