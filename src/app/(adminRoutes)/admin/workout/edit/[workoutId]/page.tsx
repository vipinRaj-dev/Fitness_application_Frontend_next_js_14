import SetWorkout from "@/components/adminRoutes/SetWorkout"

const Page= ({
    params,
  }: {
    params: {
      workoutId: string;
    };
  }) => {
    return (
      <div>
        <SetWorkout workoutId={params.workoutId} />
      </div>
    );
  };

export default page