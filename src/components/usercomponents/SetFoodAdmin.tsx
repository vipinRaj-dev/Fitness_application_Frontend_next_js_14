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
        console.log(res.data);
      })
      .catch((err: Error | any) => {
        console.log(err.response.data);
      });
  };

  // console.log("QuantityUnit", QuantityUnit);
  // console.log("foodType", foodType);

  let units = ["kg", "ml", "cup", "tbsp", "tsp", "mg", "mcg"];

  let types = [
    "Fruit",
    "Vegetable",
    "Meat",
    "Dairy",
    "Grains",
    "Fats",
    "Sweets",
  ];
  // console.log("form", form);
  // console.log("quantityunit", QuantityUnit);
  // console.log("foodtype", foodType);
  return (
    <div>
      <Label htmlFor="image">image</Label>
      {form.image && typeof form.image === "string" ? (
        <img src={form.image} alt="food" />
      ) : null}
      <Input id="image" type="file" name="image" onChange={handleFileChange} />

      <Label htmlFor="foodname">Food Name</Label>
      <Input
        id="foodname"
        type="text"
        name="foodname"
        value={form.foodname}
        onChange={handleInputChange}
      />

      <div className="flex p-3">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleInputChange}
        />
        <DropdownMenu>
          <DropdownMenuTrigger>unit</DropdownMenuTrigger>
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
      <div className="flex p-3">
        <Label htmlFor="foodtype">Food Type</Label>
        <Input disabled value={foodType} type="text" />
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

      <Label htmlFor="description">Description</Label>
      <Input
        id="description"
        name="description"
        placeholder="Type your message here."
        value={form.description}
        onChange={handleInputChange}
      />

      <Label htmlFor="ingredients">Ingredients</Label>
      <Input
        id="ingredients"
        name="ingredients"
        placeholder="Type your message here."
        value={form.ingredients}
        onChange={handleInputChange}
      />
      <Label htmlFor="foodname">Macronutrients</Label>
      <label htmlFor="protein">Protein</label>
      <Input
        id="protein"
        name="protein"
        type="number"
        placeholder="Protein"
        value={form.protein}
        onChange={handleInputChange}
      />
      <label htmlFor="fat">Fat</label>
      <Input
        id="fat"
        name="fat"
        type="number"
        placeholder="Fat"
        value={form.fat}
        onChange={handleInputChange}
      />

      <label htmlFor="carbohydrate">Carbohydrate</label>
      <Input
        id="carbohydrate"
        name="carbohydrate"
        type="number"
        placeholder="Carbohydrate"
        value={form.carbohydrate}
        onChange={handleInputChange}
      />

      <label htmlFor="calories">Calories</label>
      <Input
        id="calories"
        name="calories"
        type="number"
        placeholder="Calories"
        value={form.calories}
        onChange={handleInputChange}
      />

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default SetFoodAdmin;
