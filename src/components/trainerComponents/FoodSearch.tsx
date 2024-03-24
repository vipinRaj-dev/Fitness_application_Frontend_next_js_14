"use client";
import axiosInstance from "@/axios/creatingInstance";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";

type Food = {
  _id: string;
  createdAt: string;
  description: string;
  foodname: string;  
  foodtype: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    _id: string;
  };
  photoUrl: string;
  publicId: string;
  quantity: number;
  unit: string;
  added?: boolean;
};
type FoodSearchProps = {
  clientId: string;
  updateParent?: () => void;
};

const FoodSearch = ({ clientId, updateParent }: FoodSearchProps) => {
  // console.log("clientId", clientId);
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [addedFoodId, setAddedFoodId] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // console.log(clientId);  
    axiosInstance
      .get(`/food/allFood/${clientId}`, {
        params: {
          page,
          search,
          limit,
          filter,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setFoodList(res.data.allFood);
        setAddedFoodId(res.data.listOfFood);
        // console.log(res.data.listOfFood);
        if (search !== "") {
          setPage(1);
        }
        setTotalPages(Math.ceil(res.data.totalFoodCount / res.data.limit));
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
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

  const increaseQuantity = (foodId: string) => {
    axiosInstance
      .post(`/food/addFood/${clientId}`, { foodId })
      .then((res) => {
        // console.log(res.data);

        if (res.status === 200) {
          setAddedFoodId((prev) => [...prev, res.data.foodId]);
          updateParent && updateParent();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const decreaseQuantity = (foodId: string) => {
    axiosInstance
      .delete(`/food/deleteFood/${clientId}/${foodId}`)
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data);
          setAddedFoodId((prev) => {
            const index = prev.findIndex((id) => id === foodId);
            if (index !== -1) {
              const newAddedFoodId = [...prev];
              newAddedFoodId.splice(index, 1);
              return newAddedFoodId;
            }
            return prev;
          });

          updateParent && updateParent();  
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="">
      <h1 className="text-center font-semibold text-xl">
        Choose you favorite food
      </h1>
      <div className="flex justify-end space-x-2 w-full">
        <Input
          className=" max-w-sm "
          type="text"
          placeholder="Search . . . "
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="p-10 ">
        <div className="w-full h-0.5 bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
        <div className="flex flex-row justify-center md:gap-28 md:py-8 ">
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
                className="rounded-full bg-black md:w-16 md:h-16 w-10 h-10  object-cover scale-90 transition duration-700 ease-in-out transform hover:rotate-12 hover:scale-110 rotate-0"
                src={food.image}
                alt={food.foodtype}
              />
              <p className="text-center mt-2 md:text-lg text-sm">
                {food.foodtype !== "" ? food.foodtype : "All"}
              </p>
            </div>
          ))}
        </div>
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
      </div>
      <div className="p-5 ">
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
        {foodList.map((food: any) => (
          <div
            className="flex gap-2 mb-4 h-36 p-3 bg-[#2C2C2E] rounded-lg justify-between items-center scale-95 transition duration-700 ease-in-out transform  hover:scale-100 overflow-x-auto "
            key={food._id}
          >
            <div className="flex gap-3 h-full">
              <div className="rounded-3xl w-32  overflow-hidden">
                <img
                  className="w-full h-full object-contain "
                  src={food.photoUrl}
                  alt={food.name}
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
                  {food.ingredients.map((ingredient: any, index: number) => {
                    return <p key={index}>{ingredient}</p>;
                  })}
                </div>

                <div className="  w-96">{food.description}</div>
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
            <div className=" p-3 space-x-4 rounded-full flex">
              <Button
                onClick={() => decreaseQuantity(food._id)}
                className="rounded-xl"
              >
                -
              </Button>

              <div className="flex items-center">
                <p>{addedFoodId.filter((id) => id === food._id).length}</p>
              </div>
              <Button onClick={() => increaseQuantity(food._id)} className="rounded-xl">
                +
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

export default FoodSearch;
