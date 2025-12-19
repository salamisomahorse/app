
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const InsuranceProductCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-primary">
        <div className="text-primary mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white hover:shadow-sm transition-all">
        <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-light bg-opacity-20 text-primary">
                {icon}
            </div>
        </div>
        <div>
            <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
            <p className="mt-1 text-gray-600">{description}</p>
        </div>
    </div>
);

const TestimonialCarousel = () => {
    const testimonials = [
        {
            name: "Chinedu Okafor",
            role: "Business Owner, Lagos",
            text: "I needed a vehicle insurance certificate urgently for my truck. InsureNaija delivered it instantly after payment. No stress, no stories.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Amina Yusuf",
            role: "Civil Servant, Abuja",
            text: "Filing a claim was surprisingly easy. I uploaded the photos of the accident, and their team got back to me within 24 hours. Highly recommended.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "David Mensah",
            role: "Software Engineer, Remote",
            text: "The user interface is so clean and easy to use. I bought health insurance for my parents from the comfort of my home in the UK.",
            image: "https://randomuser.me/api/portraits/men/86.jpg"
        }
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <div className="relative max-w-2xl mx-auto overflow-hidden bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100">
            <div 
                className="transition-transform duration-700 ease-in-out flex"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {testimonials.map((t, idx) => (
                    <div key={idx} className="min-w-full flex flex-col items-center text-center px-4">
                        <img className="h-20 w-20 rounded-full object-cover mb-6 border-4 border-primary/20 shadow-md" src={t.image} alt={t.name} />
                        <p className="text-xl text-gray-700 italic mb-8 leading-relaxed font-medium">"{t.text}"</p>
                        <h4 className="font-bold text-gray-900 text-lg uppercase tracking-wide">{t.name}</h4>
                        <p className="text-sm text-primary font-bold">{t.role}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center space-x-3 mt-10">
                {testimonials.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-2.5 rounded-full transition-all duration-500 ${current === idx ? 'w-10 bg-primary' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Go to testimonial ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const FloatingIcons = () => {
    return (
        <div className="relative w-full h-[400px] flex items-center justify-center">
            {/* Main Shield - Center */}
            <div className="absolute animate-float-slow text-primary">
                <svg className="w-40 h-40 md:w-60 md:h-60 opacity-15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.47 4.34-3.1 8.24-7 9.5V11.99H5V6.3l7-3.11v8.8z"/></svg>
            </div>
            {/* Car Icon */}
            <div className="absolute top-10 left-10 animate-float-medium text-accent">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                </div>
            </div>
            {/* Health Icon */}
            <div className="absolute bottom-10 right-10 animate-float-fast text-red-500">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
            </div>
            {/* Travel Icon */}
            <div className="absolute top-1/4 right-5 animate-float-slow text-primary-light">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                </div>
            </div>
            {/* Property Icon */}
            <div className="absolute bottom-1/4 left-5 animate-float-medium text-gray-500">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </div>
            </div>
            {/* Certificate/Policy Icon */}
            <div className="absolute top-0 right-1/4 animate-float-fast text-primary">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>
        </div>
    );
}

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200">
            <button 
                className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-800">{question}</span>
                <span className="text-primary ml-4">
                    {isOpen ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    )}
                </span>
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-600">
                    {answer}
                </div>
            )}
        </div>
    );
}

const LandingPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="bg-secondary text-gray-700 font-sans">
            {/* Hero Section */}
            <header className="bg-white relative overflow-hidden border-b border-gray-50">
                <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-12 md:mb-0">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                Secure Your Future, <br />
                                <span className="text-primary">The Nigerian Way.</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                                Experience hassle-free insurance. Get instant vehicle, health, and life policies from top insurers, all in one place. Approved by NAICOM.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/signup" className="text-center bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-xl shadow-xl transition-all transform hover:scale-105">
                                    Get Insured Now
                                </Link>
                                <a href="#products" className="text-center bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-4 px-10 rounded-xl transition-all">
                                    View Plans
                                </a>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            <FloatingIcons />
                        </div>
                    </div>
                </div>
            </header>

            {/* Our Products Section */}
            <section id="products" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Our Insurance Products</h2>
                        <div className="w-24 h-1.5 bg-accent mx-auto mt-4 rounded-full"></div>
                        <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">Comprehensive coverage tailored to your life and business needs. Choose the plan that suits you best.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <InsuranceProductCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}
                            title="Motor Insurance"
                            description="Avoid police wahala. Get your genuine Third-Party or Comprehensive vehicle insurance certificate instantly."
                        />
                        <InsuranceProductCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V4a.5.5 0 01.5-.5zM10 16.5a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V17a.5.5 0 01.5-.5zM3.5 10a.5.5 0 01.5-.5h1.5a.5.5 0 010 1H4a.5.5 0 01-.5-.5zM16.5 10a.5.5 0 01.5-.5h1.5a.5.5 0 010 1H17a.5.5 0 01-.5-.5z" /><path d="M10 5.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM10 13a3 3 0 110-6 3 3 0 010 6z" /></svg>}
                            title="Health Insurance"
                            description="Access quality healthcare without breaking the bank. Flexible HMO plans for individuals and families."
                        />
                         <InsuranceProductCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" /></svg>}
                            title="Life & Travel Insurance"
                            description="Secure your family's future with Term Life or travel the world with Schengen-approved travel insurance."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What Our Clients Say</h2>
                        <div className="w-24 h-1.5 bg-accent mx-auto mt-4 rounded-full"></div>
                    </div>
                    <TestimonialCarousel />
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Get Covered in 3 Easy Steps</h2>
                         <div className="w-24 h-1.5 bg-accent mx-auto mt-4 rounded-full"></div>
                        <p className="text-gray-600 mt-6 text-lg">A seamless digital experience from start to finish.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                        
                        <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                            <div className="bg-accent text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg rotate-3">1</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Get a Quote</h3>
                            <p className="text-gray-600">Choose your desired policy and fill in a few details to get an instant, competitive quote.</p>
                        </div>
                         <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                            <div className="bg-accent text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg -rotate-3">2</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Submit Documents</h3>
                            <p className="text-gray-600">Upload your KYC and other required documents securely through our client portal.</p>
                        </div>
                         <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                            <div className="bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg rotate-3">3</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Get Certificate</h3>
                            <p className="text-gray-600">Once approved, your official insurance certificate is available for download instantly.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-20 bg-primary-dark">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Protect Your Assets?</h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of Nigerians who trust InsureNaija for their daily protection. 
                        Get covered today and enjoy peace of mind.
                    </p>
                    <Link to="/signup" className="inline-block bg-accent hover:bg-accent-dark text-white font-extrabold py-5 px-12 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 text-lg">
                        Start Your Journey Today
                    </Link>
                    <div className="mt-12 flex justify-center space-x-8 opacity-70">
                        <div className="text-white text-sm font-medium">Verified by NAICOM</div>
                        <div className="text-white text-sm font-medium">Secure Payments</div>
                        <div className="text-white text-sm font-medium">24/7 Support</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
