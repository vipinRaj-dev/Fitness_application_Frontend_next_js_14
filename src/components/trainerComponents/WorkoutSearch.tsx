"use client";

import axiosInstance from "@/axios/creatingInstance";
import React, { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import { HttpStatusCode } from "@/types/HttpStatusCode";

type Workout = {
  description: string;
  targetMuscle: string;
  thumbnailUrl: string;
  videoUrl: string;
  workoutName: string;
  _id: string;
};

type AllWorkouts = Workout[];

type WorkoutSet = {
  reps: number;
  weight: number;
};

const WorkoutSearch = ({
  clientId,
  onSuccess,
}: {
  clientId: string;
  onSuccess?: () => void;
}) => {
  const [workouts, setWorkouts] = useState<AllWorkouts>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [workoutId, setWorkoutId] = useState("");

  const [workoutSet, setWorkoutSet] = useState<WorkoutSet[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axiosInstance
      .get(`/workouts`, {
        params: {
          page,
          search,
          limit,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setWorkouts(res.data.allWorkouts);
        if (search !== "") {
          setPage(1);
        }
        setTotalPages(Math.ceil(res.data.totalWorkoutCount / limit));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, search]);

  const setWorkout = () => {
    axiosInstance
      .put(`/workouts/set`, {
        clientId,
        workoutId,
        workoutSet,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.status === HttpStatusCode.OK) {
          setIsDialogOpen(false);
          onSuccess && onSuccess();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div >
      <div className="flex justify-end my-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Workout or Target muscle"
          className=" text-black w-96 h-10 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent mx-2"
        />
      </div>
      <div className="flex justify-end">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
        >
          Prev
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 ${
              page === index + 1 ? "bg-blue-500" : ""
            }`}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
        >
          Next
        </Button>
      </div>

      <div>
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead className="w-[100px]">Thumbnail</TableHead>
              <TableHead>Workout Name</TableHead>
              <TableHead>Target Muscle</TableHead>
              <TableHead>Add Set</TableHead>
              <TableHead>view Workout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts &&
              workouts.map((workout) => (
                <TableRow key={workout._id}>
                  <TableCell className="h-32">
                    <Image
                      className="rounded-md"
                      src={workout.thumbnailUrl}
                      width={100}
                      height={100}
                      alt={"workoutimage"}
                    />
                  </TableCell>
                  <TableCell><h1 className="text-xl font-semibold">{workout.workoutName}</h1></TableCell>
                  <TableCell>
                    <ul>
                      {workout.targetMuscle.split(",").map((muscle, index) => {
                        return (
                          <li key={index} className="font-semibold" style={{ listStyleType: "circle"  }}>
                            {muscle}
                          </li>
                        );
                      })}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setIsDialogOpen(true);
                        setWorkoutSet([]);
                        setWorkoutId(workout._id);
                      }}
                    >
                      Add Workout sets
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>View</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>
                            <div className="flex justify-between p-5">
                              <h1>{workout.workoutName}</h1>
                              <h1>{workout.targetMuscle}</h1>
                            </div>
                          </DialogTitle>
                          <ReactPlayer controls url={workout.videoUrl} />
                          <DialogDescription className="p-5">
                            {workout.description}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                      <DialogFooter></DialogFooter>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Workout reps and Weight to the user</DialogTitle>
              <div className="flex justify-between items-center gap-2">
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    type="number"
                    id="reps"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue >= "0") {
                        setReps(newValue);
                      }
                    }}
                    value={reps}
                    placeholder="Enter Reps"
                    className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    type="number"
                    id="weight"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue >= "0") {
                        setWeight(newValue);
                      }
                    }}
                    value={weight}
                    placeholder="Enter Weight"
                    className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  />
                </div>
                <div className="mt-8">
                  <Button
                    onClick={() => {
                      reps &&
                        weight &&
                        setWorkoutSet([
                          ...workoutSet,
                          {
                            reps: parseInt(reps),
                            weight: parseInt(weight),
                          },
                        ]);
                      setReps("");
                      setWeight("");
                    }}
                  >
                    Set
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <div>
              {workoutSet.map((set, index) => (
                <div key={index} className="flex gap-2 justify-evenly">
                  <p>Set : {index + 1}</p>
                  <p>Reps: {set.reps}</p>
                  <p>Weight: {set.weight}</p>
                </div>
              ))}
            </div>
            <Button onClick={setWorkout}>Set Workout</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WorkoutSearch;
