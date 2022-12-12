import create from 'zustand'

const useAuthorizationStore = create((set) => ({
  authenticate: false,
  user: {},
  changeAuthenticateStatus: ({ authenticate, user }) => set((state) => ({ authenticate, user })),
}))

export { useAuthorizationStore }
