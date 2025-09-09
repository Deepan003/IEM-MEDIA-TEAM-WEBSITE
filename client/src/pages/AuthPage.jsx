import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import { Eye, EyeOff, UserPlus, LogIn, Camera, UserSquare2, RefreshCw } from 'lucide-react';
import DialogBox from '../components/DialogBox'; // Import the new DialogBox

// --- STABLE COMPONENT (Moved Outside) ---
const FormInput = ({ id, name, type, value, onChange, placeholder, isRequired = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{placeholder}</label>
        <input
            id={id} name={name} type={type} value={value} onChange={onChange}
            placeholder={placeholder} required={isRequired}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
    </div>
);

// --- HELPER FUNCTION ---
const generateUsername = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.toLowerCase().split(' ').filter(Boolean);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${firstName}${lastName.charAt(0) || ''}${randomSuffix}`;
};

// --- MAIN PAGE COMPONENT ---
const AuthPage = () => {
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [authMode, setAuthMode] = useState('login');
    const [formData, setFormData] = useState({
        fullName: '', enrollmentNumber: '', email: '', rollNumber: '',
        year: '', department: 'B.Tech', otherDepartment: '',
        device: '', lenses: '', phone: '', whatsapp: '',
        gender: 'Prefer not to say', city: '', username: '',
        password: '', confirmPassword: '',
    });
    // State for the login form specifically
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [guestFormData, setGuestFormData] = useState({ fullName: '', rollNumber: '', department: '', college: '', email: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState({ message: '', type: 'info' }); // State for the dialog box

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleGuestFormChange = (e) => {
        const { name, value } = e.target;
        setGuestFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateUsername = () => {
        setFormData(prev => ({ ...prev, username: generateUsername(prev.fullName) }));
    };

    const handlePhotographerRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) { return setDialog({ message: 'Passwords do not match!', type: 'error' }); }
        if (!/\S+@\S+\.\S+/.test(formData.email)) { return setDialog({ message: 'Please enter a valid email address.', type: 'error' }); }
        
        setIsLoading(true);
        try {
            const response = await axios.post('/api/auth/send-otp', { email: formData.email });
            setDialog({ message: response.data.message, type: 'success' });
            setShowOtpInput(true);
        } catch (error) {
            setDialog({ message: error.response?.data?.message || 'An error occurred.', type: 'error' });
        }
        setIsLoading(false);
    };
    
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        const finalData = { ...formData, department: formData.department === 'Other' ? formData.otherDepartment : formData.department, otp };
        
        setIsLoading(true);
        try {
            await axios.post('/api/auth/register/photographer', finalData);
            setDialog({ message: "Registration Successful! Please log in.", type: 'success' });
            setShowOtpInput(false);
            setAuthMode('login'); // Switch to login view
        } catch (error) {
            setDialog({ message: error.response?.data?.message || 'An error occurred during registration.', type: 'error' });
        }
        setIsLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/api/auth/login', loginData);
            localStorage.setItem('token', response.data.token); // Save the token
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            setDialog({ message: error.response?.data?.message || 'Login failed.', type: 'error' });
        }
        setIsLoading(false);
    };
    
    const handleGuestRegister = (e) => { e.preventDefault(); setDialog({ message: 'Guest registration to be built!', type: 'info'}); };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <DialogBox message={dialog.message} type={dialog.type} onClose={() => setDialog({ message: '' })} />
            <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center bg-gray-800/50">
                    <Camera className="w-16 h-16 text-blue-400 mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to the</h1>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-blue-400">IEM Photography Club</h2>
                    <p className="text-gray-300 mt-4 max-w-sm">The official hub for club members. Manage events, showcase your work, and connect with fellow photographers.</p>
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-gray-900">
                    {authMode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <h3 className="text-3xl font-bold text-center">Member Login</h3>
                            <FormInput id="login-email" name="email" type="email" value={loginData.email} onChange={handleLoginChange} placeholder="Email Address" />
                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <div className="relative">
                                    <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} value={loginData.password} onChange={handleLoginChange} placeholder="Password" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50">
                                {isLoading ? 'Signing In...' : <><LogIn className="mr-2" size={20} /> Sign In</>}
                            </button>
                            <p className="text-center text-sm text-gray-400">Not a member yet?{' '}<button type="button" onClick={() => setAuthMode('registerPhotographer')} className="font-medium text-blue-400 hover:underline">Register Here</button></p>
                            <p className="text-center text-sm text-gray-400">Joining as a guest?{' '}<button type="button" onClick={() => setAuthMode('registerGuest')} className="font-medium text-blue-400 hover:underline">Guest Registration</button></p>
                        </form>
                    )}
                    {authMode === 'registerPhotographer' && !showOtpInput && (
                        <form onSubmit={handlePhotographerRegister} className="space-y-4">
                            <h3 className="text-3xl font-bold text-center mb-4">Photographer Registration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleFormChange} placeholder="Full Name" />
                                <FormInput id="enrollmentNumber" name="enrollmentNumber" type="text" value={formData.enrollmentNumber} onChange={handleFormChange} placeholder="Enrollment Number" />
                                <FormInput id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="Email Address" />
                                <FormInput id="rollNumber" name="rollNumber" type="text" value={formData.rollNumber} onChange={handleFormChange} placeholder="Roll Number" />
                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Current Year</label>
                                    <select name="year" id="year" value={formData.year} onChange={handleFormChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                                        <option value="">Select Year</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                                    <select name="department" id="department" value={formData.department} onChange={handleFormChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                                        <option>B.Tech</option><option>M.Tech</option><option>BBA</option><option>BCA</option><option>LLB</option><option value="Other">Other</option>
                                    </select>
                                </div>
                                {formData.department === 'Other' && (<FormInput id="otherDepartment" name="otherDepartment" type="text" value={formData.otherDepartment} onChange={handleFormChange} placeholder="Please specify your department" />)}
                                <FormInput id="device" name="device" type="text" value={formData.device} onChange={handleFormChange} placeholder="Primary Camera/Device" isRequired={false} />
                                <FormInput id="lenses" name="lenses" type="text" value={formData.lenses} onChange={handleFormChange} placeholder="Lenses (e.g., 50mm, 18-135mm)" isRequired={false} />
                                <FormInput id="phone" name="phone" type="tel" value={formData.phone} onChange={handleFormChange} placeholder="Phone Number" />
                                <FormInput id="whatsapp" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleFormChange} placeholder="WhatsApp Number" />
                                <div>
                                     <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                                    <select name="gender" id="gender" value={formData.gender} onChange={handleFormChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                                        <option>Prefer not to say</option><option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <FormInput id="city" name="city" type="text" value={formData.city} onChange={handleFormChange} placeholder="City of Residence" />
                                <div className="md:col-span-2">
                                     <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                                    <div className="flex items-center space-x-2">
                                        <input id="username" name="username" type="text" value={formData.username} onChange={handleFormChange} placeholder="Create a unique username" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                                        <button type="button" onClick={handleGenerateUsername} className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg" title="Generate Username"><RefreshCw size={20} /></button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleFormChange} placeholder="Create a Password" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 px-3 flex items-center text-gray-400 hover:text-white"><Eye size={20} /></button>
                                </div>
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                                    <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleFormChange} placeholder="Confirm Password" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 px-3 flex items-center text-gray-400 hover:text-white"><Eye size={20} /></button>
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition mt-4 flex items-center justify-center disabled:opacity-50">
                                {isLoading ? 'Sending...' : <><UserPlus className="mr-2" size={20} /> Get OTP & Proceed</>}
                            </button>
                            <p className="text-center text-sm text-gray-400">Already have an account?{' '}<button type="button" onClick={() => setAuthMode('login')} className="font-medium text-blue-400 hover:underline">Login</button></p>
                        </form>
                    )}
                    {showOtpInput && (
                         <form onSubmit={handleVerifyAndRegister} className="space-y-6 flex flex-col items-center justify-center h-full">
                            <h3 className="text-3xl font-bold text-center">Verify Your Email</h3>
                            <p className="text-center text-gray-300">Enter the 6-digit OTP sent to <br/> <span className="font-bold">{formData.email}</span></p>
                            <FormInput id="otp" name="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                            <button type="submit" disabled={isLoading} className="w-full max-w-sm bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50">
                                {isLoading ? 'Verifying...' : 'Verify & Register'}
                            </button>
                             <button type="button" onClick={() => setShowOtpInput(false)} className="font-medium text-blue-400 hover:underline text-sm mt-2">Go Back</button>
                        </form>
                    )}
                    {authMode === 'registerGuest' && (
                        <form onSubmit={handleGuestRegister} className="space-y-6">
                            <h3 className="text-3xl font-bold text-center">Guest Registration</h3>
                            <FormInput id="guestFullName" name="fullName" type="text" value={guestFormData.fullName} onChange={handleGuestFormChange} placeholder="Full Name" />
                            <FormInput id="guestEmail" name="email" type="email" value={guestFormData.email} onChange={handleGuestFormChange} placeholder="Email Address" />
                            <FormInput id="guestCollege" name="college" type="text" value={guestFormData.college} onChange={handleGuestFormChange} placeholder="College Name" />
                            <FormInput id="guestDepartment" name="department" type="text" value={guestFormData.department} onChange={handleGuestFormChange} placeholder="Department" />
                            <FormInput id="guestRoll" name="rollNumber" type="text" value={guestFormData.rollNumber} onChange={handleGuestFormChange} placeholder="Roll Number" />
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center">
                                <UserSquare2 className="mr-2" size={20}/> Register as Guest
                            </button>
                            <p className="text-center text-sm text-gray-400">Are you a club member?{' '}<button type="button" onClick={() => setAuthMode('login')} className="font-medium text-blue-400 hover:underline">Login Here</button></p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;