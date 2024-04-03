export type TrainerReviews = {
  _id: string;
  createdAt: string;
  content: string;
  rating: number;
  userId: {
    _id: string;
    name: string;
    profileImage: string;
  };
};

export type Trainer = {
  avgRating: number;
  transformationClientsCount: number;
  trainerPaymentDueDate: string;
  certificationsCount: number;
  description: string;
  email: string;
  experience: number;
  role?: string;
  isBlocked: boolean;
  mobileNumber: number;
  name: string;
  price: number;
  profilePicture: string;
  publicId: string;
  specializedIn: string;
  _id: string;
  certifications: {
    _id: string;
    name: string;
    content: string;
    photoUrl: string;
    publicId: string;
  }[];

  transformationClients: {
    _id: string;
    name: string;
    content: string;
    photoUrl: string;
    publicId: string;
  }[];
};

type MonthlyPayment = {
  latestDate: string;
  totalAmount: number;
  _id: number;
};

type UserCountPerMonth = {
  clientCount: number;
  latestDate: string;
  _id: number;
};

export type ResponseDataTrainerPayments = {
  monthlyPayments: MonthlyPayment[];
  userCountPerMonth: UserCountPerMonth[];
};

export type PaymentClientType = {
  amount: number;
  clientDetails: {
    _id: string;
    name: string;
    profileImage: string;
  };
  transactionId: string;
  _id: string;
};


export type TrainerMinDetails = {
  profilePicture: string;
  name: string;
  _id: string;
  trainerPaymentDueDate: string;
};

export type TrainerProfileFormState = {
  description: string;
  email: string;
  experience: number | string;
  mobileNumber: number | string;
  name: string;
  price: number | string;
  profilePicture: string;
  specializedIn: string;
  _id?: string;
};

