import mongoose from "mongoose";

/*
  An interface that describe the properties
  that are requerid to create a new User.
*/

interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An describe the properties
 * that a user Model has.
 */

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

/**
 * At interface that describe the properties
 * that a User Document has.
 */

interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
