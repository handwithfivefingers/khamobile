import create from 'zustand'

const useDevStore = create((set) => ({
  data: '',
  changeData: (data) => set((state) => ({ data })),
}))

export { useDevStore }
