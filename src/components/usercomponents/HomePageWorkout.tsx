"use effect";

import axiosInstance from "@/axios/creatingInstance";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "../ui/button";
import Link from "next/link";
import { WorkoutData } from "@/types/workoutTypes";

const HomePageWorkout = ({ hasTrainer }: { hasTrainer: boolean }) => {
  const [workoutList, setWorkoutList] = useState<WorkoutData[]>([]);

  useEffect(() => {
    try {
      axiosInstance
        .get("/workouts/getWorkouts")
        .then((res) => {
          console.log(res.data);
          setWorkoutList(res.data.workOutData);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="h-4/6 bg-gray-600 overflow-x-scroll">
      <div>
        <h1 className="text-5xl text-center text-white">Workout</h1>
      </div>

      <div>
        <Link href={"/user/playlist"}>
          <Button>Playlist</Button>
        </Link>
      </div>

      {hasTrainer ? null : (
        <div>
          <Link href={"/user/addWorkouts"}>
            <Button>Add workouts</Button>
          </Link>
        </div>
      )}
      <div className="flex ">
        {workoutList &&
          workoutList.map((workout, index) => {
            return (
              <div key={index} className="bg-gray-400 m-4 p-4">
                <div>
                  <h1 className="text-3xl text-center text-white">
                    {workout.workoutId.workoutName}
                  </h1>
                  <p className="text-center text-white">
                    {workout.workoutId.description}
                  </p>
                  <p className="text-center text-white">
                    {workout.workoutId.targetMuscle}
                  </p>
                  <ReactPlayer controls url={workout.workoutId.videoUrl} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default HomePageWorkout;
