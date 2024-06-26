import { token } from "../variables.js";
import { parseJwt } from "../utils/parseJWT.js";

let parsedToken = parseJwt(token);
let user = document.querySelector(".user");
user.textContent = parsedToken.name;
