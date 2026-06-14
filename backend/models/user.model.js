import mongoose from "mongoose";

// Schema utente: credenziali e lista degli ID dei film preferiti
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  favoriteMovies: { type: [Number], default: [] },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
