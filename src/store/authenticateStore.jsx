import create from 'zustand'

const useAuthorizationStore = create((set) => ({
  authenticate: false,
  isAdmin: false,
  user: {},
  changeAuthenticateStatus: ({ authenticate, user, isAdmin }) => set((state) => ({ authenticate, user, isAdmin })),
}))

export { useAuthorizationStore }
