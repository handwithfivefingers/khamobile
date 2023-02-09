import { create } from 'zustand'

const useLoaderStore = create((set) => ({
  loading: false,
  setLoading: (status) => set(() => ({ loading: status })),
}))

export { useLoaderStore }
