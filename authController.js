import * as userService from "./userService.js";
import * as sessionService from "./sessionService.js";
import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

// Show Login Form
const showLoginForm = (c) => {
  return c.html(eta.render("login.eta"));
};

// Show Registration Form
const showRegistrationForm = (c) => {
  return c.html(eta.render("registration.eta"));
};

// Login User Function
const loginUser = async (c) => {
  const { email, password } = await c.req.parseBody();
  const user = await userService.validateUser(email, password); // Adjust this according to your user service logic

  if (user) {
    await sessionService.createSession(c, user); // Assuming this creates a session and sets a cookie
    return c.redirect("/");
  } else {
    return c.html("Invalid credentials"); // Handle invalid login
  }
};

// Register User Function
const registerUser = async (c) => {
  const { email, password } = await c.req.parseBody();
  const existingUser = await userService.findUserByEmail(email);

  if (existingUser) {
    return c.status(400).send("User already exists");
  }

  userService.createUser({ email, password });
  const user = await userService.validateUser(email, password);
  await sessionService.createSession(c, user);
  return c.redirect("/");
};

// Logout User Function
const logoutUser = async (c) => {
  await sessionService.deleteSession(c);
  return c.redirect("/");
};

export {
  loginUser,
  logoutUser,
  registerUser,
  showLoginForm,
  showRegistrationForm,
};
