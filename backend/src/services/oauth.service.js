import { UserModel } from '../models/user.model.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

export const findOrCreateOAuthUser = async (provider, profile) => {
  const { id, email, name, picture } = profile;

  if (!id) {
    throw new Error(`OAuth ${provider}: Missing user ID`);
  }

  // For Apple, email might be missing on subsequent logins
  // Try to find by oauthId first
  let user = await UserModel.findOne({
    oauthProvider: provider,
    oauthId: id
  });

  // If not found by oauthId and email exists, try by email
  if (!user && email) {
    user = await UserModel.findOne({
      email: email.toLowerCase()
    });
    
    // If found by email but no OAuth linked, link it
    if (user && !user.oauthProvider) {
      user.oauthProvider = provider;
      user.oauthId = id;
      if (picture && !user.profile?.avatar) {
        user.profile = user.profile || {};
        user.profile.avatar = picture;
      }
      // Update name if not set
      if (name && (!user.profile?.name || user.profile.name === user.email)) {
        user.profile = user.profile || {};
        user.profile.name = name;
      }
      await user.save();
    }
  }

  // Create new user if not found
  if (!user) {
    // For Apple, if no email, generate a placeholder
    const userEmail = email?.toLowerCase() || `${provider}_${id}@oauth.temp`;
    const userName = name || email?.split('@')[0] || `${provider} User`;
    
    user = await UserModel.create({
      email: userEmail,
      passwordHash: '', // OAuth users don't need password
      oauthProvider: provider,
      oauthId: id,
      role: 'user',
      profile: {
        name: userName,
        avatar: picture || ''
      },
      status: 'active'
    });
  } else {
    // Update profile info if available
    const updates = {};
    if (name && (!user.profile?.name || user.profile.name === user.email)) {
      updates['profile.name'] = name;
    }
    if (picture && !user.profile?.avatar) {
      updates['profile.avatar'] = picture;
    }
    if (email && email !== user.email && !user.email.includes('@oauth.temp')) {
      // Only update email if current email is a temp one
      if (user.email.includes('@oauth.temp')) {
        updates.email = email.toLowerCase();
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await UserModel.updateOne({ _id: user._id }, { $set: updates });
      // Reload user to get updated data
      user = await UserModel.findById(user._id);
    }
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
      name: user.profile?.name || user.email?.split('@')[0] || 'User',
      role: user.role,
      avatar: user.profile?.avatar || ''
    },
    accessToken,
    refreshToken
  };
};

