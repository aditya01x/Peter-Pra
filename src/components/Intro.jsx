import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SplashCursor from "./ui/Animations/SplashCursor/SplashCursor";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

const Intro = () => {
    const texts = [
        "PETER",
        "<span>On</span>",
        "This Year",
        "January, <span>26</span>",
        "you turned",
        "<span>18</span>",
        "now",
        "you will legally",
        "be <span>eligible</span> to",
        "watch <span>18+</span> content!",
        "h<span>ahh</span> aha!",
        "<span>f</span> rom your",
        "elder <span>brothers</span>",
        "There is something <span>special</span>&nbsp; waiting for you!",
    ];

    const textContainerRef = useRef(null);
    const loadingBarRef = useRef(null);
    const loadingBarTextRef = useRef(null);
    const buttonRef = useRef(null);
    const [loadingBarText, setLoadingBarText] = useState(0);
    const [showSplashCursor, setShowSplashCursor] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Text Container
    useGSAP(
        () => {
            gsap.to(textContainerRef.current, {
                y: isTouchDevice ? "-92.3%" : "-93%",
                duration: 10,
                delay: 1,
                ease: "none",
                onComplete: () => {
                    setShowSplashCursor(true);
                    gsap.to(buttonRef.current, {
                        opacity: 1,
                        y: -40,
                        visibility: "visible",
                        duration: 0.6,
                        ease: "power3.inOut",
                    });
                },
            });
        },
        { scope: textContainerRef }
    );

    // Loading Bar
    useGSAP(
        () => {
            gsap.to(loadingBarRef.current, {
                "--progress": "100%",
                duration: 10,
                ease: "none",
            });
        },
        { scope: loadingBarRef }
    );

    // Loading Bar Text
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingBarText((prev) => prev + 1);
        }, 520);
        if (loadingBarText >= 18) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [loadingBarText]);

    // Touch device detection
    useEffect(() => {
        const checkTouchDevice = () => {
            return (
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0
            );
        };

        setIsTouchDevice(checkTouchDevice());
    }, []);

    return (
        <div className="relative w-full h-screen flex justify-center items-start lg:items-center overflow-hidden">
            {showSplashCursor && !isTouchDevice && (
                <SplashCursor
                    DENSITY_DISSIPATION={5.0}
                    PRESSURE={0.07}
                    CURL={3}
                    SPLAT_RADIUS={0.12}
                    SPLAT_FORCE={5000}
                    COLOR_UPDATE_SPEED={10}
                    BACK_COLOR={{ r: 1, g: 1, b: 1 }}
                    TRANSPARENT={true}
                />
            )}

            {/* Text Container */}
            <div className="window mt-72 lg:mt-0 fixed h-[10vh] lg:h-[30.5vh] px-4 sm:px-6 md:px-10 overflow-hidden">
                <div className="text-container" ref={textContainerRef}>
                    {texts.map((text, index) => (
                        <h1
                            key={index}
                            className={`${index === texts.length - 1
                                ? "text-[1.4rem] sm:text-[3rem] md:text-[4rem] lg:text-[4rem] leading-none"
                                : text.startsWith("watch")
                                    ? "text-[2.3rem] sm:text-[6rem] md:text-[8rem] lg:text-[9rem]"
                                    : "text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem]"
                                } h-[10vh] lg:h-[30.5vh] font-[General] font-extralight text-center ${!text.startsWith("<span>f</span>") && "[&_span]:text-[#FD1D1D]"
                                } [&_span]:font-[Telma] [&_span]:font-extralight`}
                            dangerouslySetInnerHTML={{ __html: text }}
                        />
                    ))}
                </div>
            </div>

            {/* Button */}
            <div
                ref={buttonRef}
                className="invisible opacity-0 absolute top-[52%] lg:top-[60%] -translate-y-1/2 w-full h-auto px-4 flex flex-row justify-center items-center gap-3 sm:gap-5"
            >
                <Link to="/peter-hub">
                    <div className="relative h-12 sm:h-16 md:h-20 w-28 sm:w-36 md:w-44 rounded-xl overflow-hidden group">
                        <img
                            className="size-full object-cover object-[50%_70%] group-hover:scale-125 transition-all duration-700 cursor-grab"
                            src="https://i.postimg.cc/J4wyKKV0/image.jpg"
                            alt="btn1"
                        />
                        <span className="absolute top-[68%] left-0 w-full h-0.5 bg-white">
                        </span>
                    </div>
                </Link>

                <Link to="/profile">
                    <div className="h-12 sm:h-16 md:h-20 w-36 sm:w-48 md:w-64 rounded-xl flex justify-center items-center background-gradient gradient-shadow cursor-pointer">
                        <span className="text-lg sm:text-xl md:text-3xl font-[General] font-regular text-white">
                            Excite me.
                        </span>
                    </div>
                </Link>
            </div>

            {/* Loading Bar */}
            <div
                ref={loadingBarRef}
                className="absolute bottom-20 sm:bottom-6 md:bottom-10 right-4 sm:right-6 md:right-10 aspect-square w-12 sm:w-14 md:w-16 bg-[#E7E7E7] rounded-full flex justify-center items-center"
                id="loading-bar"
            >
                <div
                    ref={loadingBarTextRef}
                    className="aspect-square w-[90%] bg-white rounded-full flex justify-center items-center font-[NeueMachina] font-light text-base sm:text-lg md:text-[1.4rem]"
                >
                    {loadingBarText}
                </div>
            </div>
        </div>
    );
};

export default Intro;
