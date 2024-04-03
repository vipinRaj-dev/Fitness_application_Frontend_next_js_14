export type WorkoutData = {
  workoutId: {
    description: string;
    targetMuscle: string;
    thumbnailUrl: string;
    videoUrl: string;
    workoutName: string;
    _id: string;
  };
  workoutSet: {
    completedReps: number;
    reps: number;
    weight: number;
    _id: string;
  }[];
  _id: string;
};

export type WorkoutListType = {
  createdAt: string;
  description: string;
  publicId: string;
  targetMuscle: string;
  thumbnailUrl: string;
  videoUrl: string;
  workoutName: string;
  __v: number;
  _id: string;
};

export type WorkoutFormType = {
  workoutName: string;
  targetMuscle: string;
  description: string;
  video: File | string;
  videoUrl?: string;
};
