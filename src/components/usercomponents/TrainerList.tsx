"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import StarRatings from "react-star-ratings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Trainer = {
  _id: number;
  name: string;
  email: string;
  experience: number;
  specializedIn: string;
  description: string;
  profilePicture: string;
  price: number;
  avgRating: number;
};

const TrainerList = () => {
  const [trainerList, setTrainerList] = useState<Trainer[]>([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  const [rating, setRating] = useState("");

  useEffect(() => {
    // console.log("TrainerList from user side");
    const getTrainer = () => {
      axiosInstance
        .get("/user/getAllTrainers", {
          params: {
            page,
            search,
            limit,
            filter: rating,
          },
        })
        .then((res) => {
          // console.log(res.data);
          setTrainerList(res.data.trainers);
          if (search !== "") {
            setPage(1);
          }
          setTotalPages(Math.ceil(res.data.totalTrainers / res.data.limit));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getTrainer();
  }, [page, search, rating]);
  return (
    <div className="md:p-10 p-2 mt-10">
      <div className="">
        <div className="flex w-full max-w-sm items-center justify-end space-x-2 md:max-w-full">
          <Input
            className="w-96"
            type="text"
            placeholder="Search . . . "
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div>
        <h1 className="text-2xl text-center font-semibold tracking-wide mt-5">Trainers</h1>
        <div className="flex gap-5 items-center mb-10 justify-end">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"}>Filter Rating</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel> Star Rating </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {[5, 4, 3, 2, 1].map((rating) => (
                  <DropdownMenuItem
                    key={rating}
                    onSelect={() => {
                      setRating(rating.toString());
                    }}
                  >
                    {
                      <StarRatings
                        rating={rating}
                        starDimension="15px"
                        starRatedColor="yellow"
                      />
                    }
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {trainerList.map((trainer) => {
        return (
          <div
            className="bg-slate-800 mt-5 w-full h-28 flex justify-between rounded-2xl p-2 md:px-16"
            key={trainer._id}
          >
            <div className="flex gap-3 md:space-x-9">
              <div className="w-16 h-16 rounded-full overflow-hidden my-auto ">
                <img
                  className="object-cover"
                  src={trainer.profilePicture}
                  alt="traer profile picture"
                />
              </div>
              <div className="text-sm leading-loose md:flex">
                <div className="w-96">
                  <div className="flex gap-2">
                    <h1 className="text-xl font-semibold tracking-wide">
                      {trainer.name}
                    </h1>
                    <div>
                      <StarRatings
                        rating={trainer.avgRating}
                        starRatedColor="yellow"
                        numberOfStars={5}
                        name="rating"
                        starDimension="12px"
                        starSpacing="1px"
                      />
                    </div>
                  </div>
                  <h1 className="opacity-55 font-light">
                    {trainer.specializedIn}
                  </h1>
                  <h1 className="opacity-55 font-light">
                    {trainer.experience} years of Experience
                  </h1>
                </div>
                <div className="md:w-96 md:overflow-hidden md:ml-20 md:h-20">
                  <h1 className="opacity-55 font-semibold hidden md:block">
                    {trainer.description}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center p-2">
              <div>
                <Link href={`/user/trainer/${trainer._id}`}>
                  <Button className="bg-blue-700 text-white" size={"sm"}>
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex justify-end mt-10">
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
    </div>
  );
};

export default TrainerList;
