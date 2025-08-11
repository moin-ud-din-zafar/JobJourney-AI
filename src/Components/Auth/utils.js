// src/components/Auth/utils.js
// For now this is a placeholder for actual  logic later

export const fakeAuth = {
  login: (email, password) => Promise.resolve(true),
  signup: (email, password) => Promise.resolve(true),
  logout: () => Promise.resolve(true),
}
