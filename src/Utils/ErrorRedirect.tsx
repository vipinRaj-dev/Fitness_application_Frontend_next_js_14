"use  client";
import { AxiosError } from "@/types/ErrorType";
import { useRouter } from "next/navigation";

const ErrorRedirectToSubscription = (err: AxiosError) => {
  const router = useRouter();
  if (err.response.status === 402) {
    router.replace("/user/subscriptions");
  }
  return <></>;
};

export default ErrorRedirectToSubscription;
