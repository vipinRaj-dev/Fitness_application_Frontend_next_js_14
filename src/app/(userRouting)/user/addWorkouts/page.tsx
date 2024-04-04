"use client";
import EditAndListWorkouts from "@/components/commonRoutes/EditAndListWorkouts";
import WorkoutSearch from "@/components/trainerComponents/WorkoutSearch";
import { Button } from "@/components/ui/button";
import { userStore } from "@/store/user";
import { useState } from "react";

const Page= () => {
  const user = userStore((state) => state.user);
  const client_Id = user.UserId;

  const [showWorkout, setShowWorkout] = useState(false);

  const [reRender, setReRender] = useState(false);

  const makeRerender = () => {
    setReRender(!reRender);
  };

  return (
    <div>
      <Button onClick={() => setShowWorkout(!showWorkout)}>
        {showWorkout ? "close" : "Show work"}
      </Button>
      {showWorkout && (
        <div className="h-4/6">
          <h1 className="text-2xl p-5 text-center">Search Workouts</h1>
          <WorkoutSearch clientId={client_Id} onSuccess={makeRerender} />
        </div>
      )}
      {client_Id !== "empty" && (
        <div className="h-screen">
          <h1 className="text-2xl p-5 text-center">Schedule Workout</h1>
          <EditAndListWorkouts client_Id={client_Id} reRender={reRender} />
        </div>
      )}
    </div>
  );
};

export default Page;
