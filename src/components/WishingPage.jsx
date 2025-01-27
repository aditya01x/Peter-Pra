import { useState, useEffect, useRef } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";


function WishingPage() {
    const [activeImages, setActiveImages] = useState({}); // Use an object to track active images
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [showMobileImages, setShowMobileImages] = useState(false);
    const [animatingImages, setAnimatingImages] = useState(new Set());  // New state for tracking animations
    const [isFading, setIsFading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const globalIndex = useRef(0);
    const displayDistance = 50; // Distance in pixels to display another photo
    const nDisplay = 7; // Max number of pictures to display at once

    const imageUrls = [
        "/Peter-Pra/assets/images/wish1.webp",
        "/Peter-Pra/assets/images/wish2.webp",
        "/Peter-Pra/assets/images/wish3.webp",
        "/Peter-Pra/assets/images/wish4.webp",
        "/Peter-Pra/assets/images/wish5.webp",
        "/Peter-Pra/assets/images/wish6.webp",
        "/Peter-Pra/assets/images/wish7.webp",
        "/Peter-Pra/assets/images/wish8.webp",
        "/Peter-Pra/assets/images/wish9.webp",
    ];

    const mobileImagePositions = [
        { x: '20%', y: '-100%', rotate: '-15deg', scale: 3 },
        { x: '75%', y: '-20%', rotate: '-10deg', scale: 2 },
        { x: '0%', y: '50%', rotate: '-10deg', scale: 1.5 },
        { x: '65%', y: '65%', rotate: '8deg', scale: 1.9 },
        { x: '25%', y: '200%', rotate: '-12deg', scale: 2 },
        { x: '80%', y: '200%', rotate: '15deg', scale: 1.4 },
    ];

    useEffect(() => {
        const loadImages = async () => {
            const promises = imageUrls.map((url) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = resolve;
                    img.onerror = reject;
                });
            });

            try {
                await Promise.all(promises);
                setImagesLoaded(true);
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };

        loadImages();
    }, []);

    const mouseDistance = (x, y) => {
        return Math.hypot(x - lastMousePosition.current.x, y - lastMousePosition.current.y);
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        if (mouseDistance(relativeX, relativeY) > displayDistance) {
            const currentIndex = globalIndex.current % imageUrls.length;
            const removeIndex = (globalIndex.current - nDisplay) % imageUrls.length;

            setActiveImages((prev) => {
                const newImages = { ...prev };
                newImages[currentIndex] = {
                    index: currentIndex,
                    x: relativeX,
                    y: relativeY,
                    zIndex: globalIndex.current
                };
                if (globalIndex.current >= nDisplay) {
                    delete newImages[removeIndex];
                }
                return newImages;
            });

            lastMousePosition.current = { x: relativeX, y: relativeY };
            globalIndex.current++;
        }
    };

    const handleMouseLeave = () => {
        setActiveImages({});
        globalIndex.current = 0;
    };

    const handleClick = () => {
        if (window.innerWidth <= 768 && imagesLoaded && !isAnimating) {
            setIsAnimating(true);
            setIsFading(false);
            setShowMobileImages(true);
            setAnimatingImages(new Set());

            imageUrls.forEach((_, index) => {
                setTimeout(() => {
                    setAnimatingImages((prev) => new Set([...prev, index]));
                }, index * 200);
            });

            setTimeout(() => {
                setIsFading(true);
                setTimeout(() => {
                    setShowMobileImages(false);
                    setIsFading(false);
                    setIsAnimating(false);
                }, 1000);
            }, 3500);
        }
    };

    return (
        <div
            className="wishing-page fixed inset-0 p-3 lg:px-10 lg:py-14 w-full h-screen overflow-hidden"
            onClick={handleClick}
        >
            <Link to="/reel">
                <div className="home-icon p-2 absolute z-[99] w-fit h-fit background-gradient text-white rounded-[.380rem]">
                    <IoArrowBack size={24} />
                </div>
            </Link>

            <div
                className="wishing-part w-fit h-fit lg:p-[5rem] lg:px-[10rem] min-[1900px]:p-[10rem] min-[1900px]:px-[13rem] cursor-default absolute text-center top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] hover:text-white transition-colors duration-300"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="wishing-message w-full h-full text-[3.5rem] lg:text-[9.6rem] min-[1900px]:text-[12rem] leading-none relative z-10 mix-blend-difference text-black">
                    <h1 className="font-[Helvetica]">
                        <span className="font-[Telma] font-medium">h</span>appiest
                    </h1>
                    <div className="second-word flex gap-2 lg:gap-12">
                        <h1 className="font-[Helvetica]">
                            <span className="font-[Telma] font-medium">bi</span>rthday
                        </h1>
                        <h1 className="font-[Telma] text-[#ff0808] hover:text-[#ff0808]">
                            <span className="font-medium">p</span>eter
                        </h1>
                    </div>
                    <h1 className="font-[Telma]">
                        <span className="font-bold">p</span>ra
                    </h1>
                </div>

                <div className="hero-image absolute w-full h-full top-0 left-0 z-[300] lg:z-0">
                    {imagesLoaded && window.innerWidth > 768 &&
                        Object.values(activeImages).map((imageData) => (
                            <div
                                key={imageData.zIndex}
                                className="absolute w-[40vmin] transition-opacity duration-300"
                                style={{
                                    left: `${imageData.x}px`,
                                    top: `${imageData.y}px`,
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: imageData.zIndex
                                }}
                            >
                                <img
                                    className="w-full h-full object-cover"
                                    src={imageUrls[imageData.index % imageUrls.length]}
                                    alt=""
                                    loading="eager"
                                />
                            </div>
                        ))}

                    {imagesLoaded && window.innerWidth <= 768 && showMobileImages &&
                        imageUrls.slice(0, 6).map((url, index) => (
                            <div
                                key={index}
                                className="absolute w-[40vmin] transition-all duration-1000"
                                style={{
                                    left: mobileImagePositions[index].x,
                                    top: mobileImagePositions[index].y,
                                    transform: `translate(-50%, -50%) rotate(${mobileImagePositions[index].rotate}) scale(${mobileImagePositions[index].scale})`,
                                    opacity: isFading ? 0 : animatingImages.has(index) ? 1 : 0,
                                    pointerEvents: 'none',
                                }}
                            >
                                <img
                                    className="w-full h-full object-cover"
                                    src={url}
                                    alt=""
                                    loading="eager"
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default WishingPage;
