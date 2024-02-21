import HomePageLogout from "../logoutComponent/HomePageLogout"

const Navbar = () => {
  return (
    <>
    <nav className="flex justify-between items-center px-4 py-2 bg-black">
      <h1  className="font-bold text-2xl">Navbar</h1>
      {/* <div className="flex-grow">
        <input
          type="text"
          className="w-3/4 bg-gray-700 text-gray-200 px-4 py-2 rounded-md"
          placeholder="Search..."
        />
      </div> */}

      <HomePageLogout />
      {/* <div className="flex items-center"></div> */}
    </nav>
  </>
  )
}

export default Navbar