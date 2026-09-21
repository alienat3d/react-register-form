import axios from "axios";

const BASE_URL = "http://localhost:3500";

// 2.0 We installed the "axios" library to make it easier to communicate with a server and to provide more advanced options. We'll use its method "create" to define basic settings as an object and first property there shall be the base URL to server "baseURL", so we don't need to retype it everywhere. We'll be just importing axios from this file to other components.
// (Go to [src/Register.js])
export default axios.create({
  baseURL: BASE_URL,
});

// ? 5.5.0 In this file we'll create another function to export and this will be "axiosPrivate". And we're going to attach here something called "interceptors" that will attach JWT tokens for us and even retry if we get failure first time. That failure will come back with a status of a 403 ("forbidden"). So the interceptors will work with JWT-tokens to refresh the token if the initial request is denied due to an expired token. This all will work in a background and won't impact a user inside the app, a user won't see it's happening, yet keeps everything secure and will continue to refresh those tokens on a set schedule.
// 5.5.1 Now, we can add a couple of extra values here like "headers" & "withCredentials" settings.
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {"Content-Type": "application/json"},
  withCredentials: true,
});