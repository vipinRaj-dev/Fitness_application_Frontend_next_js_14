"use client";

import axiosInstance from "@/axios/creatingInstance";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";
import { baseUrl } from "@/Utils/PortDetails";

import { useRouter } from "next/navigation";

type ClientsAndCertificate = {
  _id: string;
  name: String;
  content: String;
  photoUrl: String;
  publicId: String;
};

type Trainer = {
  _id: number;
  name: string;
  email: string;
  experience: number;
  specializedIn: string;
  description: string;
  profilePicture: string;
  price: number;
  transformationClients: ClientsAndCertificate[];
  certifications: ClientsAndCertificate[];
};

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
      const result: any = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.log(result.error.message);
      }
    }
  };

  const [trainer, setTrainer] = useState<Trainer>({} as Trainer);

  useEffect(() => {
    axiosInstance
      .get(`/user/getTrainer/${params.trainedId}`)
      .then((res) => {
        console.log(res.data.trainer);
        setTrainer(res.data.trainer);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 402) {
          router.replace("/user/subscription");
        }
      });
  }, []);
  return (
    <div>
      {/* single trainer page from the user side
      <h1>name : {trainer.name}</h1>
      <h1>email : {trainer.email}</h1>
      <h1>experience : {trainer.experience}</h1>
      <h1>specializedIn : {trainer.specializedIn}</h1>
      <h1>description : {trainer.description}</h1>
      <h1>price : {trainer.price}</h1>
      <h1>profilePicture : {trainer.profilePicture}</h1>
      {trainer.transformationClients?.map((client) => {
        return (
          <div key={client._id}>
            <h1>client name : {client.name}</h1>
            <h1>client content : {client.content}</h1>
            <h1>client photoUrl : {client.photoUrl}</h1>
            <h1>client publicId : {client.publicId}</h1>
          </div>
        );
      })}
      {trainer.certifications?.map((certification) => {
        return (
          <div key={certification._id}>
            <h1>certification name : {certification.name}</h1>
            <h1>certification content : {certification.content}</h1>
            <h1>certification photoUrl : {certification.photoUrl}</h1>
            <h1>certification publicId : {certification.publicId}</h1>
          </div>
        );
      })} */}

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
                      <h1 className="text-white text-start md:text-2xl font-semibold">
                        {certificate.name}
                      </h1>
                     
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
         
        </div>

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
                    <h1 className="text-white text-start md:text-2xl font-semibold">
                      {client.name}
                    </h1>
                   
                  </div>
                  <div className="w-48 md:w-80  h-20 mx-auto overflow-y-scroll  scrollbar-none overflow-x-hidden">
                    <p className="text-white md:text-base font-light text-start text-sm mt-2">
                      {client.content}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-center mt-10 ">
            <Button
            size={"lg"}
            className="px-20 py-8"
              onClick={() => makePayment({ amount: trainer.price })}
            >
             <h1 className="text-xl font-semibold"> Buy Trainer @ {trainer && trainer.price}/-</h1>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
