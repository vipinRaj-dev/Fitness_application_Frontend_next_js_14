import SignInForm from "@/components/form/SignInForm";
import Image from "next/image";

const Signin = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-lg overflow-hidden hidden lg:block shadow-lg">
        <Image
          alt="dummyimage"
          src={"/images/loginpic.png"} 
          width={400}
          height={500}
          className="object-cover"
        ></Image>
        </div>
      <div className="m-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
        <SignInForm />
      </div>
    </div>
  );
};

export default Signin;