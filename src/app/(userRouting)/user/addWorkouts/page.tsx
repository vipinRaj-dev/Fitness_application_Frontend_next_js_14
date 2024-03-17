"use client";
import EditAndListWorkouts from "@/components/commonRoutes/EditAndListWorkouts";
import WorkoutSearch from "@/components/trainerComponents/WorkoutSearch";
import { Button } from "@/components/ui/button";
import { userStore } from "@/store/user";
import { useState } from "react";

const page = () => {
  const user = userStore((state) => state.user);
  const client_Id = user.UserId;

  const [showWorkout, setShowWorkout] = useState(false);

  const [reRender, setReRender] = useState(false);

  const makeRerender = () => {
    setReRender(!reRender);
  };

  return (
    <div>
      {client_Id !== "empty" && (
        <EditAndListWorkouts client_Id={client_Id} reRender={reRender} />
      )}
      <Button onClick={() => setShowWorkout(!showWorkout)}>Show work</Button>
      {showWorkout && (
        <WorkoutSearch clientId={client_Id} onSuccess={makeRerender} />
      )}
    </div>
  );
};

export default page;
