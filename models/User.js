import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_I = 10;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 50,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    avatar: String,
    phone: {
      type: String,
    },
    address: {
      type: String,
      minlength: 2,
      maxlength: 100,
    },
    zip: {
      type: String,
      minlength: 2,
      maxlength: 50,
    },
    role: {
      type: [String],
      required: true,
      enum: ['superadmin', 'admin', 'manager', 'moderator', 'user'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['view', 'create', 'edit', 'delete', 'none'],
      default: 'none',
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamp: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, SALT_I);
  }
  next();
});

userSchema.methods.comparePassword = async (candidatePassword) => {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = model('User', userSchema);

export default User;
