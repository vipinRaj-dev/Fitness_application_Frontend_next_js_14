import SignInForm from "@/components/form/SignInForm";
import Image from "next/image";

const Signin = () => {
  return (
    <div className="flex justify-center items-center min-h-screen ">
     <div className="border-2 border-cyan-100 p-2 flex rounded-lg w-7/12">
     <div className="rounded-lg overflow-hidden hidden lg:block shadow-l">
        <Image
          alt="dummyimage"
          src={"/images/loginpic.png"}
          width={500}
          height={500}
          className="object-cover"
        ></Image>
      </div>
      <div className="flex justify-center items-center m-4 w-full lg:w-1/2 lg:ml-8" >
        <SignInForm />
      </div>
     </div>
    </div>
  );
};

export default Signin;
