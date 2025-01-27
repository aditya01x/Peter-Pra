import { useState, useRef, useEffect } from 'react';
import { IoArrowBack, IoPlayCircle, IoPauseCircle, IoVolumeMute, IoVolumeHigh, IoRefreshCircle } from "react-icons/io5";
import { AiOutlineSearch, AiOutlineUser, AiOutlineLike, AiOutlineDislike, AiOutlineShareAlt, AiOutlinePlusCircle } from "react-icons/ai";
import { BiMenuAltRight } from "react-icons/bi";
import { MdOutlineFileUpload } from "react-icons/md";
import { Link } from 'react-router-dom';

const SidePage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isEnded, setIsEnded] = useState(false);
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener('loadedmetadata', () => {
                setDuration(video.duration);
            });
            video.addEventListener('timeupdate', () => {
                setCurrentTime(video.currentTime);
            });
            video.addEventListener('ended', () => {
                setIsPlaying(false);
                setIsEnded(true);
            });
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', handleSeekMove);
        document.addEventListener('mouseup', handleSeekEnd);

        return () => {
            document.removeEventListener('mousemove', handleSeekMove);
            document.removeEventListener('mouseup', handleSeekEnd);
        };
    }, [isDragging]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const videoContainer = videoRef.current?.parentElement;
            if (videoContainer && !videoContainer.contains(e.target)) {
                setShowControls(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const resetControlsTimeout = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        setShowControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    };

    const handleVideoContainerMouseMove = () => {
        resetControlsTimeout();
    };

    const handleControlsPlayPause = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isEnded) {
                videoRef.current.currentTime = 0;
                setIsEnded(false);
            }
            if (!isPlaying) {
                videoRef.current.play();
                if (isMuted) {
                    videoRef.current.muted = false;
                    setIsMuted(false);
                }
            } else {
                videoRef.current.pause();
            }
            setIsPlaying(!isPlaying);
        }
        resetControlsTimeout();
    };

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleSeek = (e) => {
        const progressBar = progressBarRef.current;
        const video = videoRef.current;
        if (progressBar && video) {
            const rect = progressBar.getBoundingClientRect();
            const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
            video.currentTime = pos * video.duration;
            setCurrentTime(video.currentTime);
            if (isPlaying) {
                video.play();
            }
        }
    };

    const handleSeekStart = (e) => {
        setIsDragging(true);
        handleSeek(e);
    };

    const handleSeekMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            handleSeek(e);
        }
    };

    const handleSeekEnd = () => {
        setIsDragging(false);
        if (isPlaying && videoRef.current) {
            videoRef.current.play();
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* Top Categories Bar */}
            <div className="bg-[#1b1b1b] border-b border-[#2e2e2e] overflow-hidden">
                <div className="max-w-[1800px] mx-auto px-2 sm:px-4 py-2">
                    <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm whitespace-nowrap overflow-x-auto hide-scrollbar">
                        {['Recommended', 'Hot', 'Trending', 'Most Viewed', 'Top Rated', 'Popular', 'Amateur', 'Professional', 'HD Videos', 'Verified'].map((category) => (
                            <a key={category} href="#" className="text-gray-300 hover:text-[#ff9000] transition-colors px-3 sm:px-4 py-1.5 bg-[#2e2e2e] rounded-full hover:bg-[#3e3e3e] flex-shrink-0">
                                {category}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="bg-black border-b border-[#2e2e2e] sticky top-0 z-50">
                <div className="max-w-[1800px] mx-auto px-2 sm:px-4">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo */}
                        <div className="flex items-center cursor-pointer">
                            <div className="flex items-center">
                                <span className="text-[#ff9000] font-black text-2xl sm:text-3xl tracking-tight font-inter">Peter</span>
                                <div className="flex items-center bg-[#ff9000] text-black px-2 sm:px-2.5 rounded-md mx-0.5 transform -skew-x-12">
                                    <span className="font-black text-xl sm:text-2xl tracking-tighter font-inter">Hub</span>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar - Hidden on mobile, shown in menu */}
                        <div className="hidden md:flex flex-1 max-w-xl mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search videos..."
                                    className="w-full bg-[#1b1b1b] border-2 border-[#2e2e2e] rounded-full py-2 px-4 text-white focus:outline-none focus:border-[#ff9000] placeholder-gray-500"
                                />
                                <button className="absolute right-0 top-0 h-full px-6 bg-[#ff9000] hover:bg-[#ff8000] transition-colors rounded-r-full">
                                    <AiOutlineSearch className="text-black w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 text-white hover:text-[#ff9000]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <BiMenuAltRight className="w-6 h-6" />
                        </button>

                        {/* Right Navigation - Hidden on mobile */}
                        <div className="hidden md:flex items-center gap-4">
                            <button className="bg-[#ff9000] hover:bg-[#ff8000] text-black px-4 sm:px-6 py-2 font-bold transition-colors rounded-full flex items-center gap-2">
                                <MdOutlineFileUpload className="w-5 h-5" />
                                <span className="hidden sm:inline">Upload</span>
                            </button>
                            <button className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-white px-4 sm:px-6 py-2 font-bold transition-colors rounded-full flex items-center gap-2">
                                <AiOutlineUser className="w-5 h-5" />
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden bg-[#1b1b1b] px-4 py-4 space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search videos..."
                                    className="w-full bg-[#2e2e2e] border-2 border-[#3e3e3e] rounded-full py-2 px-4 text-white focus:outline-none focus:border-[#ff9000] placeholder-gray-500"
                                />
                                <button className="absolute right-0 top-0 h-full px-6 bg-[#ff9000] hover:bg-[#ff8000] transition-colors rounded-r-full">
                                    <AiOutlineSearch className="text-black w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-[#ff9000] hover:bg-[#ff8000] text-black py-2 font-bold transition-colors rounded-full flex items-center justify-center gap-2">
                                    <MdOutlineFileUpload className="w-5 h-5" />
                                    <span>Upload</span>
                                </button>
                                <button className="flex-1 bg-[#2e2e2e] hover:bg-[#3e3e3e] text-white py-2 font-bold transition-colors rounded-full flex items-center justify-center gap-2">
                                    <AiOutlineUser className="w-5 h-5" />
                                    <span>Sign In</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Video Section */}
            <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4 lg:p-6 max-w-[1800px] mx-auto">
                {/* Main Video Container */}
                <div className="flex-1">
                    <div className="relative w-full aspect-[16/11] xs:aspect-[16/10] sm:aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        {/* Back button overlay */}
                        <Link to="/">
                            <button className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 p-1.5 sm:p-2.5 bg-black/60 hover:bg-[#ff9000] rounded-full transition-all duration-300 group">
                                <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-black" />
                            </button>
                        </Link>

                        {/* Video container */}
                        <div 
                            className="w-full h-full cursor-pointer" 
                            onClick={handleControlsPlayPause}
                            onMouseMove={handleVideoContainerMouseMove}
                        >
                            <video 
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                src="/Peter-Pra/assets/ptrhub.mp4"
                                playsInline
                                muted
                            >
                                Your browser does not support the video tag.
                            </video>
                            
                            {/* Play/Pause/Replay overlay */}
                            <div className={`absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors ${showControls ? 'opacity-100' : 'opacity-0'} duration-300`}>
                                {isEnded ? (
                                    <IoRefreshCircle 
                                        className="w-20 h-20 md:w-24 md:h-24 text-[#fff] opacity-90 hover:scale-110 transition-transform duration-200" 
                                    />
                                ) : !isPlaying ? (
                                    <IoPlayCircle className="w-20 h-20 md:w-24 md:h-24 text-[#fff] opacity-90 hover:scale-110 transition-transform duration-200" />
                                ) : (
                                    <IoPauseCircle className="w-20 h-20 md:w-24 md:h-24 text-[#fff] opacity-0 hover:opacity-90 hover:scale-110 transition-all duration-200" />
                                )}
                            </div>

                            {/* Video Controls */}
                            <div className={`video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 transform transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                {/* Progress Bar Container */}
                                <div className="py-2 group">
                                    <div 
                                        ref={progressBarRef}
                                        className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group-hover:h-2.5 transition-all duration-200"
                                        onClick={handleSeek}
                                        onMouseDown={handleSeekStart}
                                    >
                                        <div 
                                            className={`h-full rounded-full transition-all ${
                                                isDragging ? 'bg-[#ff9000]' : 'bg-[#ff9000] group-hover:bg-[#ff9000]'
                                            }`}
                                            style={{ width: `${(currentTime / duration) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Controls Row */}
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-4">
                                        {/* Play/Pause Button */}
                                        <button 
                                            onClick={handleControlsPlayPause}
                                            className="text-white hover:text-[#ff9000] transition-colors duration-200"
                                        >
                                            {isPlaying ? (
                                                <IoPauseCircle size={32} className="hover:scale-110 transition-transform" />
                                            ) : (
                                                <IoPlayCircle size={32} className="hover:scale-110 transition-transform" />
                                            )}
                                        </button>

                                        {/* Mute/Unmute Button */}
                                        <button 
                                            onClick={handleMuteToggle}
                                            className="text-white hover:text-[#ff9000] transition-colors duration-200"
                                        >
                                            {isMuted ? (
                                                <IoVolumeMute size={28} className="hover:scale-110 transition-transform" />
                                            ) : (
                                                <IoVolumeHigh size={28} className="hover:scale-110 transition-transform" />
                                            )}
                                        </button>

                                        {/* Time Display */}
                                        <span className="text-white text-sm font-medium tracking-wider">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Video Info */}
                    <div className="mt-4 text-white bg-[#1b1b1b] p-3 sm:p-4 rounded-xl">
                        <h1 className="text-xl sm:text-2xl font-bold text-white">Video Title Goes Here</h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-gray-400 text-sm">
                            <span className="text-[#ff9000]">1.2M views</span>
                            <span className="hidden sm:inline">•</span>
                            <span>95% Rating</span>
                            <span className="hidden sm:inline">•</span>
                            <span>2 days ago</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-6 mt-4 border-t border-[#2e2e2e] pt-4">
                            <button className="flex items-center gap-2 hover:text-[#ff9000] transition-colors bg-[#2e2e2e] px-4 py-1.5 rounded-full">
                                <AiOutlineLike className="w-5 h-5" />
                                <span>95%</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-[#ff9000] transition-colors bg-[#2e2e2e] px-4 py-1.5 rounded-full">
                                <AiOutlineDislike className="w-5 h-5" />
                                <span>5%</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-[#ff9000] transition-colors bg-[#2e2e2e] px-4 py-1.5 rounded-full">
                                <AiOutlinePlusCircle className="w-5 h-5" />
                                <span>Playlist</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-[#ff9000] transition-colors bg-[#2e2e2e] px-4 py-1.5 rounded-full">
                                <AiOutlineShareAlt className="w-5 h-5" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar with Related Videos */}
                <div className="lg:w-80 xl:w-96 space-y-2">
                    <h2 className="text-lg font-bold text-white mb-4">Related Videos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="flex gap-2 cursor-pointer group hover:bg-[#1b1b1b] p-2 rounded-xl">
                                <div className="relative w-32 sm:w-40 aspect-video bg-[#2e2e2e] rounded-lg overflow-hidden flex-shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-1 right-1 text-xs text-white bg-black/60 px-1.5 py-0.5 rounded-md">
                                        12:34
                                    </span>
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white group-hover:text-[#ff9000] transition-colors text-sm truncate">
                                        Related Video Title {item}
                                    </h3>
                                    <p className="text-[#ff9000] text-xs mt-1">234K views</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-gray-400 text-xs bg-[#2e2e2e] px-2 py-0.5 rounded-md">95%</span>
                                        <span className="text-gray-400 text-xs">HD</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidePage;