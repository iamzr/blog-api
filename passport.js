const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// For signup
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      try {
        const date = new Date();
        const user = await User.create({
          email,
          password,
          last_modified: date,
          date_created: date,
          registered: true,
        });

        return cb(null, user);
      } catch (error) {
        cb(error);
      }
    }
  )
);

// For login
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      return User.findOne({ email })
        .then((user) => {
          if (!user) {
            return cb(null, false, { message: "User not found" });
          }

          const validate = user.isValidPassword(password);

          if (!validate) {
            return cb(null, false, { message: "Wrong password" });
          }

          return cb(null, user, { message: "Logged in successfully" });
        })
        .catch((err) => cb(err));
    }
  )
);

// For verifying tokens
passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    function (jwtPayload, cb) {
      console.log(jwtPayload);
      return User.findById(jwtPayload.user._id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
    // async (token, done) => {
    //   try {
    //     return done(null, token.user);
    //   } catch (error) {
    //     done(error);
    //   }
    // }
  )
);
