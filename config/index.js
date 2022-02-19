const dev = process.env.NODE_ENV !== "production";

export const endpoint = dev
  ? "http://localhost:3000/api"
  : "http://localhost:3000/api"; // TODO Deploy then change this
