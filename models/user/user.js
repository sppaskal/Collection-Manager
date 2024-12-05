import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const User = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// -------------------------------------------------------------

// Pre-save hook to hash the password before saving it
User.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// -------------------------------------------------------------

// Method to compare password for authentication
User.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

// -------------------------------------------------------------

export default mongoose.model('user', User)
