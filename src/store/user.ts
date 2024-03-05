import { create } from "zustand";

type User = {
  UserId: string;
  name?: string;
  email: string;
};

type UserStore = {
  user: User;
  setUser: (user: User) => void;
};

export const userStore = create<UserStore>((set) => ({
  user: { name: "empty", email: "empty", UserId: "empty" }, // Initial state

  //if you want to change the state value with the existing state value you need to mention the state with in the set function
  setUser: (updatedUser: User) =>
    set((state: UserStore) => ({ ...state, user: updatedUser })),

  //to change all the value in the existing state you set it by defining inside the set only
  removeUser: () =>
    set({ user: { name: "empty", email: "empty", UserId: "empty" } }),
}));
