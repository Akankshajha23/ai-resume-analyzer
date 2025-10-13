import React from 'react';
import { Link } from 'react-router';
import { usePuterStore } from '~/lib/puter';

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <nav className="navbar flex justify-between items-center px-6 py-4 bg-[#0f0f1a]">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">ResumeCrack</p>
      </Link>

      {auth.isAuthenticated && (
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>
      )}
    </nav>
  );
};

export default Navbar;