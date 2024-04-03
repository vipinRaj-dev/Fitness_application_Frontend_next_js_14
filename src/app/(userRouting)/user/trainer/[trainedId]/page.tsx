"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axiosInstance from "@/axios/creatingInstance";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";
import { baseUrl } from "@/Utils/PortDetails";
import { Link as ScrollLink } from "react-scroll";
import { useRouter } from "next/navigation";
import StarRatings from "react-star-ratings";

import { Trainer } from "@/types/TrainerTypes";
import { TrainerReviews } from "@/types/TrainerTypes";

const page = ({
  params,
}: {
  params: {
    trainedId: string;
  };
}) => {
  const router = useRouter();

  const makePayment = async (amount: { amount: number }) => {
    // console.log("payment done");

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );

    // console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' , process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    const body = {
      amount: amount.amount,
      plan: "Trainer purchase",
      trainerId: params.trainedId,
    };
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${Cookies.get("jwttoken")}`,
    };

    const response = await fetch(`${baseUrl}/user/create-checkout-session`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const session = await response.json();
    if (stripe) {
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.log(result.error.message);
      }
    }
  };

  const [trainer, setTrainer] = useState<Trainer>({} as Trainer);
  const [reviews, setReviews] = useState<TrainerReviews[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axiosInstance
      .get(`/user/getTrainer/${params.trainedId}`)
      .then((res) => {
        // console.log(res.data.trainer);
        setTrainer(res.data.trainer);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 402) {
          router.replace("/user/subscription");
        }
      });
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      axiosInstance
        .get("/trainer/reviews", {
          params: {
            page,
            limit,
            rating,
            trainerId: params.trainedId,
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
  return (
    <div>
      <div>
        <div className=" pb-72 md:pb-96">
          <div className="w-full relative ">
            <div className="md:flex md:justify-center">
              <div className="p-3 md:w-10/12 flex justify-center">
                {trainer?.profilePicture && (
                  <img
                    className="bg-cover bg-center rounded-3xl h-96 md:h-full "
                    src={trainer.profilePicture}
                    alt="cover"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center absolute w-11/12 top-60 left-5 md:top-3/4 md:left-20">
              <div className="md:w-9/12">
                <div className="bg-[#081E31] p-3 rounded-3xl w-full">
                  <ScrollLink to="ratingSection" smooth={true} duration={800}>
                    <StarRatings
                      rating={trainer.avgRating}
                      starRatedColor="yellow"
                      starDimension="15px"
                      starSpacing="2px"
                      starHoverColor="yellow"
                      starEmptyColor="white"
                      numberOfStars={5}
                      name="rating"
                    />
                    <h1>Star Ratings</h1>
                  </ScrollLink>
                  <div className="flex justify-center">
                    <div>
                      <h1 className="text-2xl font-semibold md:text-4xl md:p-5 md:tracking-wide">
                        {trainer?.name && trainer.name}
                      </h1>
                      <p className="font-light text-sm md:text-xl">
                        {trainer?.specializedIn && trainer.specializedIn}
                      </p>
                    </div>
                  </div>

                  <div className="flex mt-8 gap-2 md:gap-24 justify-center">
                    <div className="bg-slate-200 p-3 rounded-3xl md:p-10">
                      <h1 className="text-black text-center p-2 text-4xl md:text-7xl">
                        {trainer?.experience && trainer.experience}
                      </h1>
                      <h3 className="text-black text-sm p-1 md:text-2xl">
                        EXPERIENCE
                      </h3>
                    </div>
                    <div className="bg-slate-200 p-3 rounded-3xl px-6 md:p-10 md:px-16">
                      <h1 className="text-black text-center p-2 text-4xl md:text-7xl">
                        {trainer?.transformationClients &&
                          trainer.transformationClients.length}
                      </h1>
                      <h3 className="text-black text-sm p-1 md:text-2xl">
                        CLIENTS
                      </h3>
                    </div>
                    <div className="bg-slate-200 p-3 rounded-3xl md:p-10">
                      <h1 className="text-black text-center p-2 text-4xl md:text-7xl">
                        {trainer?.certifications &&
                          trainer.certifications.length}
                      </h1>
                      <h3 className="text-black text-sm p-1 md:text-2xl">
                        CERTIFICATE
                      </h3>
                    </div>
                  </div>

                  <div className="text-sm font-light p-4 tracking-normal leading-relaxed text-slate-200 mt-8 md:text-xl md:px-52">
                    <div className="mt-2 md:mt-8">
                      {trainer?.description && trainer.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="m-5 md:m-10">
            <div className="flex gap-3 overflow-y-hidden md:gap-9  pb-3  scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
              {trainer?.certifications &&
                trainer.certifications.map((certificate) => (
                  <div
                    key={certificate._id}
                    className="flex-shrink-0 bg-slate-900 rounded-2xl w-52 h-96 md:w-96"
                  >
                    <img
                      src={certificate.photoUrl as string}
                      alt="certificate"
                      className="w-full h-64 rounded-3xl object-cover mx-auto p-1 md:p-3"
                    />
                    <div className="flex justify-between m-1 px-2 md:px-5">
                      <h1 className="text-white text-start md:text-2xl font-semibold truncate">
                        {certificate.name}
                      </h1>
                    </div>
                    <div className="w-48 md:w-80  h-20 mx-auto overflow-hidden">
                      <p className="text-white md:text-base font-light text-start text-sm mt-2">
                        <AlertDialog>
                          <AlertDialogTrigger>
                            {certificate.content}
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Description</AlertDialogTitle>
                              <AlertDialogDescription>
                                <p className=" w-96 mx-auto break-words">
                                  {certificate.content}
                                </p>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Back</AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-10 md:mr-8 flex  justify-end"></div>

        <div className="m-5 md:m-10">
          <div className="flex gap-3 overflow-y-hidden md:gap-9  pb-3  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-950">
            {trainer?.transformationClients &&
              trainer.transformationClients.map((client) => (
                <div
                  key={client._id}
                  className="flex-shrink-0 bg-slate-900 rounded-2xl w-52 h-96 md:w-96"
                >
                  <img
                    src={client.photoUrl as string}
                    alt="client"
                    className="w-full h-64 rounded-3xl object-cover mx-auto p-1 md:p-3"
                  />
                  <div className="flex justify-between m-1 px-2 md:px-5">
                    <h1 className="text-white text-start md:text-2xl font-semibold truncate">
                      {client.name}
                    </h1>
                  </div>
                  <div className="w-48 md:w-80  h-20 mx-auto overflow-hidden">
                    <p className="text-white md:text-base font-light text-start text-sm mt-2">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          {client.content}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Description</AlertDialogTitle>
                            <AlertDialogDescription>
                              <p className=" w-96 mx-auto break-words">
                                {client.content}
                              </p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Back</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                <div id="ratingSection">
                  <h1 className="text-2xl font-semibold text-center">
                    Reviews
                  </h1>
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
                  <div
                    key={review._id}
                    className="bg-slate-900 p-4 rounded-3xl"
                  >
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
                    <p className="text-white text-sm mt-2 truncate">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          {review.content}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              {review.content}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Back</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </p>
                    <div className="flex justify-end">
                      <h1 className="text-white text-opacity-40 text-sm font-semibold">
                        {new Date(review.createdAt).toLocaleDateString("en-GB")}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <h1 className="text-2xl  font-semibold text-center">
                No Reviews
              </h1>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-10 ">
          <Button
            size={"lg"}
            className="px-20 py-8"
            onClick={() => makePayment({ amount: trainer.price })}
          >
            <h1 className="text-xl font-semibold">
              Buy Trainer @ {trainer && trainer.price}/-
            </h1>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
