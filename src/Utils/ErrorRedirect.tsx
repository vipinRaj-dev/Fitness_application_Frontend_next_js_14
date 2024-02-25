// export const redirectToSubscriptions = (err: any) => {
//   if (err.response.status === 402) {
//     router.replace("/user/subscriptions");
//   }
// };
"use  client";
import { useRouter } from "next/navigation";


const ErrorRedirectToSubscription = (err: any) => {
  const router = useRouter();
  if (err.response.status === 402) {
    router.replace("/user/subscriptions");
  }
  return <></>;
};

export default ErrorRedirectToSubscription;
