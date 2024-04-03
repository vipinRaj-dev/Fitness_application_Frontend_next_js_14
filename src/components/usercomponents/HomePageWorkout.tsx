"use effect";

import axiosInstance from "@/axios/creatingInstance";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "../ui/button";
import Link from "next/link";
import { WorkoutData } from "@/types/WorkoutTypes";
import Image from "next/image";

const HomePageWorkout = ({ hasTrainer }: { hasTrainer: boolean }) => {
  const [workoutList, setWorkoutList] = useState<WorkoutData[]>([]);

  useEffect(() => {
    try {
      axiosInstance
        .get("/workouts/getWorkouts")
        .then((res) => {
          // console.log(res.data);
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
    <div>
      <div className="h-4/6 overflow-x-scroll rounded-xl scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
        <div>
          <h1 className="text-5xl font-semibold tracking-wide text-white ">
            Workout
          </h1>
        </div>

        <div className="flex gap-5 p-5 ">
          {workoutList &&
            workoutList.map((workout, index) => {
              return (
                <div key={index} className="bg-slate-900 px-3 p-3 rounded-lg hover:scale-105 duration-700 ">
                  <div>
                    <div>
                      <ReactPlayer
                        width={350}
                        height={300}
                        controls
                        url={workout.workoutId.videoUrl}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        <h1 className="text-3xl font-semibold text-white">
                          {workout.workoutId.workoutName}
                        </h1>
                        <Image
                          src={"/images/verified.svg"}
                          width={15}
                          height={15}
                          alt="dot"
                        />
                      </div>
                      {/* <p className=" text-white">
                      {workout.workoutId.description}
                    </p> */}
                      <div >
                        <h1 className="font-semibold">Muscle groups</h1>
                        <ul className="px-5">
                          {workout.workoutId.targetMuscle
                            .split(",")
                            .map((muscle, index) => {
                              return (
                                <li
                                  key={index}
                                  style={{ listStyleType: "circle" }}
                                >
                                  {muscle}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex gap-2 justify-end p-5">
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
      </div>
    </div>
  );
};

export default HomePageWorkout;
