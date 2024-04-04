import UserProfile from "@/components/adminRoutes/UserProfile";

const Page= ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const userId = params.userId;
  // console.log("this is the user id from the parmas ", userId);

  return (
    <div>
      view user profile page
      <UserProfile userId={userId} />
    </div>
  );
};

export default Page;
