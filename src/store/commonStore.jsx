import create from 'zustand';

const useCommonStore = create((set) => ({
	title: '',
	changeTitle: (title) => set((state) => ({ title })),
}));

export { useCommonStore };
