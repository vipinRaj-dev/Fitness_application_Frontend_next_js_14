"use client";
import axiosInstance from "@/axios/creatingInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { Label } from "@/components/ui/label";
import { z } from "zod";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type FormType = {
  workoutName: string;
  targetMuscle: string;
  description: string;
  video: File | string;
  videoUrl?: string;
};

const createSchema = (minLength: number, errorMessage: string) => {
  return z.string().min(minLength, errorMessage)
    .refine(value => !/,+/.test(value), "No consecutive commas allowed")
    .refine(value => value.trim() === value, "No leading or trailing spaces allowed")
    .refine(value => value === value.replace(/\s+/g, ' '), "No multiple spaces allowed")
    .refine(value => /^[a-zA-Z, ]*$/.test(value), "Only Characters, Spaces, and Commas are allowed")
    .refine(value => value === value.replace(/\s*,\s*/g, ','), "No multiple spaces or commas allowed");
}
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
  const [progress, setProgress] = useState(0);
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
          console.log(res.data.workoutData);
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
    console.log(formData);

    const result = schema.safeParse(formData);

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
      setError({
        workoutName: "",
        targetMuscle: "",
        description: "",
        video: "",
      });
      // Start the "fake" progress bar
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            return 100;
          }
          const newProgress = oldProgress + 2;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
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

          setProgress(100);
          clearInterval(timer);
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.status === 400) {
            setError((prevError) => {
              return {
                ...prevError,
                video: "Uplaad a video file to continue",
              };
            });
          }
          setProgress(0);
          clearInterval(timer);
        });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {formData.videoUrl && (
          <ReactPlayer
            url={
              typeof formData.videoUrl === "string"
                ? formData.videoUrl
                : URL.createObjectURL(formData.videoUrl)
            }
            controls
            width="100%"
            height="400px"
          />
        )}
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

        <Button type="submit">Submit</Button>
      </form>

      <div className="w-32 h-32">
        <CircularProgressbar value={progress} text={`${progress}%`} />
      </div>
    </div>
  );
};

export default SetWorkout;
