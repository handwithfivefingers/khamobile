import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const initState = {
  message: '',
  status: false,
  type: '',
}
const useMessageStore = create(
  devtools((set) => ({
    ...initState,
    pushMessage: ({ message, type, status }) =>
      set(() => {
        return { message, type, status }
      }),
    clearState: () => set(() => ({ ...initState })),
  })),
)

export { useMessageStore }

