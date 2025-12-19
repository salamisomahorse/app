
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockAuth } from '../../services/firebase';
import { useToast } from '../../context/ToastContext';

const Navbar: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await mockAuth.signOut();
            addToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            addToast('Failed to log out', 'error');
        }
    };

    const activeLinkClass = "bg-primary-dark rounded";
    const linkClass = "px-3 py-2 text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors";

    return (
        <nav className="bg-primary shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to="/" className="text-white font-bold text-2xl tracking-tight">
                           InsureNaija
                        </NavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {user ? (
                                <>
                                    <NavLink to="/dashboard" className={({isActive}) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Dashboard</NavLink>
                                    {user.role === 'admin' && <NavLink to="/admin" className={({isActive}) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Admin</NavLink>}
                                    <button onClick={handleLogout} className="bg-accent hover:bg-accent-dark text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" className={({isActive}) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Login</NavLink>
                                    <NavLink to="/signup" className={({isActive}) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Sign Up</NavLink>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-primary-dark inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {user ? (
                            <>
                                <NavLink to="/dashboard" className="text-gray-200 hover:bg-primary-dark hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</NavLink>
                                {user.role === 'admin' && <NavLink to="/admin" className="text-gray-200 hover:bg-primary-dark hover:text-white block px-3 py-2 rounded-md text-base font-medium">Admin</NavLink>}
                                <button onClick={handleLogout} className="w-full text-left bg-accent hover:bg-accent-dark text-white block px-3 py-2 rounded-md text-base font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="text-gray-200 hover:bg-primary-dark hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</NavLink>
                                <NavLink to="/signup" className="text-gray-200 hover:bg-primary-dark hover:text-white block px-3 py-2 rounded-md text-base font-medium">Sign Up</NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
