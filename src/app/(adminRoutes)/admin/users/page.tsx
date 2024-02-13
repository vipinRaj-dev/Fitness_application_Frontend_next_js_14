import Link from "next/link";
import AllUsers from "@/components/adminRoutes/AllUsers";

const page = () => {
  return (
    <div>
      This is the admin users page    
      <Link className="text-blue-700" href="/admin/users/create">Create User</Link>
      <AllUsers />
    </div>
  );
};

export default page;
 