import React from 'react';
import { Instagram, Facebook, Youtube, Link as LinkIcon } from 'lucide-react';

// MOCK DATA - This should match the data in SocialsManager
const mockSocials = [
    { _id: 'soc1', platform: 'Instagram', url: 'https://instagram.com/iem_photography_club' },
    { _id: 'soc2', platform: 'Facebook', url: 'https://facebook.com/iem.pc' },
];

const platformIcons = {
    Instagram: <Instagram size={20} />,
    Facebook: <Facebook size={20} />,
    YouTube: <Youtube size={20} />,
    Default: <LinkIcon size={20} />,
};


const Footer = () => {
    return (
        <footer className="mt-12 py-6 border-t border-slate-800 text-slate-400 text-sm text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
                {mockSocials.map(social => (
                    <a 
                        key={social._id} 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-slate-700 hover:text-purple-400 transition-colors"
                        aria-label={social.platform}
                    >
                        {platformIcons[social.platform] || platformIcons.Default}
                    </a>
                ))}
            </div>
            <p>&copy; {new Date().getFullYear()} IEM Photography Club. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;