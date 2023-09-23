import { SliderType, StoreContent } from "types/global"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface BearState {
  storeContent?: StoreContent
  setStoreContent: (e: StoreContent) => void
  detectSabahSarawak: boolean
  setDetectSabahSarawak: (e: boolean) => void
}

export const useAppStore = create<BearState>()((set) => ({
  storeContent: undefined,
  setStoreContent: (storeContent) => set({ storeContent }),
  detectSabahSarawak: false,
  setDetectSabahSarawak: (detectSabahSarawak) => set({ detectSabahSarawak }),
}))
