import axios from "axios";

// 2.0 We installed the "axios" library to make it easier to communicate with a server and to provide more advanced options. We'll use its method "create" to define basic settings as an object and first property there shall be the base URL to server "baseURL", so we don't need to retype it everywhere. We'll be just importing axios from this file to other components.
// (Go to [src/Register.js])
export default axios.create({
  baseURL: "http://localhost:3500",
});