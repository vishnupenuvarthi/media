import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { 
      type: String, 
      unique: true, 
      required: function() { return !this.oauthProvider; },
      lowercase: true,
      trim: true
    },
    passwordHash: { 
      type: String, 
      required: function() { return !this.oauthProvider; }
    },
    oauthProvider: {
      type: String,
      enum: ['google', 'apple', 'microsoft']
      // No default: field will be absent unless set
    },
    oauthId: {
      type: String
      // No default: field will be absent unless set
    },
    role: { 
      type: String, 
      enum: ['owner', 'employer', 'developer', 'user'], 
      default: 'user'
    },
    categories: [{
      type: String,
      enum: ['national', 'business', 'sports', 'entertainment', 'technology', 'politics', 'world', 'lifestyle', 'health', 'education']
    }],
    profile: {
      name: { type: String, required: true, trim: true },
      bio: String,
      avatar: String,
      phone: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'India' }
      }
    },
    status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' },
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date
  },
  { timestamps: true }
);

// Indexes for performance (email already has unique index)
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true, sparse: true });

// Virtual for checking if account is locked
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

export const UserModel = model('User', UserSchema);

