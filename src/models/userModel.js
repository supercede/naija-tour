import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: `Role must be one of "user", "guide", "lead-guide" or "admin"`
    }
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      //Only works on create and save
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  passwordLastChanged: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  //Remove passwordConfirm field after save
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.toJSON = function() {
  const user = this;

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.checkLastPasswordChange = function(jwtTimestamp) {
  if (this.passwordLastChanged) {
    const lastPasswordChange = this.passwordLastChanged.getTime() / 1000;

    return jwtTimestamp < lastPasswordChange;
  }
  //false indicates that JWT was issued after last password change and thus is valid
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;
