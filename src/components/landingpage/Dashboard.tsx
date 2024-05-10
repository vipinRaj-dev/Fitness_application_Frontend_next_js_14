"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";

import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import { baseUrl } from "@/Utils/PortDetails";
import { useRouter } from "next/navigation";
import Dnaspinner from "../loadingui/Dnaspinner";
import { CheckCircle, IndianRupee, Star } from "lucide-react";
const Dashboard = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const myCookie = Cookies.get("jwttoken");
    // console.log('cookie printiing     ' , myCookie)
    if (myCookie) {
      // console.log('yes cookie is there ', myCookie)
      axios
        .get(`${baseUrl}/auth/role`, {
          headers: {
            Authorization: `Bearer ${myCookie}`,
          },
        })
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        })
        .catch(function (error) {
          setError(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      // console.log('yes i am getting the role page' , role)
      switch (role) {
        case "admin":
          router.push("/admin");
          break;
        case "user":
          router.push("/user");
          break;
        case "trainer":
          router.push("/trainer");
          break;
      }
    }
  }, [role, loading]);

  if (loading) {
    return (
      <div>
        <Dnaspinner />
      </div>
    ); // Replace this with your loading component or any placeholder content
  }

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  if (role === "") {
    return (
      <div className="w-full h-screen">
        <header className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-screen-md   bg-slate-800  py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div className="flex shrink-0">
                <h1 className="text-xl text-white">VIGOR</h1>
              </div>
              <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
                <Link href="/"> About</Link>
                <Link href="/"> Pricing</Link>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Link href="/sign-in">
                  <Button className="bg-blue-500">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant={"ghost"} className="text-black">
                    Sign-up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="h-screen mt-20 md:flex flex-col md:flex-row justify-evenly items-center">
            <div className=" md:w-1/2">
              <div className="flex md:justify-center justify-start ml-10">
                <div>
                  <h1 className="text-4xl md:text-7xl font-sans font-medium leading-normal mb-3">
                    Helps for your <br /> ideal body fitness
                  </h1>
                  <p className="md:font-normal">
                    Motivate users with benefits and positive reinforcement,
                    <br /> and offer modifications and progress tracking.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col md:flex-row">
              <div className="flex flex-col justify-end relative">
                <div className="rotate-[270deg] absolute top-48 left-16">
                  <h1 className=" md:text-8xl opacity-30 tracking-wider font-extrabold text-slate-600">
                    Fitness
                  </h1>
                </div>
                <img
                  className="hidden md:block"
                  src={"/images/Dumbell.svg"}
                  alt="dumbellImage"
                />
              </div>
              <div className="flex justify-center z-10">
                <img src={"/images/landingpage.svg"}></img>
              </div>
            </div>
          </div>
          <div className="relative">
            <div>
              <h1 className=" text-6xl  md:text-8xl absolute left-[-18px] font-extrabold opacity-30 text-slate-600">
                Program
              </h1>
            </div>
            <h1 className="text-center text-3xl md:text-5xl p-10">
              Explore Our Program
            </h1>
          </div>

          <div>
            <div className="md:flex justify-center items-center gap-10 ">
              <div className="bg-blue-600 m-5 md:w-2/12 h-60 rounded-2xl p-8">
                <img src={"/images/cardio_strength.svg"} alt="program1" />
                <h1 className=" mt-4 text-2xl font-semibold">
                  Cardio Strength
                </h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  venenatis, nunc a pretium viverra.
                </p>
              </div>
              <div className=" m-5 md:w-2/12 h-60 rounded-2xl p-8">
                <img src={"/images/fatloose.svg"} alt="program1" />
                <h1 className=" mt-4 text-2xl font-semibold">Fat lose</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  venenatis, nunc a pretium viverra.
                </p>
              </div>

              <div className=" m-5 md:w-2/12 h-60 rounded-2xl p-8">
                <img src={"/images/cardio.svg"} alt="program1" />
                <h1 className=" mt-4 text-2xl font-semibold">Musle Gain</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  venenatis, nunc a pretium viverra.
                </p>
              </div>
              <div className=" m-5 md:w-2/12 h-60 rounded-2xl p-8">
                <img src={"/images/nutrition.svg"} alt="program1" />
                <h1 className=" mt-4 text-2xl font-semibold">Nutritions</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  venenatis, nunc a pretium viverra.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center h-screen relative ">
            <div className=" w-full p-44">
              <div className="relative">
                <div>
                  <img src={"images/secondmainpageone.png"} alt="" />
                </div>

                <div className="absolute top-1/3 left-80">
                  <img src={"images/secondmainpagetwo.png"} alt="" />
                </div>

                <div className="absolute mt-2 left-24">
                  <img src={"images/secondmainpagethree.png"} alt="" />
                </div>
              </div>
            </div>

            <div className=" w-full flex flex-col justify-center items-center">
              <div>
                <h1 className="font-bold text-6xl leading-normal">
                  Transform your <br />
                  physique with our <br /> fitness plan.
                </h1>
              </div>

              <div className="leading-loose mt-4">
                <p>* Increase Muscle and Strength</p>
                <p>* Be Healthier than before</p>
                <p>* Increase Stamina</p>

                <div>
                  <Button className="bg-blue-500 mr-5">Get Started</Button>
                  <Button variant={"ghost"}>Contact us</Button>
                </div>
              </div>
            </div>
            <div className="absolute top-3/4">
              <img src={"images/Trademill.svg"} alt="" />
            </div>
          </div>
          <div
            className="flex justify-center
           mt-28"
          >
            <div className="w-3/4 bg-slate-600 flex justify-between border-2 rounded-lg h-40 p-10">
              <div className="text-2xl flex items-center font-medium">
                Enhance user experience with healthy nutrition tips, <br />{" "}
                support resources, and social elements.
              </div>

              <div className="flex items-center">
                <Button className="bg-blue-500">Get Started</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-40 h-screen">
            <div>
              <p className="text-blue-400 font-semibold text-lg text-center">
                Pricing
              </p>
              <h1 className="font-bold text-5xl p-4">Our List Packages</h1>
            </div>

            <div className="flex  w-1/2 h-5/6 items-center gap-5 p-5">
              <div className=" w-1/2 h-5/6 flex justify-center items-center">
                <div className="bg-slate-500 h-full w-5/6 p-4 space-x-5 space-y-8 rounded-3xl">
                  <p className="font-semibold text-xl text-blue-400">
                    Basic Package
                  </p>
                  <h1 className="text-6xl font-semibold">Free</h1>
                  <div className="flex gap-2 text-slate-600">
                    <p>per month,bill annualy</p>
                  </div>
                  <div className="space-y-7">
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>Unlimited Gym Access</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>2x Fitness Consultant</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>Nutrition Tracking</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>1x Free Suplement</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>3 Days per week</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>Personal Trainer</p>
                    </div>
                  </div>
                  <div className="flex justify-center p-7">
                    <Button className="bg-blue-500 w-56 rounded-xl text-white">
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>

              <div className=" w-1/2 h-full flex justify-center items-center">
                <div className="bg-blue-600 h-full w-full  space-x-5 space-y-3 rounded-3xl relative overflow-hidden ">
                  <div className="flex justify-between items-center ">
                    <p className="font-semibold text-xl text-white ml-6 mt-16">
                      Premium Package
                    </p>
                    <div className="flex justify-center items-center">
                      <div className="rotate-45 bg-white w-72  text-xl p-5 absolute top-10 left-64">
                        <h1 className="text-black font-semibold ml-14">
                          Best Offers
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="flex p-5">
                    <IndianRupee size={60} />
                    <h1 className="text-6xl font-semibold">2000</h1>
                  </div>
                  <div className="flex gap-2 text-white">
                    <p>per month,bill annualy</p>
                  </div>
                  <div className="space-y-7">
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>Unlimited Gym Access</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>2x Fitness Consultant</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>Nutrition Tracking</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>1x Free Suplement</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>3 Days per week</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>Personal Trainer</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>Nutrition Tracking</p>
                    </div>
                    <div className="flex gap-3 font-semibold tracking-wide">
                      <CheckCircle />
                      <p>3 Days per week</p>
                    </div>
                  </div>
                  <div className="flex justify-center p-7">
                    <Button className="bg-black w-56 rounded-xl p-8 text-white">
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-screen">
            <div className=" flex justify-center h-3/6 relative">
              <div className=" flex w-5/6 p-10">
                <div className="w-1/2 ">
                  <div className="absolute text-slate-500 font-semibold opacity-35 text-8xl top-0 left-[-130px]">
                    Testimonial
                  </div>
                  <div className=" flex h-full">
                    <div className="text-4xl z-30 font-semibold leading-relaxed tracking-wider">
                      <h1>
                        What <br /> Our Members <br /> Say About Us?
                      </h1>
                    </div>
                  </div>
                </div>

                <div className=" w-1/2 flex justify-center items-center">
                  <Carousel className=" w-4/6 h-4/6 p-8 border-2 rounded-2xl border-slate-400 bg-slate-900">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="space-y-6">
                          <div className="flex justify-end">
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                          </div>
                          <div>
                            <p className="text-sm">
                              “ Join this fitness member, the best choice that
                              I’ve. They’re very professional and give you
                              suggestion about what food and nutrition that you
                              can eat”
                            </p>
                          </div>
                          <div className="flex p-2">
                            <div>
                              <img src={"images/testmo1.png"} alt="testmo" />
                            </div>
                            <div className="flex items-center p-2">
                              <div>
                                <h1>Name</h1>
                                <p>Office Worker</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="space-y-6">
                          <div className="flex justify-end">
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                          </div>
                          <div>
                            <p className="text-sm">
                              “ Join this fitness member, the best choice that
                              I’ve. They’re very professional and give you
                              suggestion about what food and nutrition that you
                              can eat”
                            </p>
                          </div>
                          <div className="flex p-2">
                            <div>
                              <img src={"images/testmo2.png"} alt="testmo" />
                            </div>
                            <div className="flex items-center p-2">
                              <div>
                                <h1>Name</h1>
                                <p>Office Worker</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="space-y-6">
                          <div className="flex justify-end">
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                            <h1>
                              <Star
                                color="#FFA800"
                                strokeWidth={3}
                                absoluteStrokeWidth
                              />
                            </h1>
                          </div>
                          <div>
                            <p className="text-sm">
                              “ Join this fitness member, the best choice that
                              I’ve. They’re very professional and give you
                              suggestion about what food and nutrition that you
                              can eat”
                            </p>
                          </div>
                          <div className="flex p-2">
                            <div>
                              <img src={"images/testmo3.png"} alt="testmo" />
                            </div>
                            <div className="flex items-center p-2">
                              <div>
                                <h1>Name</h1>
                                <p>Office Worker</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselNext className="bg-white text-black" />
                  </Carousel>
                </div>
              </div>
            </div>
            <div className="h-1/6 flex justify-center ">
              <img src={"images/weightPlates.svg"} alt="plate" />
            </div>
            <div className=" h-2/6 text-center flex justify-center">
              <div className=" bg-blue-500 h-4/6 w-4/6 flex flex-col justify-center border-2 rounded-2xl">
                <h1 className="text-xl font-semibold">
                  Subscribe our fitness tips
                </h1>
                <p>
                  Clearly communicate the benefits of subscribing,
                  <br /> such as exclusive content and <br /> breaking news.
                </p>
                <div className="flex justify-center">
                  <div className="flex justify-center  w-5/6 mt-3">
                    <Input
                      type={"email"}
                      className="w-3/6 bg-white outline-none border-none shadow-2xl "
                      placeholder="Enter the email"
                    />
                    <Button className="bg-black text-white">Subscribe</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer>
            <div className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
              <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <a
                    href="/"
                    aria-label="Go home"
                    title="Company"
                    className="inline-flex items-center"
                  >
                    <svg
                      className="w-8 text-deep-purple-accent-400"
                      viewBox="0 0 24 24"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      stroke="currentColor"
                      fill="none"
                    >
                      <rect x="3" y="1" width="7" height="12"></rect>
                      <rect x="3" y="17" width="7" height="6"></rect>
                      <rect x="14" y="1" width="7" height="6"></rect>
                      <rect x="14" y="11" width="7" height="12"></rect>
                    </svg>
                    <span className="ml-2 text-xl font-bold tracking-wide text-white uppercase">
                      Company
                    </span>
                  </a>
                  <div className="mt-6 lg:max-w-sm">
                    <p className="text-sm text-white">
                      Sed ut perspiciatis unde omnis iste natus error sit
                      voluptatem accusantium doloremque laudantium, totam rem
                      aperiam.
                    </p>
                    <p className="mt-4 text-sm text-white">
                      Eaque ipsa quae ab illo inventore veritatis et quasi
                      architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-base font-bold tracking-wide text-gray-400">
                    Contacts
                  </p>
                  <div className="flex">
                    <p className="mr-1 text-white">Phone:</p>
                    <a
                      href="tel:850-123-5021"
                      aria-label="Our phone"
                      title="Our phone"
                      className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800"
                    >
                      850-123-5021
                    </a>
                  </div>
                  <div className="flex">
                    <p className="mr-1 text-white">Email:</p>
                    <a
                      href="mailto:info@lorem.mail"
                      aria-label="Our email"
                      title="Our email"
                      className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800"
                    >
                      info@lorem.mail
                    </a>
                  </div>
                  <div className="flex">
                    <p className="mr-1 text-white">Address:</p>
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Our address"
                      title="Our address"
                      className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800"
                    >
                      312 Lovely Street, NY
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-base font-bold tracking-wide text-gray-400">
                    Social
                  </span>
                  <div className="flex items-center mt-1 space-x-3">
                    <a
                      href="/"
                      className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                        <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"></path>
                      </svg>
                    </a>
                    <a
                      href="/"
                      className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
                    >
                      <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                        <circle cx="15" cy="15" r="4"></circle>
                        <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"></path>
                      </svg>
                    </a>
                    <a
                      href="/"
                      className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                        <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"></path>
                      </svg>
                    </a>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Bacon ipsum dolor amet short ribs pig sausage prosciutto
                    chicken spare ribs salami.
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
                <p className="text-sm text-gray-600">
                  © Copyright 2020 Lorem Inc. All rights reserved.
                </p>
                <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
                  <li>
                    <a
                      href="/"
                      className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400"
                    >
                      F.A.Q
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400"
                    >
                      Terms &amp; Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>
        </footer>
      </div>
    );
  }
};

export default Dashboard;
