"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import Image from "next/image";



type Workout = {
  createdAt: string;
  description: string;
  publicId: string;
  targetMuscle: string;
  thumbnailUrl: string;
  videoUrl: string;
  workoutName: string;
  __v: number;
  _id: string;
};

type AllWorkout = Workout[];



const ListWorkouts = () => {
  const [workoutsList, setWorkoutsList] = useState<AllWorkout>([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("");



  useEffect(() => {
    console.log("ListWorkouts");
    axiosInstance
      .get("/admin/workouts", {
        params: {
          page,
          search,
          limit,
          filter,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setWorkoutsList(res.data.allWorkout);
        if (search !== "") {
          setPage(1);
        }
        setTotalPages(Math.ceil(res.data.totalWorkoutCount / res.data.limit));
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [page, search, filter]);

  const handleDelete = (workoutId: string) => {
    console.log("delete");

    axiosInstance
      .delete(`/admin/deleteWorkout/${workoutId}`)
      .then((res) => {
        // console.log(res.data);
        setWorkoutsList((prev) =>
          prev.filter((workout) => workout._id !== workoutId)
        );
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <div>
      <div>
        <div className="flex justify-end space-x-2 w-full">
          <Input
            className=" max-w-sm "
            type="text"
            placeholder="Search . . . "
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        <div className="flex justify-end py-5">
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
        {workoutsList &&
          workoutsList.map((workout) => (
            <div key={workout._id}>
              <Image
                src={workout.thumbnailUrl}
                width={100}
                height={100}
                alt="Workout-image" 
              ></Image>

              <h1>{workout.workoutName}</h1>
              <h1>{workout.description}</h1>
              <h1>{workout.targetMuscle}</h1>
              <div>
                <Link href={`/admin/workout/edit/${workout._id}`}>
                  <Button className="rounded-3xl bg-green-400 hover:bg-green-500">
                    Edit
                  </Button>
                </Link>
                <Button
                  className="ml-2 rounded-3xl bg-green-500 hover:bg-green-400"
                  onClick={() => handleDelete(workout._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListWorkouts;
