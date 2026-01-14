import { create } from 'zustand'

export const useStore = create((set, get) => ({
  headerData: undefined,
  setHeaderData: (headerData) => set({ headerData }),
  footerData: undefined,
  setFooterData: (footerData) => set({ footerData }),
  navIsOpen: false,
  setNavIsOpen: (toggle) => set({ navIsOpen: toggle, overflow: !toggle }),
  lenis: undefined,
  setLenis: (lenis) => set({ lenis }),
  overflow: true,
  setOverflow: (overflow) => set({ overflow }),
  thresholds: {},
  addThreshold: ({ id, value }) => {
    const thresholds = { ...get().thresholds }
    thresholds[id] = value

    set({ thresholds })
  },
  // removeThreshold: (threshold) => {
  //   set({ threshold })
  // },
  introOut: false,
  setIntroOut: (introOut) => set({ introOut }),
}))
