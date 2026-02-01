import { create } from "zustand";

interface AuthModalStore {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;

  openLogin: () => void;
  openRegister: () => void;

  closeLogin: () => void;
  closeRegister: () => void;

  closeAll: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isLoginOpen: false,
  isRegisterOpen: false,

  openLogin: () =>
    set({
      isLoginOpen: true,
      isRegisterOpen: false,
    }),

  closeLogin: () =>
    set({
      isLoginOpen: false,
    }),

  openRegister: () =>
    set({
      isLoginOpen: false,
      isRegisterOpen: true,
    }),

  closeRegister: () =>
    set({
      isRegisterOpen: false,
    }),

  closeAll: () =>
    set({
      isRegisterOpen: false,
      isLoginOpen: false,
    }),
}));
