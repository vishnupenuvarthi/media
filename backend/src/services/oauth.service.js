import { UserModel } from '../models/user.model.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

export const findOrCreateOAuthUser = async (provider, profile) => {
  const { id, email, name, picture } = profile;

  // Try to find existing user by oauthId or email
  let user = await UserModel.findOne({
    $or: [
      { oauthProvider: provider, oauthId: id },
      { email: email?.toLowerCase() }
    ]
  });

  if (user) {
    // Update OAuth info if user exists but doesn't have OAuth linked
    if (!user.oauthProvider) {
      user.oauthProvider = provider;
      user.oauthId = id;
      if (picture && !user.profile?.avatar) {
        user.profile = user.profile || {};
        user.profile.avatar = picture;
      }
      await user.save();
    }
  } else {
    // Create new user
    user = await UserModel.create({
      email: email?.toLowerCase(),
      passwordHash: '', // OAuth users don't need password
      oauthProvider: provider,
      oauthId: id,
      role: 'user',
      profile: {
        name: name || email?.split('@')[0] || 'User',
        avatar: picture || ''
      },
      status: 'active'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  user.loginAttempts = 0;
  await user.save();

  // Generate tokens
  const userId = user._id.toString();
  const accessToken = signAccessToken({ userId, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ userId });

  return {
    user: {
      id: userId,
      email: user.email,
      name: user.profile?.name || user.email,
      role: user.role,
      avatar: user.profile?.avatar
    },
    accessToken,
    refreshToken
  };
};

