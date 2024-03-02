"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axiosInstance from "@/axios/creatingInstance";
import swal from "sweetalert";
import { set } from "react-hook-form";
import Dnaspinner from "../loadingui/Dnaspinner";

// import { usePathname } from "next/navigation";

type FoodFormState = {
  image: File | string;
  foodname: string;
  quantity: number;
  foodtype: string;
  unit: string;
  description: string;
  ingredients: string;
  protein: number;
  fat: number;
  carbohydrate: number;
  calories: number;
};

const SetFoodAdmin = ({ foodId }: { foodId?: string }) => {
  const [QuantityUnit, setQuantityUnit] = useState<string>("Select unit");
  const [foodType, setFoodType] = useState<string>("");
  const [addOrEdit, setAddOrEdit] = useState<string>("add");

  const [loading, setLoading] = useState(false);

  // const pathname = usePathname();

  // console.log("pathname", pathname.split("/")[3]);

  useEffect(() => {
    if (foodId) {
      setAddOrEdit("edit");
      axiosInstance
        .get(`/admin/food/${foodId}`)
        .then((res) => {
          console.log(res.data);
          setForm({
            image: res.data.photoUrl,
            foodname: res.data.foodname,
            quantity: res.data.quantity,
            foodtype: res.data.foodtype,
            unit: res.data.unit,
            description: res.data.description,
            ingredients: res.data.ingredients.join(", "),
            protein: res.data.nutrition.protein,
            fat: res.data.nutrition.fat,
            carbohydrate: res.data.nutrition.carbs,
            calories: res.data.nutrition.calories,
          });
          setQuantityUnit(res.data.unit);
          setFoodType(res.data.foodtype);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  }, [foodId]);

  const [form, setForm] = useState<FoodFormState>({
    image: "",
    foodname: "",
    quantity: 0,
    foodtype: "",
    unit: "",
    description: "",
    ingredients: "",
    protein: 0,
    fat: 0,
    carbohydrate: 0,
    calories: 0,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
    // console.log("form", form);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : "";
    setForm({
      ...form,
      image: file,
    });
  };

  const handleCheckedChangeQuantity = (checked: boolean, value: string) => {
    if (checked) {
      setQuantityUnit(value);
      setForm((prevState) => ({
        ...prevState,
        unit: value,
      }));
    } else {
      setQuantityUnit("");
    }
  };

  const handleCheckedChangeFoodType = (checked: boolean, value: string) => {
    if (checked) {
      setFoodType(value);
      setForm((prevState) => ({
        ...prevState,
        foodtype: value,
      }));
    } else {
      setFoodType("");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    let url = foodId ? `/admin/editFood/${foodId}` : "/admin/addFood";

    await axiosInstance[foodId ? "put" : "post"](url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
      })
      .catch((err: Error | any) => {
        console.log(err.response.data);
      });
  };

  // console.log("QuantityUnit", QuantityUnit);
  // console.log("foodType", foodType);

  let units = ["kg", "ml", "cup", "tbsp", "tsp", "mg"];

  let types = ["Fruit", "Vegetable", "Meat", "Fish", "Dairy", "Nuts", "Sweets"];
  // console.log("form", form);
  // console.log("quantityunit", QuantityUnit);
  // console.log("foodtype", foodType);

  if (loading) {
    return <Dnaspinner />;
  }
  return (
    <div className=" bg-slate-900 rounded-3xl mt-5 h-screen w-11/12 mx-auto p-5">
      <h1 className="text-center font-semibold text-3xl tracking-wide">
        Add New Food
      </h1>
      <div className="flex justify-center">
        <div className="rounded-3xl overflow-hidden bg-black w-44 ">
          {form.image && typeof form.image === "string" ? (
            <img
              className="w-full h-full object-cover"
              src={form.image}
              alt="food"
            />
          ) : null}
        </div>
      </div>

      <div className=" h-1/6 flex flex-col justify-center items-center">
        <Label className="text-lg p-2" htmlFor="image">
          Add picture
        </Label>
        <Input
          className="w-1/2 z-50  rounded-full"
          id="image"
          type="file"
          name="image"
          onChange={handleFileChange}
        />
      </div>

      <div className=" w-full h-4/6 flex justify-evenly gap-11 p-5 pt-8">
        <div className="space-y-5 w-full pt-6">
          <div className="space-y-2">
            <Label htmlFor="foodname">Food Name</Label>
            <Input
              className=" rounded-xl"
              id="foodname"
              type="text"
              name="foodname"
              value={form.foodname}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex">
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleInputChange}
                />
                <div className="m-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {form.unit ? form.unit : "unit"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Select the unit</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        {units.map((unit) => (
                          <DropdownMenuCheckboxItem
                            key={unit}
                            checked={QuantityUnit === unit}
                            textValue={unit}
                            onCheckedChange={(checked) =>
                              handleCheckedChangeQuantity(checked, unit)
                            }
                          >
                            {unit}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="foodtype">Food Type</Label>
            <div className="flex">
              <Input disabled value={foodType} type="text" />
              <div className="ml-3">
                <DropdownMenu>
                  <DropdownMenuTrigger>Type</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Select the type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {types.map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={foodType === type}
                          textValue={type}
                          onCheckedChange={(checked) =>
                            handleCheckedChangeFoodType(checked, type)
                          }
                        >
                          {type}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <Label htmlFor="description">Description</Label>
          <Input
            className="h-44 rounded-xl text-center"
            id="description"
            name="description"
            placeholder="Type your message here."
            value={form.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full space-y-2 ">
          <div className="flex justify-center">
            <Label className="text-lg" htmlFor="foodname">
              Macronutrients
            </Label>
          </div>
          <label htmlFor="protein">Protein</label>
          <Input
            className=" rounded-xl"
            id="protein"
            name="protein"
            type="number"
            placeholder="Protein"
            value={form.protein}
            onChange={handleInputChange}
          />
          <label htmlFor="fat">Fat</label>
          <Input
            className=" rounded-xl"
            id="fat"
            name="fat"
            type="number"
            placeholder="Fat"
            value={form.fat}
            onChange={handleInputChange}
          />

          <label htmlFor="carbohydrate">Carbohydrate</label>
          <Input
            className=" rounded-xl"
            id="carbohydrate"
            name="carbohydrate"
            type="number"
            placeholder="Carbohydrate"
            value={form.carbohydrate}
            onChange={handleInputChange}
          />

          <label htmlFor="calories">Calories</label>
          <Input
            className=" rounded-xl"
            id="calories"
            name="calories"
            type="number"
            placeholder="Calories"
            value={form.calories}
            onChange={handleInputChange}
          />

          <Label htmlFor="ingredients">Ingredients</Label>
          <Input
            className=" rounded-xl h-36 text-center"
            id="ingredients"
            name="ingredients"
            placeholder="Type your message here."
            value={form.ingredients}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex justify-center -m-12">
        <Button className="w-40 text-lg font-semibold" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default SetFoodAdmin;
