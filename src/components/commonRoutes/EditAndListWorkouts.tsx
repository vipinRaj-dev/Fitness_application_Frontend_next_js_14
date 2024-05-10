"use client";

import { useEffect, useState } from "react";

import { WorkoutData } from "@/types/WorkoutTypes";
import { Ghost, Pencil, Plus, Trash2 } from "lucide-react";
import axiosInstance from "@/axios/creatingInstance";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import Image from "next/image";

const EditAndListWorkouts = ({
  client_Id,
  reRender,
}: {
  client_Id: string;
  reRender?: boolean;
}) => {
  const [workout, setWorkout] = useState<WorkoutData[]>([]);
  const [addSetDialog, setAddSetDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [documentId, setDocumentId] = useState<string>("");
  const [error, setError] = useState({
    reps: "",
    weight: "",
  });

  const [toEdit, setToEdit] = useState({
    reps: "",
    weight: "",
    workoutSetId: "",
    eachWorkoutSetId: "",
  });

  useEffect(() => {
    axiosInstance
      .get(`/workouts/getWorkoutsTrainer/${client_Id}`)
      .then((res) => {
        // console.log("workoutData", res.data.workOutData);
        setWorkout(res.data.workOutData);
        setDocumentId(res.data.documentId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [client_Id, success, reRender]);

  const editSet = () => {
    // console.log("edit");
    // console.log(toEdit);
    axiosInstance
      .put("/workouts/editSet", {
        documentId,
        workoutSetId: toEdit.workoutSetId,
        eachWorkoutSetId: toEdit.eachWorkoutSetId,
        reps: toEdit.reps,
        weight: toEdit.weight,
      })
      .then((res) => {
        // console.log(res.data);
        setSuccess(!success);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteSet = (workoutSetId: string, eachWorkoutSetId: string) => {
    // console.log("Delete");
    // console.log(eachWorkoutSetId, workoutSetId, documentId);
    axiosInstance
      .delete(
        `/workouts/deleteSet/${documentId}/${workoutSetId}/${eachWorkoutSetId}`
      )
      .then((res) => {
        // console.log(res.data);
        setSuccess(!success);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteWorkout = (workoutId: string) => {
    // console.log("Delete");
    // console.log(workoutId, documentId);
    axiosInstance
      .delete(`/workouts/deleteWorkout/${documentId}/${workoutId}`)
      .then((res) => {
        // console.log(res.data);
        setSuccess(!success);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addSetWorkout = () => {
    axiosInstance
      .put(`/workouts/addNewSet`, {
        documentId,
        workoutSetId: toEdit.workoutSetId,
        reps: toEdit.reps,
        weight: toEdit.weight,
      })
      .then((res) => {
        // console.log(res.data);
        setAddSetDialog(false);
        setSuccess(!success);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-5 h-5/6 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Image</TableHead>
            <TableHead>Workout Name</TableHead>
            <TableHead>Target Muscle</TableHead>
            <TableHead>Set</TableHead>
            <TableHead>Reps</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
            <TableHead>Add Set</TableHead>
            <TableHead>Delete Workout</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {workout &&
            workout.map((workoutItem, index) => {
              return workoutItem.workoutSet.map((set, setIndex) => (
                <TableRow className="hover:bg-transparent" key={set._id}>
                  {setIndex === 0 && (
                    <>
                      <TableCell rowSpan={workoutItem.workoutSet.length}>
                        <div>
                          <Image
                            className="rounded-xl"
                            src={workoutItem.workoutId.thumbnailUrl}
                            width={100}
                            height={100}
                            alt="workoutImage"
                          />
                        </div>
                      </TableCell>
                      <TableCell rowSpan={workoutItem.workoutSet.length}>
                        <div>
                          <h1>{workoutItem.workoutId.workoutName}</h1>
                        </div>
                      </TableCell>
                      <TableCell rowSpan={workoutItem.workoutSet.length}>
                        <div>
                          {workoutItem.workoutId.targetMuscle
                            .split(",")
                            .map((muscle, index) => {
                              return (
                                <ul key={index} className="p-1 list-disc">
                                  <li>{muscle}</li>
                                </ul>
                              );
                            })}
                        </div>
                      </TableCell>
                    </>
                  )}
                  <TableCell className="font-medium">{setIndex + 1}</TableCell>
                  <TableCell>{set.reps}</TableCell>
                  <TableCell>{set.weight}</TableCell>
                  <TableCell className="hover:bg-slate-800">
                    <Pencil
                      onClick={() => {
                        setIsDialogOpen(true);
                        setToEdit({
                          reps: set.reps.toString(),
                          weight: set.weight.toString(),
                          workoutSetId: workoutItem._id,
                          eachWorkoutSetId: set._id,
                        });
                      }}
                      color="#001adb"
                    />
                  </TableCell>
                  <TableCell className="text-right hover:bg-slate-800">
                    <Trash2
                      color="#a02727"
                      onClick={() => deleteSet(workoutItem._id, set._id)}
                    />
                  </TableCell>
                  {setIndex === 0 && (
                    <>
                      <TableCell rowSpan={workoutItem.workoutSet.length}>
                        <div>
                          <Button
                            variant={"ghost"}
                            className="gap-2"
                            onClick={() => {
                              setAddSetDialog(true);
                              setToEdit({
                                reps: "",
                                weight: "",
                                workoutSetId: workoutItem._id,
                                eachWorkoutSetId: "",
                              });
                            }}
                          >
                            Add <Plus color="#2ae549" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell rowSpan={workoutItem.workoutSet.length}>
                        <div>
                          <Button
                            variant={"ghost"}
                            className="gap-2"
                            onClick={() => deleteWorkout(workoutItem._id)}
                          >
                            Delete
                            <Trash2 color="#a02727" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ));
            })}
        </TableBody>
      </Table>

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
              <div>
                {error.reps && <p className="text-red-500">{error.reps}</p>}
                <Label htmlFor="reps">Reps</Label>
                <Input
                  min={1}
                  type="number"
                  id="reps"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseInt(value) >= 0 || value === "") {
                      setToEdit({
                        ...toEdit,
                        reps: value,
                      });
                    }
                  }}
                  value={toEdit.reps}
                  placeholder="Enter Reps"
                  className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  min={1}
                  type="number"
                  id="weight"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseInt(value) >= 0 || value === "") {
                      setToEdit({
                        ...toEdit,
                        weight: value,
                      });
                    }
                  }}
                  value={toEdit.weight}
                  placeholder="Enter Weight in kg"
                  className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                />
              </div>
            </div>
          </DialogHeader>
          <DialogClose asChild>
            <Button onClick={editSet}>Reset</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addSetDialog}
        onOpenChange={(isOpen) => {
          setAddSetDialog(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add New Workout reps and Weight to the user
            </DialogTitle>
            <div className="flex justify-between items-center gap-2">
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  type="number"
                  id="reps"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseInt(value) >= 0 || value === "") {
                      setToEdit({
                        ...toEdit,
                        reps: value,
                      });
                    }
                  }}
                  value={toEdit.reps}
                  placeholder="Enter Reps"
                  className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  type="number"
                  id="weight"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (parseInt(value) >= 0 || value === "") {
                      setToEdit({
                        ...toEdit,
                        weight: value,
                      });
                    }
                  }}
                  value={toEdit.weight}
                  placeholder="Enter Weight"
                  className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                />
              </div>
            </div>
          </DialogHeader>
          <DialogClose asChild>
            <Button onClick={addSetWorkout}>Add New Set</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditAndListWorkouts;
