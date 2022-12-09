import create from 'zustand'

const useAuthorizationStore = create((set) => ({
  authenticate: false,
  user: {},
  changeAuthenticateStatus: (authenticate) => set((state) => ({ authenticate, user: authenticate.user })),
}))

export { useAuthorizationStore }
