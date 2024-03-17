"use client";

import { useEffect, useState } from "react";

import { WorkoutData } from "@/types/workoutTypes";
import { Pencil, Plus, Trash2 } from "lucide-react";
import axiosInstance from "@/axios/creatingInstance";

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

const EditAndListWorkouts = ({ client_Id , reRender }: { client_Id: string; reRender? : boolean }) => {
  const [workout, setWorkout] = useState<WorkoutData[]>([]);
  const [addSetDialog, setAddSetDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [documentId, setDocumentId] = useState<string>("");

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
        console.log("workoutData", res.data.workOutData);
        setWorkout(res.data.workOutData);
        setDocumentId(res.data.documentId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [client_Id, success , reRender]);

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
        console.log(res.data);
        setAddSetDialog(false);
        setSuccess(!success);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-5">
      {workout &&
        workout.map((workoutItem, index) => {
          return (
            <div className="p-5 border-2" key={workoutItem._id}>
              <div className="flex gap-3">
                <Plus
                  color="#2ae549"
                  onClick={() => {
                    setAddSetDialog(true);
                    setToEdit({
                      reps: "",
                      weight: "",
                      workoutSetId: workoutItem._id,
                      eachWorkoutSetId: "",
                    });
                  }}
                />
                <Trash2 onClick={() => deleteWorkout(workoutItem._id)} />
              </div>
              <h1>{workoutItem.workoutId.workoutName}</h1>
              <p>{workoutItem.workoutId.description}</p>
              <div>
                {workoutItem.workoutSet.map((set, index) => {
                  return (
                    <div key={set._id}>
                      <h1>{index + 1}</h1>
                      <h1>Reps : {set.reps}</h1>
                      <h1>Weight : {set.weight}</h1>
                      <Trash2
                        onClick={() => deleteSet(workoutItem._id, set._id)}
                      />
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
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

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
                <Label htmlFor="reps">Reps</Label>
                <Input
                  type="number"
                  id="reps"
                  onChange={(e) =>
                    setToEdit({
                      ...toEdit,
                      reps: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setToEdit({
                      ...toEdit,
                      weight: e.target.value,
                    })
                  }
                  value={toEdit.weight}
                  placeholder="Enter Weight"
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
                  onChange={(e) =>
                    setToEdit({
                      ...toEdit,
                      reps: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setToEdit({
                      ...toEdit,
                      weight: e.target.value,
                    })
                  }
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
