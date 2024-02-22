"use client";

import axiosInstance from "@/axios/creatingInstance";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { loadStripe } from "@stripe/stripe-js";
import { baseUrl } from "@/Utils/PortDetails";
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

  const makePayment = async () => {
    // console.log("payment done");

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );

    const body = {
      amount: 2500,
      plan: "premium",
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
      });
  }, []);
  return (
    <div>
    single trainer page from the user side
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
        }
        )}
        {trainer.certifications?.map((certification) => {
          return (
            <div key={certification._id}>
              <h1>certification name : {certification.name}</h1>
              <h1>certification content : {certification.content}</h1>
              <h1>certification photoUrl : {certification.photoUrl}</h1>
              <h1>certification publicId : {certification.publicId}</h1>
            </div>
          );
        }
        )}

      <Button onClick={makePayment}>Book Trainer</Button>
    </div>
  );
};

export default page;
