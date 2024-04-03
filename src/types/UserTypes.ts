export type FormState = {
  _id: string;
  name: string;
  email: string;
  mobileNumber: number;
  weight: number;
  height: number;
  profileImage: File | string;
  BloodPressure: number;
  Diabetes: number;
  cholesterol: number;
  HeartDisease: boolean;
  KidneyDisease: boolean;
  LiverDisease: boolean;
  Thyroid: boolean;
};

export type User = {
  _id: string;
  email: string;
  name: string;
  role: string;
  userBlocked: boolean;
  isPremiumUser: boolean;
};

export type Message = {
  isSeen: boolean;
  message: string;
  receiverId: string;
  senderId: string;
  time: string;
  _id: string;
};
