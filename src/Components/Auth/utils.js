// For now this is a placeholder for actual auth logic later

export const fakeAuth = {
  login: (email, password) => Promise.resolve(true),
  signup: (email, password) => Promise.resolve(true),
  logout: () => Promise.resolve(true),
}
