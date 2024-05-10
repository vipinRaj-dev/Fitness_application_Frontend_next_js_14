"use client";

import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";

import { FoodType } from "@/types/FoodTypes";

const ListFood = () => { 
  const [foodList, setFoodList] = useState<FoodType[]>([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(4);  
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // console.log("ListFood");
    axiosInstance
      .get("/admin/food", {
        params: {
          page,
          search,
          limit,
          filter,
        },
      })
      .then((res) => {
        // console.log("res.data foodlist" , res.data);
        setFoodList(res.data.allFood);
        if (search !== "") {
          setPage(1);
        }
        setTotalPages(Math.ceil(res.data.totalFoodCount / res.data.limit));
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [page, search, filter]);

  const filterFood = [
    { foodtype: "", image: "/images/allimage.avif" },
    { foodtype: "Meat", image: "/images/chicken.png" },
    { foodtype: "Vegetable", image: "/images/vegetables.png" },
    { foodtype: "Fruit", image: "/images/fruits.svg" },
    { foodtype: "Fish", image: "/images/fish.png" },
    { foodtype: "Dairy", image: "/images/dairy.png" },
    { foodtype: "Nuts", image: "/images/nuts.png" },
    // { foodtype: "Sweets", image: "/images/sweets.png" },
  ];

  const handleDelete = (foodId: string) => {
    // console.log("delete");

    axiosInstance
      .delete(`/admin/deleteFood/${foodId}`)
      .then((res) => {
        // console.log("res.data foodlist" , res.data);
        setFoodList((prevFoodList) =>
          prevFoodList.filter((food: { _id: string }) => food._id !== foodId)
        );
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  return (
    <div className="p-5">
      <div className="flex justify-center">
        <Link href="/admin/food/add">
          <Button size={"lg"} className="bg-green-200 hover:bg-green-400">Add food</Button>
        </Link>
      </div>
      <div className="">
        <div className="flex justify-end space-x-2 w-full">
          <Input
            className=" max-w-sm "
            type="text"
            placeholder="Search . . . "
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="p-8">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          <div className="flex justify-center gap-28 py-8">
            {filterFood.map((food, index) => (
              <div
                key={index}
                onClick={() => {
                  setFilter(food.foodtype);
                }}
                className={`cursor-pointer transition duration-1000 ${
                  filter === food.foodtype
                    ? "border-b-4 border-current rounded translate-y-6 border-y-sky-500"
                    : ""
                }`}
              >
                <img
                  className="rounded-full bg-black w-16 h-16 object-cover scale-90 transition duration-700 ease-in-out transform hover:rotate-12 hover:scale-110 rotate-0"
                  src={food.image}
                  alt={food.foodtype}
                />
                <p className="text-center mt-2">
                  {food.foodtype !== "" ? food.foodtype : "All"}
                </p>
              </div>
            ))}
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
        </div>
        {foodList.map((food) => (
          <div
            className="flex gap-2 mb-4 h-36 p-3 bg-[#2C2C2E] rounded-lg justify-between items-center scale-95 transition duration-700 ease-in-out transform  hover:scale-100"
            key={food._id}
          >
            <div className="flex gap-3 h-full">
              <div className="rounded-3xl w-32  overflow-hidden">
                <img
                  className="w-full h-full object-contain "
                  src={food.photoUrl}
                  alt={food.foodname}
                />
              </div>
              <div className=" h-full overflow-auto scrollbar-none">
                <div>
                  <h1 className="text-xl font-semibold">{food.foodname}</h1>
                </div>
                <div>
                  <h1 className="font-extralight">
                    approx : {food.quantity} {food.unit}
                  </h1>
                </div>

                <div className="flex gap-2 text-green-300 font-extralight">
                  <p>Ingredients : </p>
                  {food.ingredients.map((ingredient, index) => {
                    return <p key={index}>{ingredient}</p>;
                  })}
                </div>

                <div className="w-96">{food.description}</div>
              </div>
            </div>

            <div>
              {food && food.nutrition ? (
                Object.entries(food.nutrition).map(([key, value]) => {
                  if (typeof value === "number" && value !== 0) {
                    return (
                      <div key={key}>
                        <h1>
                          {key} : {value}
                        </h1>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <p>No nutrition information available.</p>
              )}
            </div>
            <div>
              <Link href={`/admin/food/edit/${food._id}`}>
                <Button className="rounded-3xl bg-green-400 hover:bg-green-500">
                  Edit
                </Button>
              </Link>
              <Button
                className="ml-2 rounded-3xl bg-green-500 hover:bg-green-400"
                onClick={() => handleDelete(food._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
          <div>
          {foodList.length === 0 && (
            <h1 className="text-3xl text-center">No food Available !!</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListFood;
