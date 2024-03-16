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


// export type WorkoutId = WorkoutData[0]['workoutId'];