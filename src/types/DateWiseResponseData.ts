type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type FoodId = {
  foodname: string;
  foodtype: string;
  nutrition: Nutrition;
  photoUrl: string;
};

type FoodLog = {
  foodId: FoodId;
  quantity: string;
  status: boolean;
  time: string;
  timePeriod: string;
  updatedAt: string;
  userId: string;
};

type WorkoutSet = {
  completedReps: number;
  reps: number;
  weight: number;
  _id: string;
};

type Workout = {
  workoutId: {
    createdAt: string;
    description: string;
    publicId: string;
    targetMuscle: string;
    thumbnailUrl: string;
    videoUrl: string;
    workoutName: string;
    _id: string;
  };
  workoutSet: WorkoutSet[];
  _id: string;
};

type WorkOutLogs = {
  userId: string;
  workOuts: Workout[];
  _id: string;
};

export type AttendanceData = {
  foodLogs: FoodLog[];
  isPresent: boolean;
  userId: string;
  workOutLogs: WorkOutLogs;
  notCompleteReason?: string;
};
