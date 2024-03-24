"use client";
import axiosInstance from "@/axios/creatingInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { Toaster } from "@/components/ui/sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "sonner";

type FormType = {
  workoutName: string;
  targetMuscle: string;
  description: string;
  video: File | string;
  videoUrl?: string;
};

const createSchema = (minLength: number, errorMessage: string) => {
  return z
    .string()
    .min(minLength, errorMessage)

    .refine(
      (value) => /^[a-zA-Z0-9 ,.-]*$/.test(value),
      "Only alphanumeric characters and spaces are allowed"
    );
};
const workoutNameSchema = createSchema(2, "Workout Name is required");
const targetMuscleSchema = createSchema(2, "Target Muscle is required");
const descriptionSchema = createSchema(2, "Description is required");

const schema = z.object({
  workoutName: workoutNameSchema,
  targetMuscle: targetMuscleSchema,
  description: descriptionSchema,
  video: z.any().refine((file) => {
    if (!file) {
      return true;
    }
    console.log(file);
    return file.type === "video/mp4";
  }, "Invalid video file"),
});

const SetWorkout = ({ workoutId }: { workoutId?: string }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormType>({
    workoutName: "",
    targetMuscle: "",
    description: "",
    video: "",
    videoUrl: "",
  });
  const [error, setError] = useState<FormType>({
    workoutName: "",
    targetMuscle: "",
    description: "",
    video: "",
  });

  useEffect(() => {
    if (workoutId) {
      axiosInstance
        .get(`/admin/workout/${workoutId}`)

        .then((res) => {
          // console.log(res.data.workoutData);
          setFormData((prev) => ({
            ...prev,
            ...res.data.workoutData,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [workoutId]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log(formData);

    const trimmedForm = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (typeof value === "string") {
          return [key, value.replace(/\s+/g, " ")];
        }
        return [key, value];
      })
    );
    const result = schema.safeParse(trimmedForm);

    if (!result.success) {
      const errorMap = result.error.formErrors.fieldErrors;
      console.log("errorMap", errorMap);
      setError((prevError) => {
        return {
          ...prevError,
          workoutName: errorMap.workoutName ? errorMap.workoutName[0] : "",
          targetMuscle: errorMap.targetMuscle ? errorMap.targetMuscle[0] : "",
          description: errorMap.description ? errorMap.description[0] : "",
          video: errorMap.video ? errorMap.video[0] : "",
        };
      });
    } else {
      setLoading(true);
      setError({
        workoutName: "",
        targetMuscle: "",
        description: "",
        video: "",
      });

      const form = new FormData();
      Object.keys(trimmedForm).forEach((key) => {
        form.append(key, trimmedForm[key]);
      });

      let url = workoutId
        ? `/admin/editWorkout/${workoutId}`
        : "/admin/addWorkout";
      await axiosInstance[workoutId ? "put" : "post"](url, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          console.log(res);

          if (res.status === 200) {
            setLoading(false);
            console.log("success  ");
            toast.success("Workout added successfully");
          }
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.status === 400) {
            setLoading(false);
            setError((prevError) => {
              return {
                ...prevError,
                video: "Uplaad a video file to continue",
              };
            });
          }
        });
    }
  };

  return (
    <div>
      <form
        className="flex h-screen justify-evenly items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-10">
          <div>
            {formData.videoUrl && (
              <ReactPlayer
                url={
                  typeof formData.videoUrl === "string"
                    ? formData.videoUrl
                    : URL.createObjectURL(formData.videoUrl)
                }
                controls
              />
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="video">Workout Tutorial video</Label>
            {typeof error.video === "string" && (
              <p className="text-red-500">{error.video}</p>
            )}
            <Input type="file" name="video" onChange={handleFileChange} />
            <Label htmlFor="workOutName">Workout Name</Label>
            {typeof error.workoutName === "string" && (
              <p className="text-red-500">{error.workoutName}</p>
            )}
            <Input
              value={formData.workoutName}
              placeholder="Workout Video name"
              type="text"
              name="workoutName"
              onChange={handleInputChange}
            />

            <Label className="targetMuscle">Target Muscle</Label>
            {typeof error.targetMuscle === "string" && (
              <p className="text-red-500">{error.targetMuscle}</p>
            )}
            <Input
              value={formData.targetMuscle}
              placeholder="Target Muscle"
              type="text"
              name="targetMuscle"
              onChange={handleInputChange}
            />
            <Label htmlFor="description">Description</Label>
            {typeof error.description === "string" && (
              <p className="text-red-500">{error.description}</p>
            )}
            <Input
              value={formData.description}
              placeholder="Description"
              type="text"
              name="description"
              onChange={handleInputChange}
            />
            <div className="flex justify-center">
              {loading ? (
                <Button className="w-full" disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button className="w-full" type="submit">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default SetWorkout;
