"use client";

import axiosInstance from "@/axios/creatingInstance";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import swal from "sweetalert";
import StarRatings from "react-star-ratings";

interface Trainer {
  transformationClientsCount: number;
  certificationsCount: number;
  description: string;
  email: string;
  experience: number;
  isBlocked: boolean;
  mobileNumber: number;
  name: string;
  price: number;
  profilePicture: string;
  publicId: string;
  specializedIn: string;
  _id: string;
  certifications: {
    _id: string;
    name: string;
    content: string;
    photoUrl: string;
    publicId: string;
  }[];

  transformationClients: {
    _id: string;
    name: string;
    content: string;
    photoUrl: string;
    publicId: string;
  }[];
}

type TrainerReviews = {
  _id: string;
  createdAt: string;
  content: string;
  rating: number;
  userId: {
    _id: string;
    name: string;
    profileImage: string;
  };
};

const TrainerHomePage = () => {
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);
  const [error, setError] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);
  const [reviews, setReviews] = useState<TrainerReviews[]>([]);

  const [rating, setRating] = useState<number>(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();

  // console.log("rating", rating);

  useEffect(() => {
    // Fetch data from the server
    const fetchTrainerData = async () => {
      await axiosInstance
        .get("trainer/profile")
        .then((res) => {
          // console.log("res.data", res.data);
          setTrainerData((prevState) => ({
            ...prevState,
            ...res.data.trainer,
            transformationClientsCount: res.data.transformationClientsCount,
            certificationsCount: res.data.certificationsCount,
            certifications: res.data.trainer.certifications,
            transformationClients: res.data.trainer.transformationClients,
          }));
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 404) {
            Cookies.remove("jwttoken");
            router.replace("/sign-in");
          }
        });
    };

    fetchTrainerData();
  }, [render]);

  useEffect(() => {
    const fetchReviews = async () => {
      axiosInstance
        .get("/trainer/reviews", {
          params: {
            page,
            limit,
            rating,
          },
        })
        .then((res) => {
          console.log("res.data", res.data);
          setReviews(res.data.reviews);
          setLimit(res.data.limit);
          setTotalPages(Math.ceil(res.data.totalReviews / res.data.limit));
        });
    };

    fetchReviews();
  }, [page, rating]);
  const handleCertficateSubmit = async (e: React.FormEvent, field: string) => {
    e.preventDefault();
    console.log("FIELD", field);
    const formData = new FormData();
    // console.log("formData", image, name, description, field);
    if (image) {
      formData.append("image", image);
    }
    formData.append("name", name);
    formData.append("content", description);
    formData.append("field", field);
    if (name.trim() === "" || description.trim() === "") {
      setError("Please fill all the fields");
    } else {
      setError("");
      setLoading(true);
      try {
        const response = await axiosInstance.put(
          "trainer/addCertificate",
          formData
        );
        // console.log("response", response);
        setRender(!render);
        setLoading(false);
        swal({
          title: "Success",
          text: `${field} added successfully`,
          icon: "success",
        });
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleDelete = async (
    e: React.FormEvent,
    {
      deleteId,
      field,
      publicId,
    }: {
      deleteId: string;
      field: string;
      publicId: string;
    }
  ) => {
    console.log("delete clicked", deleteId, field);
    e.preventDefault();

    axiosInstance
      .delete("trainer/deleteCertificateOrClient", {
        data: {
          deleteId,
          field,
          publicId,
        },
      })
      .then((res) => {
        // console.log("res", res.data);
        if (res.status === 200) {
          setRender(!render);
          swal({
            title: "Success",
            text: `${res.data.msg} successfully`,
            icon: "success",
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  return (
    <div>
      <div className=" pb-72 md:pb-96">
        <div className="w-full relative ">
          <div className="md:flex md:justify-center">
            <div className="p-3 md:w-10/12 flex justify-center">
              {/* <img
              className="md:w-full"
              src="/images/trainercover.png"
              alt="cover"
            /> */}

              {trainerData?.profilePicture && (
                <img
                  className="bg-cover bg-center rounded-3xl h-96 md:h-full "
                  src={trainerData.profilePicture}
                  alt="cover"
                />
              )}
            </div>
          </div>

          <div className="flex justify-center absolute w-11/12 top-60 left-5 md:top-3/4 md:left-20">
            <div className="md:w-9/12">
              <div className="bg-[#081E31] p-3 rounded-3xl w-full">
                <div className="flex justify-center">
                  <div>
                    <h1 className="text-2xl font-semibold md:text-4xl md:p-5 md:tracking-wide">
                      {trainerData?.name && trainerData.name}
                    </h1>
                    <p className="text-center font-light text-sm md:text-xl">
                      {trainerData?.specializedIn && trainerData.specializedIn}
                    </p>
                  </div>
                </div>

                <div className="flex mt-8 gap-2 md:gap-24 justify-center">
                  <div className="bg-slate-200 p-3 rounded-3xl md:p-10">
                    <h1 className="text-black text-center p-2 text-4xl md:text-7xl">
                      {trainerData?.experience && trainerData.experience}
                    </h1>
                    <h3 className="text-black text-sm p-1 md:text-2xl">
                      EXPERIENCE
                    </h3>
                  </div>
                  <div className="bg-slate-200 p-3 rounded-3xl px-6 md:p-10 md:px-16">
                    <h1 className="text-black text-center p-2 text-4xl md:text-7xl">
                      {trainerData?.transformationClientsCount &&
                        trainerData.transformationClientsCount}
                    </h1>
                    <h3 className="text-black text-sm p-1 md:text-2xl">
                      CLIENTS
                    </h3>
                  </div>
                  <div className="bg-slate-200 p-3 rounded-3xl md:p-10">
                    <h1 className="text-black text-center p-2 text-4xl md:text-7xl">
                      {trainerData?.certificationsCount &&
                        trainerData.certificationsCount}
                    </h1>
                    <h3 className="text-black text-sm p-1 md:text-2xl">
                      CERTIFICATE
                    </h3>
                  </div>
                </div>

                <div className="text-sm font-light p-4 tracking-normal leading-relaxed text-slate-200 mt-8 md:text-xl md:px-52">
                  <div className="mt-2 md:mt-8">
                    {trainerData?.description && trainerData.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* add Certificate */}
      <div>
        <div className="mt-10 md:mr-8 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button> Add Certificate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="p-5 text-center">
                  Add certificates
                </DialogTitle>
                <DialogDescription className="p-2 text-center">
                  Add the image and the details about the certification that you
                  had
                </DialogDescription>
                <p className="text-center text-red-600 text-xl">
                  {error ? error : ""}
                </p>
                <div className="grid gap-4 py-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Picture
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      className="col-span-3"
                      onChange={(e) =>
                        setImage(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      className="col-span-3"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      placeholder="Type your message here."
                      id="description"
                      className="col-span-3"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                {loading ? (
                  <Button disabled>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => handleCertficateSubmit(e, "certificate")}
                  >
                    Submit
                  </Button>
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="m-5 md:m-10">
          <div className="flex gap-3 overflow-y-hidden md:gap-9  pb-3  scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
            {trainerData?.certifications &&
              trainerData.certifications.map((certificate) => (
                <div
                  key={certificate._id}
                  className="flex-shrink-0 bg-slate-900 rounded-2xl w-52 h-96 md:w-96"
                >
                  <img
                    src={certificate.photoUrl}
                    alt="certificate"
                    className="w-full h-64 rounded-3xl object-cover mx-auto p-1 md:p-3"
                  />
                  <div className="flex justify-between m-1 px-2 md:px-5">
                    <h1 className="text-white text-start md:text-2xl font-semibold">
                      {certificate.name}
                    </h1>
                    <Badge
                      onClick={(e) =>
                        handleDelete(e, {
                          deleteId: certificate._id,
                          field: "certificate",
                          publicId: certificate.publicId,
                        })
                      }
                      variant="destructive"
                    >
                      Delete
                    </Badge>
                  </div>
                  <div className="w-48 md:w-80  h-20 mx-auto overflow-y-scroll  scrollbar-none overflow-x-hidden">
                    <p className="text-white md:text-base font-light text-start text-sm mt-2">
                      {certificate.content}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-10 md:mr-8 flex  justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Clients</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="p-5 text-center">
                Add Transformation Clients
              </DialogTitle>
              <DialogDescription className="p-2 text-center">
                Add the image and the details about the Transformation client
                that you had
              </DialogDescription>
              <p className="text-center text-red-600 text-xl">
                {error ? error : ""}
              </p>
              <div className="grid gap-4 py-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Picture
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    className="col-span-3"
                    onChange={(e) =>
                      setImage(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    className="col-span-3"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Type your message here."
                    id="description"
                    className="col-span-3"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              {loading ? (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button onClick={(e) => handleCertficateSubmit(e, "client")}>
                  Submit
                </Button>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="m-5 md:m-10">
        <div className="flex gap-3 overflow-y-hidden md:gap-9  pb-3  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
          {trainerData?.transformationClients &&
            trainerData.transformationClients.map((client) => (
              <div
                key={client._id}
                className="flex-shrink-0 bg-slate-900 rounded-2xl w-52 h-96 md:w-96"
              >
                <img
                  src={client.photoUrl}
                  alt="client"
                  className="w-full h-64 rounded-3xl object-cover mx-auto p-1 md:p-3"
                />
                <div className="flex justify-between m-1 px-2 md:px-5">
                  <h1 className="text-white text-start md:text-2xl font-semibold">
                    {client.name}
                  </h1>
                  <Badge
                    onClick={(e) =>
                      handleDelete(e, {
                        deleteId: client._id,
                        field: "client",
                        publicId: client.publicId,
                      })
                    }
                    variant="destructive"
                  >
                    Delete
                  </Badge>
                </div>
                <div className="w-48 md:w-80  h-20 mx-auto overflow-y-scroll  scrollbar-none overflow-x-hidden">
                  <p className="text-white md:text-base font-light text-start text-sm mt-2">
                    {client.content}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="m-5 md:m-10">
        <div>
          <div className="flex justify-between">
            <div className="flex gap-5 items-center mb-10">
              <div>
                <h1 className="text-2xl font-semibold text-center">Reviews</h1>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"}>Filter Rating</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel> Star Rating </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {[5, 4, 3, 2, 1].map((rating) => (
                      <DropdownMenuItem
                        key={rating}
                        onSelect={() => {
                          setRating(rating);
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
            <div className="flex justify-end">
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
          {reviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-slate-900 p-4 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.userId.profileImage}
                      alt="profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <h1 className="text-white text-xl font-semibold">
                      {review.userId.name}
                    </h1>
                    <div className="text-white text-lg mt-2">
                      {
                        <StarRatings
                          rating={review.rating}
                          starRatedColor="yellow"
                          starDimension="15px"
                          starSpacing="2px"
                          starHoverColor="yellow"
                          starEmptyColor="white"
                          numberOfStars={5}
                          name="rating"
                        />
                      }
                    </div>
                  </div>
                  <p className="text-white text-sm mt-2">{review.content}</p>
                  <div className="flex justify-end">
                    <h1 className="text-white text-opacity-40 text-sm font-semibold">
                      {new Date(review.createdAt).toLocaleDateString("en-GB")}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-2xl  font-semibold text-center">No Reviews</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerHomePage;
