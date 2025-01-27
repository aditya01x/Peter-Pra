import { useState, useEffect, useRef, useCallback } from "react";
import { FiHeart } from "react-icons/fi";
import { BiMessageRounded } from "react-icons/bi";
import { TiArrowForwardOutline } from "react-icons/ti";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoBookmarkOutline } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { IoMdPause } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import gsap from "gsap";

function Reel() {
    const IconsData = (likes, comments) => [
        {
            icon: <FiHeart></FiHeart>,
            iconInfo: likes,
        },
        {
            icon: <BiMessageRounded></BiMessageRounded>,
            iconInfo: comments,
        },
        {
            icon: <TiArrowForwardOutline></TiArrowForwardOutline>,
        },
        {
            icon: <IoBookmarkOutline />,
        },
        {
            icon: <HiDotsHorizontal></HiDotsHorizontal>,
        },
    ];
    const reelsData = [
        {
            videoUrl: "/Peter-Pra/assets/video1.webm",
            imageUrl:
                "https://i.postimg.cc/G3gD9Wkz/Screenshot-2025-01-26-094203.png",
            userName: "sacheen",
            totalLikes: "23k",
            totalComments: "12k",
            title: "diplomate chinra"
        },
        {
            videoUrl: "/Peter-Pra/assets/video2.webm",
            imageUrl:
                "https://i.postimg.cc/h4YJK9B5/Screenshot-2025-01-26-094604.png",
            userName: "vaishnavi",
            totalLikes: "45k",
            totalComments: "31k",
            title: "peter ka pitara"
        },
        {
            videoUrl: "/Peter-Pra/assets/video3.mp4",
            imageUrl:
                "https://i.postimg.cc/Dz5ZHG65/IMG-6485.jpg",
            userName: "adytya",
            totalLikes: "89k",
            totalComments: "67k",
            title: "bhakk tora mai ke chodo"
        },
        {
            videoUrl: "/Peter-Pra/assets/video4.webm",
            imageUrl:
                "https://i.postimg.cc/PxRqrkBw/IMG-20241114-213052-1.jpg",
            userName: "hrx",
            totalLikes: "134k",
            totalComments: "98k",
            title: "to baat ye hai"
        },
        {
            videoUrl: "/Peter-Pra/assets/video5.mp4",
            imageUrl:
                "https://i.postimg.cc/J7sN377S/IMG-20250116-185920.jpg",
            userName: "mahua",
            totalLikes: "90k",
            totalComments: "7k",
            title: "love youuuu 🏳️‍🌈"
        },
    ];
    const [data, setData] = useState(reelsData);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Add ref for the reel section
    const reelSectionRef = useRef(null);

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleScrollDown = useCallback(() => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, data.length]);

    const handleScrollUp = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    // Handle mouse wheel and touch events
    useEffect(() => {
        const element = reelSectionRef.current;
        if (!element) return;

        // Prevent default scrolling
        const preventScroll = (e) => {
            e.preventDefault();
        };

        document.body.addEventListener("scroll", preventScroll, { passive: false });
        document.documentElement.addEventListener("scroll", preventScroll, {
            passive: false,
        });

        // Desktop only - wheel event
        const handleWheel = (e) => {
            // More aggressive touchpad detection
            if (
                e.deltaMode === 0 || // Pixel scrolling (typical for touchpads)
                Math.abs(e.deltaY) < 100 || // Small delta values
                e.wheelDeltaY % 120 !== 0 // Non-standard wheel delta (touchpads often use fractional values)
            ) {
                return; // Ignore touchpad scrolling
            }

            e.preventDefault();

            // Only respond to significant scroll events
            if (e.deltaY > 0) {
                handleScrollDown();
            } else if (e.deltaY < 0) {
                handleScrollUp();
            }
        };

        const handleTouchStart = (e) => {
            if (e.touches.length === 1) {
                setTouchStart(e.targetTouches[0].clientY);
            }
        };

        const handleTouchMove = (e) => {
            if (touchStart) {
                e.preventDefault();
                setTouchEnd(e.targetTouches[0].clientY);
            }
        };

        const handleTouchEnd = (e) => {
            if (!touchStart || !touchEnd) return;

            const distance = touchStart - touchEnd;
            const isSwipeDown = distance > 50;
            const isSwipeUp = distance < -50;

            if (isSwipeDown) {
                handleScrollDown();
            } else if (isSwipeUp) {
                handleScrollUp();
            }

            setTouchStart(null);
            setTouchEnd(null);
        };

        element.addEventListener("wheel", handleWheel, { passive: false });
        element.addEventListener("touchstart", handleTouchStart, { passive: true });
        element.addEventListener("touchmove", handleTouchMove, { passive: false });
        element.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener("wheel", handleWheel);
            element.removeEventListener("touchstart", handleTouchStart);
            element.removeEventListener("touchmove", handleTouchMove);
            element.removeEventListener("touchend", handleTouchEnd);
        };
    }, [currentIndex, touchStart, touchEnd, handleScrollUp, handleScrollDown]);

    // Initialize isPlaying as true since we want autoplay
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPlayPause, setShowPlayPause] = useState(true);
    const playPauseBtnRef = useRef(null);
    const videoRefs = useRef([]);

    // Add a new useEffect for initial autoplay
    useEffect(() => {
        const firstVideo = videoRefs.current[0];
        if (firstVideo) {
            const playPromise = firstVideo.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setTimeout(() => {
                            setShowPlayPause(false);
                        }, 1500);
                    })
                    .catch((error) => {
                        setIsPlaying(false);
                    });
            }
        }
    }, []);

    // Modify the currentIndex useEffect
    useEffect(() => {
        // Show play/pause button when starting to load new video
        setShowPlayPause(true);

        // Pause all videos first
        videoRefs.current.forEach((videoRef) => {
            if (videoRef) {
                videoRef.pause();
            }
        });

        // Play the current video
        const currentVideo = videoRefs.current[currentIndex];
        if (currentVideo) {
            const playPromise = currentVideo.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        // Hide play/pause button after successful load and play
                        setTimeout(() => {
                            setShowPlayPause(false);
                        }, 1500);
                    })
                    .catch(() => {
                        setIsPlaying(false);
                    });
            }
        }
    }, [currentIndex]);

    const handleVideoClick = (event) => {
        event.stopPropagation();
        const currentVideo = videoRefs.current[currentIndex];

        if (currentVideo) {
            if (isPlaying) {
                currentVideo.pause();
                setIsPlaying(false);
            } else {
                const playPromise = currentVideo.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch((error) => {
                            console.log("Playback failed:", error);
                            setIsPlaying(false);
                        });
                }
            }

            setShowPlayPause(true);
            setTimeout(() => {
                setShowPlayPause(false);
            }, 1500);
        }
    };

    // Add new useEffect for scroll handling
    useEffect(() => {
        const handleScroll = () => {
            const reelElement = reelSectionRef.current;
            if (!reelElement) return;

            const rect = reelElement.getBoundingClientRect();
            const isVisible =
                rect.top >= -rect.height &&
                rect.bottom <= window.innerHeight + rect.height;

            const currentVideo = videoRefs.current[currentIndex];
            if (currentVideo) {
                if (!isVisible) {
                    currentVideo.pause();
                    setIsPlaying(false);
                } else if (isVisible && isPlaying) {
                    currentVideo.play();
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [currentIndex, isPlaying]);

    // Add ref for the wishing button
    const wishingBtnRef = useRef(null);

    // Modify the useEffect for animation
    useEffect(() => {
        if (wishingBtnRef.current) {
            if (currentIndex === data.length - 1) {
                // Entrance animation
                gsap.fromTo(
                    wishingBtnRef.current,
                    {
                        opacity: 0,
                        y: 100
                    },
                    {
                        opacity: 1,
                        y: 0,
                        delay: 0.8,
                        duration: 1,
                        ease: "power4.inOut"
                    }
                );
            } else {
                // Exit animation
                gsap.to(wishingBtnRef.current, {
                    opacity: 0,
                    y: 50,
                    duration: 0.34,
                    ease: "power2.inOut"
                });
            }
        }
    }, [currentIndex, data.length]);

    return (
        <div
            ref={reelSectionRef}
            className="reelSection relative bg-zinc-100 w-full h-screen overflow-hidden lg:pt-10"
        >
            <div className="w-full h-screen overflow-hidden  flex lg:items-center relative">
                <Link to="/profile">
                    <div className="home-icon  z-[999] lg:z-[unset]  absolute top-3 left-1 lg:top-0 lg:left-0 cursor-pointer lg:background-gradient lg:ml-10 w-fit h-fit p-2 rounded">
                        <IoArrowBack size={24} color="#ffffff" />
                    </div>
                </Link>
                <div className="reels top-0 left-0  lg:absolute lg:left-[50%] lg:top-[0%]  min-[1900px]:top-[50%] min-[1900px]:-translate-y-[50%]  lg:h-[40rem]  flex flex-col  lg:-translate-x-[50%] lg: w-[25rem]">
                    {data.map((elem, index) => {
                        return (
                            <div
                                key={index}
                                onClick={handleVideoClick}
                                className="reel w-full h-[98%] lg:w-[25rem] lg:h-[40rem]  absolute lg:realtive "
                                style={{
                                    transform: `translateY(${(index - currentIndex) *
                                        (window.innerWidth >= 1900
                                            ? 114
                                            : window.innerWidth >= 1024
                                                ? 103
                                                : 100)
                                        }%)`,
                                    transition: "transform 0.5s ease-in-out",
                                }}
                            >
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    src={elem.videoUrl}
                                    className="h-full w-full object-cover lg:rounded-lg"
                                    loop
                                ></video>
                                <div className="text-section text-white relative z-[999] top-[-7rem]  px-3 gap-4 flex items-center">
                                    <div className="posterImage w-14 h-14 rounded-full overflow-hidden cursor-pointer bg-zinc-300">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={elem.imageUrl}
                                            alt=""
                                        />
                                    </div>
                                    <h1 className="font-[General] text-xl cursor-pointer">
                                        {elem.userName} •
                                    </h1>
                                    <button className="border border-white px-5 rounded-md font-[General] text-lg">
                                        Follow
                                    </button>
                                    <p className="absolute top-16 left-5 font-[General]">
                                        {elem.title}
                                    </p>
                                </div>
                                <div
                                    ref={playPauseBtnRef}
                                    className={`playPauseButton absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] p-6 flex items-center justify-center rounded-full bg-black/50 text-white transition-opacity duration-500 ${showPlayPause ? "opacity-100" : "opacity-0"
                                        }`}
                                >
                                    {!isPlaying ? (
                                        <FaPlay size={20} />
                                    ) : (
                                        <IoMdPause size={20} />
                                    )}
                                </div>
                                <div className="social-interaction z-[20] text-white lg:text-black lg:mt-80 absolute bottom-12 lg:top-0 right-[1rem] lg:right-[-3rem]  flex flex-col gap-4">
                                    {IconsData(elem.totalLikes, elem.totalComments).map(
                                        (item, index) => {
                                            return (
                                                <div key={index}>
                                                    <p className="text-[1.7rem] lg:text-[2rem] font-[General] font-extralight cursor-pointer">
                                                        {item.icon}
                                                    </p>
                                                    <p className="text-xl font-[General] font-normal">
                                                        {item.iconInfo}
                                                    </p>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute hidden right-10 top-1/2 -translate-y-1/2 z-20 lg:flex flex-col gap-4">
                    <button
                        className={`p-4 rounded-full outline-none bg-gray-800/50 text-white ${currentIndex === 0 ? "opacity-50" : "opacity-100"
                            }`}
                        onClick={handleScrollUp}
                        disabled={currentIndex === 0}
                    >
                        <FaArrowUp size={20} />
                    </button>
                    <button
                        className={`p-4 rounded-full outline-none bg-gray-800/50 text-white ${currentIndex === data.length - 1 ? "opacity-50" : "opacity-100"
                            }`}
                        onClick={handleScrollDown}
                        disabled={currentIndex === data.length - 1}
                    >
                        <FaArrowDown size={20} />
                    </button>
                </div>
            </div>

            {/* Modified Link component - always render but control visibility with opacity */}
            <Link to="/wishing">
                <div 
                    ref={wishingBtnRef}
                    className="wishing-cta absolute bottom-5 lg:bottom-8 left-1/2 -translate-x-1/2 background-gradient lg:px-6 lg:py-[.3rem] rounded-full cursor-pointer"
                    style={{ opacity: 0 }}
                >
                    {/* Show down arrow on mobile, "At Last..." on desktop */}
                    <div className="lg:hidden p-4">
                        <FaArrowDown size={18} color="white" />
                    </div>
                    <span className="hidden lg:inline text-white text-lg font-[General] font-medium">
                        At <span className="font-[telma]">Last...</span>
                    </span>
                </div>
            </Link>
        </div>
    );
}

export default Reel;
