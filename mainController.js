import * as sessionService from "./sessionService.js";
import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showMain = async (c) => {
  const user = await sessionService.getUserFromSession(c); // Retrieve user from session
  return c.html(
    eta.render("main.eta", { user: user }),
  ); // Pass user to the template
};

export { showMain };
