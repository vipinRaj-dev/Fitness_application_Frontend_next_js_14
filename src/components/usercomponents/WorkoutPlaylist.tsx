"use client";

import axiosInstance from "@/axios/creatingInstance";
import { WorkoutData } from "@/types/WorkoutTypes";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import { Play } from "lucide-react";
import { HttpStatusCode } from "@/types/HttpStatusCode";

const WorkoutPlaylist = () => {
  const [workoutList, setWorkoutList] = useState<WorkoutData[]>([]);
  const [playingWorkout, setPlayingWorkout] = useState<WorkoutData | null>(
    null
  );
  const [documentId, setDocumentId] = useState<string>("");
  const [completedReps, setCompletedReps] = useState<string[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      axiosInstance
        .get("/workouts/getWorkouts")
        .then((res) => {
          // console.log(res.data);
          setWorkoutList(res.data.workOutData);
          setDocumentId(res.data.documentId);
          setPlayingWorkout(res.data.workOutData[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const updateCompletedReps = (index: number) => {
    axiosInstance
      .put("/workouts/updateCompletedReps", {
        documentId: documentId,
        workoutSetId: playingWorkout?._id,
        eachWorkoutSetId: playingWorkout?.workoutSet[index]._id,
        completedReps: completedReps[index],
      })
      .then((res) => {
        // console.log(res.data);
        if (res.status === HttpStatusCode.OK) {
          const newDisabledButtons = [...disabledButtons];
          newDisabledButtons[index] = true;
          setDisabledButtons(newDisabledButtons);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="mt-14">
      <div>
        {playingWorkout && (
          <div className="flex justify-evenly">
            <div>
              <ReactPlayer
                width={1000}
                height={600}
                controls
                url={playingWorkout.workoutId.videoUrl}
              />

              <h1 className="text-3xl text-whitem mb-3">
                {playingWorkout.workoutId.workoutName}
              </h1>
              <p className="text-white">
                {playingWorkout.workoutId.description}
              </p>
              <div className="flex justify-end">
                <p className="text-white">
                  Target Muscles : {playingWorkout.workoutId.targetMuscle}
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-3xl text-white">Workout sets</h1>
              <div className=" h-5/6 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
                {playingWorkout.workoutSet.map((set, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-slate-900 rounded-lg hover:scale-105 duration-700 m-4 p-4"
                    >
                      <div>
                        <h1 className="text-3xl text-white">Set {index + 1}</h1>
                        <p className="text-white">Reps: {set.reps}</p>
                        <p className="text-white">Weight: {set.weight}</p>
                        <div className="flex gap-3">
                          <Input
                            disabled={
                              disabledButtons[index] || set.completedReps > 0
                            }
                            type="number"
                            placeholder={
                              "Completed reps " + set.completedReps.toString()
                            }
                            value={completedReps[index] || ""}
                            onChange={(e) => {
                              const newCompletedReps = [...completedReps];
                              newCompletedReps[index] = e.target.value;
                              setCompletedReps(newCompletedReps);
                            }}
                          />
                          {set.completedReps === 0 && (
                            <Button
                              disabled={disabledButtons[index]}
                              onClick={() => updateCompletedReps(index)}
                            >
                              {disabledButtons[index] ? "Added" : "Add"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-center pt-20 pb-5 ">
          Workout Playlist
        </h1>
      </div>
      <div className="h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
        {workoutList &&
          workoutList.map((workout, index) => {
            return (
              <div
                key={index}
                className="bg-slate-900 rounded-2xl m-2 p-4 overflow-hidden"
              >
                <div className="flex justify-between h-32 items-center overflow-hidden ">
                  <div className="flex items-center gap-4 w-96 ">
                    <Image
                      className="rounded-lg flex-shrink-0"
                      src={workout.workoutId.thumbnailUrl}
                      width={100}
                      height={50}
                      alt="image"
                    />
                    <h1 className="text-2xl text-white">
                      {workout.workoutId.workoutName}
                    </h1>
                  </div>
                  <div>
                    <ul>
                      {workout.workoutId.targetMuscle
                        .split(",")
                        .map((muscle, index) => {
                          return (
                            <li key={index} style={{ listStyleType: "circle" }}>
                              {muscle}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <Button
                    className="gap-2"
                    onClick={() => {
                      // console.log(workout);
                      setPlayingWorkout(workout);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Play
                    <Play size={16} color="#3c45c3" />
                  </Button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default WorkoutPlaylist;
