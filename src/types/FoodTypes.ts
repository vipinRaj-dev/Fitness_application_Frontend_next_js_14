export type DietFoodType = {
  createdAt: string;
  date: string;
  foodId: {
    createdAt: string;
    description: string;
    foodname: string;
    foodtype: string;
    ingredients: string[];
    nutrition: {
      calories: number;
      carbs: number;
      fat: number;
      protein: number;
    };
    _id: string;
    photoUrl: string;
    publicId: string;
    quantity: number;
    unit: string;
    __v: number;
  };
  quantity: string;
  status: boolean;
  time: string;
  timePeriod: string;
  updatedAt: string;
  userId: string;
  __v: number;
  _id: string;
};

 export type FoodType = {
  createdAt: string;
  description: string;
  foodname: string;
  foodtype: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    _id: string;
  };
  photoUrl: string;
  publicId: string;
  quantity: number;
  unit: string;
  __v: number;
  _id: string;
}
