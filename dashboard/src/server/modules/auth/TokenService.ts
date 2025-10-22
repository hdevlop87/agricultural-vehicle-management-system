import { t } from 'najm-api';
import { getCookie, Injectable } from 'najm-api';
import jwt from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode';
import { UserRepository, UserValidator } from '../users';
import timestring from 'timestring';

@Injectable()
export class TokenService {

  private accessSecretKey = process.env.JWT_ACCESS_SECRET;
  private accessExpiresIn = process.env.ACCESS_EXPIRES_IN;
  private refreshSecretKey = process.env.JWT_REFRESH_SECRET;
  private refreshExpiresIn = process.env.REFRESH_EXPIRES_IN;

  constructor(
    private userValidator: UserValidator,
    private userRepository: UserRepository
  ) { }

  //==== Validate tokens

  extractAccessToken(authorization) {
    if (authorization && authorization.startsWith('Bearer')) {
      return authorization.split(' ')[1]
    }
    throw new Error(t('auth.errors.tokenMissing'))
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessSecretKey)
    } catch (error) {
      throw new Error(t('auth.errors.tokenVerificationFailed'))
    }
  }

  verifyRefreshToken(token) {
    try {
      const {userId} = jwt.verify(token, this.refreshSecretKey)
      return userId
    } catch (error) {
      throw new Error(t('auth.errors.tokenVerificationFailed'))
    }
  }

  async getUserIdByAccessToken(header) {
    const token = this.extractAccessToken(header);
    const decodedToken = this.verifyAccessToken(token);
    const userId = decodedToken.userId;
    const isUserExist = await this.userValidator.isUserExist(userId);

    if (!isUserExist) {
      throw new Error(t('users.errors.notFound'))
    }

    return userId;
  }

  //=== Generate tokens

  async storeRefreshToken(userId, refreshToken) {
    const expireInSecond = timestring(this.refreshExpiresIn, 's');
    const tokenData = {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + expireInSecond * 1000).toISOString()
    }
    await this.userRepository.storeRefreshToken(tokenData);
  }

  getTokenExpire(token) {
    return jwtDecode(token).exp
  }

  generateAccessToken(data) {
    return jwt.sign(data, this.accessSecretKey, { expiresIn: this.accessExpiresIn })
  }

  generateRefreshToken(data) {
    return jwt.sign(data, this.refreshSecretKey, { expiresIn: this.refreshExpiresIn })
  }

  async generateTokens(userId) {
    const tokenData = { userId }
    const accessToken = await this.generateAccessToken(tokenData);
    const refreshToken = await this.generateRefreshToken(tokenData);
    const accessTokenExpiresAt = this.getTokenExpire(accessToken);
    const refreshTokenExpiresAt = this.getTokenExpire(refreshToken);
    await this.storeRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    }
  }

  async refreshTokens(){
    const newRefreshToken = getCookie('refreshToken');
    const userId = await this.verifyRefreshToken(newRefreshToken);
    await this.userValidator.checkUserExists(userId);
    const storedRefreshToken = await this.userRepository.getRefreshToken(userId)

    if(newRefreshToken!= storedRefreshToken){
      throw new Error(t('auth.errors.refreshTokenInvalid'))
    }
    return await this.generateTokens(userId)
  }

}
