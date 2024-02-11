import { create } from "zustand";

export type AdminType = {
  fullName: string;
  email: string;
  role: string;
  _id: string;
  // other properties...
};

export type AdminStore = {
  admin: AdminType;
  setAdmin: (admin: AdminType) => void;
};

export const AdminStore = create<AdminStore>((set) => ({
  admin: { fullName: "empty", email: "empty", role: "empty", _id: "empty" }, // Initial state

  //if you want to change the state value with the existing state value you need to mention the state with in the set function
  setAdmin: (updatedAdmin: AdminType) =>
    set((state: AdminStore) => ({ ...state, admin: updatedAdmin })),
}));
