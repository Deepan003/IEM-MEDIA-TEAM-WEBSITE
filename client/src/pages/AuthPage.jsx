import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, UserPlus, LogIn, Camera, RefreshCw, CheckCircle, XCircle, Loader2, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// --- DIALOG BOX COMPONENT (Integrated) ---
const DialogBox = ({ message, type, onClose }) => {
    if (!message) return null;

    const dialogStyles = {
        base: "fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-all duration-300 transform",
        success: "bg-gradient-to-r from-green-500 to-emerald-600",
        error: "bg-gradient-to-r from-red-500 to-rose-600",
        warning: "bg-gradient-to-r from-yellow-500 to-amber-600",
        info: "bg-gradient-to-r from-blue-500 to-sky-600",
    };

    const icons = {
        success: <CheckCircle className="mr-3" />,
        error: <XCircle className="mr-3" />,
        warning: <AlertTriangle className="mr-3" />,
        info: <Info className="mr-3" />,
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-close after 5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${dialogStyles.base} ${dialogStyles[type] || dialogStyles.info} animate-fade-in-down`}>
            {icons[type] || icons.info}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
                <XCircle size={20} />
            </button>
        </div>
    );
};


// --- STABLE & STYLED COMPONENT ---
const FormInput = ({ id, name, type, value, onChange, placeholder, isRequired = true, trailingIcon = null }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{placeholder}</label>
        <div className="relative">
            <input
                id={id} name={name} type={type} value={value} onChange={onChange}
                placeholder={placeholder} required={isRequired}
                className="w-full pl-4 pr-10 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
            />
            {trailingIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{trailingIcon}</div>}
        </div>
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
    const { login } = useAuth(); // Get the login function from context
    const navigate = useNavigate();
    const [authMode, setAuthMode] = useState('login');
    const [formData, setFormData] = useState({ fullName: '', enrollmentNumber: '', email: '', rollNumber: '', year: '', department: 'B.Tech', otherDepartment: '', device: '', lenses: '', phone: '', whatsapp: '', gender: 'Prefer not to say', city: '', username: '', password: '', confirmPassword: '' });
    const [guestFormData, setGuestFormData] = useState({ fullName: '', email: '', designation: 'Student', institution: 'Institute of Engineering and Management(IEM)', otherInstitution: '', enrollmentNumber: '', department: '', password: '', confirmPassword: '' });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState({ message: '' });
    const [usernameStatus, setUsernameStatus] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleLoginChange = (e) => setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleGuestFormChange = (e) => setGuestFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // --- REFINED: Smooth, Continuous Canvas Background Effect ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const cycleDuration = 5; // Faster, more fluid cycle
        const maxBlur = 10;
        const baseBrightness = 0.7;
        const shutterBrightness = 0.2; // A dim flash, not a full blackout
        let startTime = Date.now();

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const draw = () => {
            if (video.paused || video.ended) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            };

            const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
            const videoScaledWidth = video.videoWidth * scale;
            const videoScaledHeight = video.videoHeight * scale;
            const x = (canvas.width - videoScaledWidth) / 2;
            const y = (canvas.height - videoScaledHeight) / 2;

            const timeElapsed = (Date.now() - startTime) / 1000;
            const progress = (timeElapsed % cycleDuration) / cycleDuration;
            
            // Use a sine wave for a smooth, continuous pulse
            const sinValue = Math.sin(progress * 2 * Math.PI); // Full cycle from -1 to 1
            
            // Blur Amount (peaks at the top of the sine wave)
            const blurProgress = (sinValue + 1) / 2; // Map from -1,1 to 0,1
            const blurAmount = maxBlur * blurProgress;
            
            // Brightness (dips at the bottom of the sine wave for the shutter effect)
            const brightness = baseBrightness - (shutterBrightness * (1 - blurProgress));

            ctx.filter = `blur(${blurAmount}px) brightness(${brightness})`;
            ctx.drawImage(video, x, y, videoScaledWidth, videoScaledHeight);

            animationFrameId = requestAnimationFrame(draw);
        };

        const startPlayback = () => {
            video.play().then(() => {
                resizeCanvas();
                startTime = Date.now(); // Reset start time on play
                draw();
            }).catch(e => console.error("Video playback failed:", e));
        };

        window.addEventListener('resize', resizeCanvas);
        video.addEventListener('loadeddata', startPlayback);
        video.load();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        if (!formData.username) {
            setUsernameStatus(''); setUsernameError(''); return;
        }
        const controller = new AbortController();
        const timer = setTimeout(() => {
            const checkUsername = async () => {
                setUsernameStatus('checking');
                try {
                    const response = await axios.get(`/api/auth/check-username?username=${formData.username}`, { signal: controller.signal });
                    setUsernameStatus(response.data.available ? 'available' : 'taken');
                    setUsernameError(response.data.available ? '' : 'This username is already taken.');
                } catch (error) {
                    if (!axios.isCancel(error)) setUsernameStatus('');
                }
            };
            checkUsername();
        }, 500);
        return () => { clearTimeout(timer); controller.abort(); };
    }, [formData.username]);

    const handleGenerateUsername = () => setFormData(prev => ({ ...prev, username: generateUsername(prev.fullName) }));
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/api/auth/login', loginData);
            login(response.data.token); // Use the context login function
            navigate('/dashboard');
        } catch (error) {
            setDialog({ message: error.response?.data?.message || 'Login failed. Please check your credentials.', type: 'error' });
        }
        setIsLoading(false);
    };

    const sendOtpRequest = async (email) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/auth/send-otp', { email });
            setDialog({ message: response.data.message, type: 'success' });
            setShowOtpInput(true);
        } catch (error) {
            setDialog({ message: error.response?.data?.message || 'An error occurred while sending OTP.', type: 'error' });
        }
        setIsLoading(false);
    };

    const handlePhotographerRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setDialog({ message: 'Passwords do not match!', type: 'error' });
        }
        if (usernameStatus !== 'available') {
            return setDialog({ message: 'Please choose an available username.', type: 'error' });
        }
        await sendOtpRequest(formData.email);
    };

    const handleGuestRegister = async (e) => {
        e.preventDefault();
        if (guestFormData.password !== guestFormData.confirmPassword) {
            return setDialog({ message: 'Passwords do not match!', type: 'error' });
        }
        await sendOtpRequest(guestFormData.email);
    };

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const finalData = { ...formData, department: formData.department === 'Other' ? formData.otherDepartment : formData.department, otp };
            await axios.post('/api/auth/register/photographer', finalData);
            setDialog({ message: "Registration Successful! Please log in.", type: 'success' });
            setShowOtpInput(false);
            setAuthMode('login');
        } catch (error) {
            setDialog({ message: error.response?.data?.message || 'Registration failed.', type: 'error' });
        }
        setIsLoading(false);
    };

    const handleVerifyAndRegisterGuest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const finalData = { ...guestFormData, otp };
            await axios.post('/api/auth/register/guest', finalData);
            setDialog({ message: "Guest Registration Successful! Please log in.", type: 'success' });
            setShowOtpInput(false);
            setAuthMode('login');
        } catch (error) {
            setDialog({ message: error.response?.data?.message || 'Registration failed.', type: 'error' });
        }
        setIsLoading(false);
    };

    const getUsernameFeedbackIcon = () => {
        switch (usernameStatus) {
            case 'checking': return <Loader2 size={20} className="text-yellow-400 animate-spin" />;
            case 'available': return <CheckCircle size={20} className="text-green-400" />;
            case 'taken': return <XCircle size={20} className="text-red-400" />;
            default: return null;
        }
    };

    const TabButton = ({ mode, children }) => (
        <button type="button" onClick={() => { setAuthMode(mode); setShowOtpInput(false); }} className={`flex-1 pb-2 text-center font-semibold border-b-4 transition-all duration-300 ${authMode === mode ? 'text-white border-indigo-500' : 'text-slate-400 border-transparent hover:text-white'}`}>
            {children}
        </button>
    );

    const ViewfinderOverlay = () => (
        <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden flex justify-center items-center">
            <div className="absolute inset-0 shadow-[0_0_200px_rgba(0,0,0,0.9)_inset]"></div>
            
            <div className="absolute top-8 left-8 w-8 h-8 md:w-16 md:h-16 border-t-2 border-l-2 border-white/50"></div>
            <div className="absolute top-8 right-8 w-8 h-8 md:w-16 md:h-16 border-t-2 border-r-2 border-white/50"></div>
            <div className="absolute bottom-8 left-8 w-8 h-8 md:w-16 md:h-16 border-b-2 border-l-2 border-white/50"></div>
            <div className="absolute bottom-8 right-8 w-8 h-8 md:w-16 md:h-16 border-b-2 border-r-2 border-white/50"></div>
            
            <div className="w-20 h-20 animate-[focus-pulse_5s_ease-in-out_infinite] relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/80"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/80"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/80"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/80"></div>
            </div>
            
            <div className="absolute top-8 left-1/2 -translate-x-1/2 md:left-28 md:translate-x-0 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-red-500 text-lg">REC</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full text-white font-sans overflow-hidden">
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10"></canvas>
            <video ref={videoRef} loop muted playsInline className="hidden">
                <source src="/videos/auth-bg.mp4" type="video/mp4" />
            </video>
            <style>
                {`
                    @keyframes focus-pulse {
                        0%, 100% { 
                            transform: scale(0.8); 
                            opacity: 0.7; 
                        }
                        50% { 
                            transform: scale(1.2); 
                            opacity: 1; 
                        }
                    }
                    @keyframes flicker {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    @keyframes fade-in-down {
                        0% { opacity: 0; transform: translateY(-20px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-down {
                        animation: fade-in-down 0.5s ease-out forwards;
                    }
                `}
            </style>
            <ViewfinderOverlay />

            <div className="flex flex-col lg:flex-row min-h-screen relative z-10">
                <DialogBox message={dialog.message} type={dialog.type} onClose={() => setDialog({ message: '' })} />

                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center text-center">
                    <div className="w-full max-w-md">
                        <div className="h-24 w-24 mb-6 mx-auto bg-slate-900/50 rounded-2xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center p-2">
                            <img src="/images/logo.png" alt="IEM Photography Club Logo" className="object-contain h-full w-full"/>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            IEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Photography</span> Club
                        </h1>
                        <p className="mt-6 text-lg text-slate-300">
                            The official hub for club members. Manage events, showcase your work, and connect with a community of passionate creators.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
                     <div className="w-full max-w-md bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-75 blur-xl animate-[spin_6s_linear_infinite]"></div>
                        <div className="relative z-10">
                            {!showOtpInput ? (
                                <>
                                    <div className="flex space-x-2 sm:space-x-4 border-b border-slate-700 mb-8">
                                        <TabButton mode="login">Login</TabButton>
                                        <TabButton mode="registerPhotographer">Photographer</TabButton>
                                        <TabButton mode="registerGuest">Guest</TabButton>
                                    </div>
                                    <div className="animate-fade-in">
                                        {authMode === 'login' && (
                                            <form onSubmit={handleLogin} className="space-y-6">
                                                <FormInput id="login-email" name="email" type="email" value={loginData.email} onChange={handleLoginChange} placeholder="Email Address" />
                                                <div>
                                                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                                    <div className="relative">
                                                        <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} value={loginData.password} onChange={handleLoginChange} placeholder="Password" required className="w-full pl-4 pr-10 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg"/>
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center h-12 active:animate-shutter-flash">
                                                    {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2" size={20} /> Sign In</>}
                                                </button>
                                            </form>
                                        )}
                                        {authMode === 'registerPhotographer' && (
                                            <form onSubmit={handlePhotographerRegister} className="space-y-4 max-h-[65vh] lg:max-h-[70vh] overflow-y-auto pr-2 -mr-2">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <FormInput id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleFormChange} placeholder="Full Name" />
                                                    <FormInput id="enrollmentNumber" name="enrollmentNumber" type="text" value={formData.enrollmentNumber} onChange={handleFormChange} placeholder="Enrollment Number" />
                                                    <FormInput id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="Email Address" />
                                                    <FormInput id="rollNumber" name="rollNumber" type="text" value={formData.rollNumber} onChange={handleFormChange} placeholder="Roll Number" />
                                                    <div>
                                                        <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                                                        <select name="year" id="year" value={formData.year} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white"><option value="">Select Year</option><option value="1">1st</option><option value="2">2nd</option><option value="3">3rd</option><option value="4">4th</option></select>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                                                        <select name="department" id="department" value={formData.department} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white"><option>B.Tech</option><option>M.Tech</option><option>BBA</option><option>BCA</option><option>LLB</option><option value="Other">Other</option></select>
                                                    </div>
                                                    {formData.department === 'Other' && <div className="sm:col-span-2"><FormInput id="otherDepartment" name="otherDepartment" type="text" value={formData.otherDepartment} onChange={handleFormChange} placeholder="Please specify department" /></div>}
                                                    <FormInput id="device" name="device" type="text" value={formData.device} onChange={handleFormChange} placeholder="Primary Camera/Device" isRequired={false} />
                                                    <FormInput id="lenses" name="lenses" type="text" value={formData.lenses} onChange={handleFormChange} placeholder="Lenses" isRequired={false} />
                                                    <FormInput id="phone" name="phone" type="tel" value={formData.phone} onChange={handleFormChange} placeholder="Phone Number" />
                                                    <FormInput id="whatsapp" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleFormChange} placeholder="WhatsApp Number" />
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                                                        <select name="gender" id="gender" value={formData.gender} onChange={handleFormChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white"><option>Prefer not to say</option><option>Male</option><option>Female</option><option>Other</option></select>
                                                    </div>
                                                    <FormInput id="city" name="city" type="text" value={formData.city} onChange={handleFormChange} placeholder="City of Residence" />
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                                                        <div className="flex items-center space-x-2">
                                                            <input id="username" name="username" type="text" value={formData.username} onChange={handleFormChange} placeholder="Create a unique username" required className="flex-1 w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white" />
                                                            <button type="button" onClick={handleGenerateUsername} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition" title="Generate Username"><RefreshCw size={24} /></button>
                                                        </div>
                                                        {usernameStatus && <p className={`text-xs mt-1 ${usernameStatus === 'available' ? 'text-green-400' : 'text-red-400'}`}>{usernameStatus === 'available' ? 'Username is available!' : usernameError}</p>}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                                        <div className="relative"><input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleFormChange} required className="w-full pl-4 pr-10 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg" /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm</label>
                                                        <div className="relative"><input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleFormChange} required className="w-full pl-4 pr-10 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg" /><button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white">{showConfirmPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div>
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={isLoading || (formData.username && usernameStatus !== 'available')} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mt-4 flex items-center justify-center h-12 disabled:opacity-50 active:animate-shutter-flash">
                                                    {isLoading ? <Loader2 className="animate-spin" /> : <><UserPlus className="mr-2" size={20} /> Get OTP & Proceed</>}
                                                </button>
                                            </form>
                                        )}
                                        {authMode === 'registerGuest' && (
                                            <form onSubmit={handleGuestRegister} className="space-y-4 max-h-[65vh] lg:max-h-[70vh] overflow-y-auto pr-2 -mr-2">
                                                <FormInput id="guestFullName" name="fullName" type="text" value={guestFormData.fullName} onChange={handleGuestFormChange} placeholder="Full Name" />
                                                <FormInput id="guestEmail" name="email" type="email" value={guestFormData.email} onChange={handleGuestFormChange} placeholder="Email Address" />
                                                <div>
                                                    <label htmlFor="designation" className="block text-sm font-medium text-gray-300 mb-1">Designation</label>
                                                    <select name="designation" id="designation" value={guestFormData.designation} onChange={handleGuestFormChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white">
                                                        <option value="Student">Student</option>
                                                        <option value="Teacher">Teacher</option>
                                                    </select>
                                                </div>
                                                {guestFormData.designation === 'Student' && (
                                                    <>
                                                        <div>
                                                            <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
                                                            <select name="institution" id="institution" value={guestFormData.institution} onChange={handleGuestFormChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white">
                                                                <option>Institute of Engineering and Management(IEM)</option>
                                                                <option>University of Engineering and Management(UEM)</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </div>
                                                        {guestFormData.institution === 'Other' && <FormInput id="otherInstitution" name="otherInstitution" type="text" value={guestFormData.otherInstitution} onChange={handleGuestFormChange} placeholder="Please specify institution" />}
                                                        <FormInput id="guestEnrollmentNumber" name="enrollmentNumber" type="text" value={guestFormData.enrollmentNumber} onChange={handleGuestFormChange} placeholder="Enrollment Number" />
                                                    </>
                                                )}
                                                {guestFormData.designation === 'Teacher' && <FormInput id="guestDepartment" name="department" type="text" value={guestFormData.department} onChange={handleGuestFormChange} placeholder="Department" />}
                                                <div>
                                                    <label htmlFor="guestPassword" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                                    <div className="relative"><input id="guestPassword" name="password" type={showPassword ? 'text' : 'password'} value={guestFormData.password} onChange={handleGuestFormChange} required className="w-full pl-4 pr-10 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg" /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div>
                                                </div>
                                                <div>
                                                    <label htmlFor="guestConfirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                                                    <div className="relative"><input id="guestConfirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={guestFormData.confirmPassword} onChange={handleGuestFormChange} required className="w-full pl-4 pr-10 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg" /><button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white">{showConfirmPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div>
                                                </div>
                                                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mt-4 flex items-center justify-center h-12 disabled:opacity-50 active:animate-shutter-flash">
                                                    {isLoading ? <Loader2 className="animate-spin" /> : <><UserPlus className="mr-2" size={20} /> Proceed as Guest</>}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="animate-fade-in">
                                    <form onSubmit={authMode === 'registerGuest' ? handleVerifyAndRegisterGuest : handleVerifyAndRegister} className="space-y-6 flex flex-col items-center justify-center text-center">
                                        <h3 className="text-2xl font-bold">Verify Your Email</h3>
                                        <p className="text-slate-300">Enter the 6-digit OTP sent to <br /><span className="font-bold text-white">{authMode === 'registerGuest' ? guestFormData.email : formData.email}</span></p>
                                        <FormInput id="otp" name="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                                        <button type="submit" disabled={isLoading} className="w-full max-w-sm bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition h-12 flex items-center justify-center disabled:opacity-50 active:animate-shutter-flash">
                                            {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Register'}
                                        </button>
                                        <button type="button" onClick={() => setShowOtpInput(false)} className="font-medium text-indigo-400 hover:underline text-sm">Go Back</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;