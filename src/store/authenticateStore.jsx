import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import pipe from 'ramda/es/pipe'

const authenticateState = {
  authenticate: false,
  isAuthenticating: false,
  isAdmin: false,
  user: {},
}

const authenicateMutation = (set) => ({
  changeAuthenticateStatus: ({ authenticate, user, isAdmin, isAuthenticating }) =>
    set((state) => ({
      authenticate: authenticate || false,
      user: user || {},
      isAdmin: isAdmin || false,
      isAuthenticating: isAuthenticating || true,
    })),
})

const store = (set) => ({
  ...authenticateState,
  ...authenicateMutation(set),
})

const createStore = pipe(persist, devtools, create)

const useAuthorizationStore = createStore(store, {
  name: 'useAuthorizationStore',
  store: 'useAuthorizationStore',
  enabled: process.env.NODE_ENV === 'development',
  // ...
  partialize: (state) => ({ authenticate: state.authenticate}),
  onRehydrateStorage: (state) => {
    // optional
    return (state, error) => {
      // console.log('hydration starts', state)
      // if (error) {
      //   console.log('an error happened during hydration', error)
      // } else {
      //   console.log('hydration finished')
      // }
    }
  },
})

export { useAuthorizationStore }
