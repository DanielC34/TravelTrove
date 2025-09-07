import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (user) {
          // User exists, add google provider if not already present
          if (!user.providers.includes("google")) {
            user.providers.push("google");
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = new User({
          email: profile.emails?.[0]?.value || "",
          name: profile.displayName || "",
          passwordHash: "google-oauth", // Placeholder for OAuth users
          providers: ["google"],
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport;