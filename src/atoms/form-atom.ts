import { atom } from "recoil";

export const formAtom = atom<{
  address: string | undefined;
  name: string | undefined;
  contact: string | undefined;
}>({
  key: "form",
  default: {
    address: undefined,
    name: undefined,
    contact: undefined,
  },
});
