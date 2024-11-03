// Navbar.jsx
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from 'react-router-dom'; // Import Link
import logo from "../assets/logo.png";
import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-15 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">Diamante-NGO</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <Link to="/profile" className="py-2 px-3 border rounded-md">
              My Profile
            </Link>
            <Link
              to="/donate"
              className="bg-gradient-to-r from-blue-300 to-blue-800 py-2 px-3 rounded-md"
            >
              Donate Now
            </Link>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              <Link to="/profile" className="py-2 px-3 border rounded-md">
                Profile
              </Link>
              <Link
                to="/donate"
                className="py-2 px-3 rounded-md bg-gradient-to-r from-blue-300 to-blue-800"
              >
                Donate Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
