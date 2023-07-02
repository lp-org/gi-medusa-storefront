import { StoreContent } from "types/global"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type SliderType = {
  image: string
  url?: string
  is_active: boolean
  open_new: boolean
}
interface BearState {
  storeContent?: StoreContent
  setStoreContent: (e: StoreContent) => void
  slider: SliderType[]
  setSlider: (e: SliderType[] | undefined) => void
}

export const useAppStore = create<BearState>()((set) => ({
  storeContent: undefined,
  setStoreContent: (storeContent) => set({ storeContent }),
  slider: [],
  setSlider: (slider) => set({ slider }),
}))
