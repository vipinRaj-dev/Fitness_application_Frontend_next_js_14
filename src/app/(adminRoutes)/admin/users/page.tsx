import Link from "next/link";
import AllUsers from "@/components/adminRoutes/AllUsers";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div>
      <h1 className=" text-center p-5">All Users</h1>
      <div id="search-bar" className="max-w-full rounded-md shadow-lg z-10">
        <form className="flex items-center justify-center p-2">
          <input
            type="text"
            placeholder="Search here"
            className="w-full rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            Search
          </button>
        </form>
        <div>
          <h1>Sort by</h1>
          <Button variant={"ghost"} size={"sm"} className="mx-2">
            Age down
          </Button>
          <Button variant={"ghost"} size={"sm"}>
            Age up
          </Button>
          <Button variant={"ghost"} size={"sm"}>
            Normal user
          </Button>
          <Button variant={"ghost"} size={"sm"}>
            premium user
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant={"outline"} size={"sm"} className="mt-2"><Link className="text-blue-700 text-center" href="/admin/users/create">
          Create User
        </Link></Button>
      </div>
      
      <AllUsers />
    </div>
  );
};

export default page;
