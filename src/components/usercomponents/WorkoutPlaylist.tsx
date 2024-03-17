"use client";

import axiosInstance from "@/axios/creatingInstance";
import { WorkoutData } from "@/types/workoutTypes";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";

const WorkoutPlaylist = () => {
  const [workoutList, setWorkoutList] = useState<WorkoutData[]>([]);
  const [playingWorkout, setPlayingWorkout] = useState<WorkoutData | null>(null);
  const [documentId, setDocumentId] = useState<string>("");
  const [completedReps, setCompletedReps] = useState<string[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      axiosInstance
        .get("/workouts/getWorkouts")
        .then((res) => {
          console.log(res.data);
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
    // console.log("playingWorkoutId", playingWorkout?.workoutSet[index]._id);
    // console.log({
    //   documentId: documentId,
    //   workoutSetId: playingWorkout?._id,
    //   eachWorkoutSetId: playingWorkout?.workoutSet[index]._id,
    //   completedReps: completedReps[index],
    // });

    axiosInstance
      .put("/workouts/updateCompletedReps", {
        documentId: documentId,
        workoutSetId: playingWorkout?._id,
        eachWorkoutSetId: playingWorkout?.workoutSet[index]._id,
        completedReps: completedReps[index],
      })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
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
    <div>
      <div>
        {playingWorkout && (
          <div className="flex justify-evenly">
            <div>
              <h1 className="text-5xl text-white">
                {playingWorkout.workoutId.workoutName}
              </h1>
              <p className="text-white">
                {playingWorkout.workoutId.description}
              </p>
              <p className="text-white">
                {playingWorkout.workoutId.targetMuscle}
              </p>
              <ReactPlayer controls url={playingWorkout.workoutId.videoUrl} />
            </div>
            <div>
              <h1 className="text-5xl text-white">Workout sets</h1>
              {playingWorkout.workoutSet.map((set, index) => {
                return (
                  <div key={index} className="bg-gray-400 m-4 p-4">
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
        )}
      </div>
      {workoutList &&
        workoutList.map((workout, index) => {
          return (
            <div key={index} className="bg-gray-400 m-4 p-4">
              <div>
                <h1 className="text-3xl text-white">
                  {workout.workoutId.workoutName}
                </h1>
                <p className="text-white">{workout.workoutId.description}</p>
                <p className=" text-white">{workout.workoutId.targetMuscle}</p>
                <Image
                  src={workout.workoutId.thumbnailUrl}
                  width={100}
                  height={100}
                  alt="image"
                />
                <Button
                  onClick={() => {
                    console.log(workout);
                    setPlayingWorkout(workout);
                  }}
                >
                  Play
                </Button>
              </div> 
            </div>
          );
        })}
    </div>
  );
};

export default WorkoutPlaylist;
