"use client";

import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import Cookies from "js-cookie";
import { baseUrl } from "@/Utils/PortDetails";

const Page= () => {


  const makePayment = async ({
    plan,
    amount,
  }: {
    plan: string;
    amount: number;
  }) => {
    // console.log("payment done");

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );

    const body = {
      amount: amount,
      plan: plan,
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


  return (
    <div className="">
      <div className=" p-10">
        <div className="flex flex-wrap h-screen items-center justify-center max-w-6xl mx-auto gap-1">
          <div className="w-full p-6 bg-black border border-gray-700 rounded-lg sm:w-1/2 bg-opacity-20 sm:rounded-r-none sm:p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold jakarta text-gray-100 sm:text-4xl">
                Free Plan
              </h3>
            </div>
            <div className="mb-4 space-x-2">
              <span className="text-4xl font-bold text-gray-100">
                &#8377; 300/month
              </span>
            </div>
            <ul className="mb-6 space-y-2 text-gray-300">
              <li className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="">One Project</span>
              </li>
              <li className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="">Limited Designs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="">Basic Settings</span>
              </li>
            </ul>
            <Link href="">
              <Button onClick={() => makePayment({ plan: 'Monthly plan', amount: 300 })} className="block px-8 text-sm font-semibold text-center text-white transition duration-100 bg-white rounded-lg outline-none bg-opacity-20 hover:bg-opacity-30 md:text-base">
                Subscribe for one month
              </Button>
            </Link>
          </div>

          <div className="w-full p-6 rounded-lg shadow-xl sm:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 mb-6 lg:flex-row">
              <div>
                <h3 className="text-2xl font-semibold text-white jakarta sm:text-4xl">
                  Pro Plan
                </h3>
              </div>
              <span className="order-first inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase bg-black rounded-full lg:order-none bg-opacity-20">
                Go Pro
              </span>
            </div>
            <div className="mb-4 space-x-2">
              <span className="text-4xl font-bold text-white">
                &#8377; 1500/month
              </span>
              <span className="text-2xl text-indigo-100 line-through">
                &#8377; 1800/month
              </span>
            </div>
            <ul className="mb-6 space-y-2 text-indigo-100">
              <li className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="">Unlimited Projects</span>
              </li>
              <li className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="">Unlimited API calls</span>
              </li>
              <li className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                    className=""
                  ></path>
                </svg>
                <span className="">Advanced Project Settings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="">Priority Support</span>
              </li>
            </ul>
            <Link href="">
              <Button onClick={() => makePayment({ plan: '6-month plan', amount: 1500 })} className="block px-8 text-sm font-semibold text-center text-white transition duration-100 bg-white rounded-lg outline-none bg-opacity-20 hover:bg-opacity-30 md:text-base">
                Subscribe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
