import create from 'zustand'

const useAuthorizationStore = create((set) => ({
  authenticate: false,
  isAdmin: false,
  user: {},
  changeAuthenticateStatus: ({ authenticate, user, isAdmin }) =>
    set((state) => ({ authenticate: authenticate || false, user: user || {}, isAdmin: isAdmin || false })),
}))

export { useAuthorizationStore }
