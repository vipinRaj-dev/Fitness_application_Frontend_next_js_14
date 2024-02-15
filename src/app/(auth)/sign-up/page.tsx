import SignUpForm from "@/components/form/SignUpForm";
import Image from "next/image";

const SignUp = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 border-cyan-100 p-2 flex rounded-lg w-7/12">
      <div className="rounded-lg overflow-hidden hidden lg:block shadow-lg">
        <Image
          alt="dummyimage"
          src={"/images/signuppageimg.png"}
          width={400}
          height={500}
          className="object-cover"
        ></Image>
      </div>
      <div className="flex justify-center items-center m-4 w-full lg:w-1/2 lg:ml-10">
        <SignUpForm />
      </div>
      </div>
    </div>
  );
};

export default SignUp;
