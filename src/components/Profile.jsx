import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

function Profile() {
    const userProfileData = [
        {
            count: 5,
            label: "posts",
        },
        {
            count: '69k',
            label: "followers"
        },
        {
            count: 0,
            label: "following",
            tooltip: "full attitude"
        },
    ]
    const [userData, setUserData] = useState(userProfileData)

    const storiesData = [
        "https://i.postimg.cc/ydZdf8Q8/story1.webp",
        "https://i.postimg.cc/SxxxBrT5/story2.webp",
        "https://i.postimg.cc/hGJPjGq1/story3.webp",
        "https://i.postimg.cc/k4KJQhGV/story4.webp"
    ];

    const postsData = [
        "https://i.postimg.cc/TYXy4nXM/post1.webp",
        "https://i.postimg.cc/xTykDq0k/post2.webp",
        "https://i.postimg.cc/pLspr75R/post3.webp",
        "https://i.postimg.cc/d0DDyBGd/post4.webp",
        "https://i.postimg.cc/bvMrHtR5/post5.webp"
    ];

    const [stories, setStories] = useState(storiesData)
    const [posts, setPosts] = useState(postsData)

    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [showCursor, setShowCursor] = useState(false);
    const cursorRef = useRef(null);

    useEffect(() => {
        if (showCursor) {
            gsap.to(cursorRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "expo.out",
                x: cursorPosition.x-20,
                y: cursorPosition.y-50,
            });
        } else {
            gsap.to(cursorRef.current, {
                opacity: 0,
                scale: 0.7,
                duration: 0.6,
                ease: "expo.out"
            });
        }
    }, [showCursor, cursorPosition]);

    const handleMouseMove = (e) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <>
            <div 
                ref={cursorRef}
                className="aspect-square fixed pointer-events-none z-50 bg-black text-white px-2 rounded-full text-sm flex items-center justify-center"
                style={{ 
                    opacity: 0,
                    transform: 'translate(-50%, -50%) scale(0.7)'
                }}
            >
                <span className="font-[Telma]">click&nbsp;&nbsp;</span>me
            </div>
            <div className="profilePage  w-full h-fit bg-slate-50">
                <div className="container  max-w-5xl mx-auto px-3 md:px-4  py-8">
                    <div className="profileSection  ">
                        <div className="userProfile md:px-0 realtive flex flex-col md:flex-row md:pl-20 lg:pl-10 md:gap-28 lg:gap-40  ">
                            <div className="userImage cursor-pointer mt-10 w-24 h-24 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full  overflow-hidden ">
                                <img 
                                    className="w-full h-full object-cover object-[50%_20%]" 
                                    src="https://i.postimg.cc/76GCpV6D/profile.webp" 
                                    alt="" 
                                />
                            </div>
                            <div className="userInformation  md:mt-8 gap-4 flex w-full md:w-fit flex-col">
                                <div className="flex gap-10  items-center">
                                    <h1 className="font-[General] absolute md:static top-[2.2rem] md:font-extralight font-medium text-xl md:text-3xl">peter3.15</h1>
                                    <button className="text-lg w-[94%] md:w-auto absolute md:static top-[15rem] font-[General] font-medium md:font-extralight border border-zinc-400  h-fit  px-6 py-[.1rem] md:bg-blue-500 rounded-md text-black md:text-white">Edit Profile</button>
                                </div>
                                <div className="flex gap-0 absolute md:static top-24 right-0 md:gap-6">
                                    {userData.map((item, index) => {
                                        return (
                                            <p 
                                                key={index} 
                                                className="relative text-lg md:text-[1.5rem] font-[General] font-extralight flex flex-col md:flex-row mr-5 md:mr-0 group"
                                            >
                                                <span className="font-medium mr-2 text-center ">{item.count}</span>
                                                {item.label}
                                                {item.label === "following" && (
                                                    <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-10 left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-sm py-1 px-2 rounded">
                                                        {item.tooltip}
                                                    </span>
                                                )}
                                            </p>
                                        )
                                    })}
                                </div>
                                <div className="flex flex-col  md:flex-row md:items-center md:gap-6">
                                    <h1 className="font-[General] text-lg leading-none font-medium">Peter Shukul</h1>
                                    <p className="font-[General] text-lg font-extralight">A good guy without her good half.</p>
                                </div>
                                <div className="stories mt-10 flex  gap-3 md:gap-7 ml-0 md:ml-14">
                                    {stories.map((item, index) => {
                                        return (
                                            <div key={index} className="story cursor-pointer w-[4.3rem] h-[4.3rem] md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 border-zinc-400">
                                                <div className="storyImage rounded-full w-[3.8rem] h-[3.8rem] md:w-[4.5rem] md:h-[4.5rem] overflow-hidden">
                                                    <img className="w-full h-full object-cover" src={item} alt="" />
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>

                            </div>

                        </div>
                        <div className="userPosts flex pt-5 md:pt-24 md:pl-20 lg:pl-[0] flex-wrap gap-0.5 md:gap-3 lg:gap-8 w-full ">
                            {posts.map((item, index) => {
                                return (
                                    <div key={index} className={`post cursor-pointer w-[7rem] h-[7rem]  md:w-[16rem] md:h-[16rem] lg:w-[19rem] lg:h-[19rem] overflow-hidden`}>
                                        <img className={`w-full h-full object-cover md:rounded-md ${index === 2 && "object-[37%_50%]"}`} src={item} alt="" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Link to="/reel">
                        <div 
                            className="reels-cta text-center pt-16"
                            onMouseEnter={() => setShowCursor(true)}
                            onMouseLeave={() => setShowCursor(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <h1 className="text-[5rem] md:text-[12rem] lg:text-[15rem] font-[Telma] text-transparent background-gradient cursor-pointer">reels</h1>
                        </div>
                    </Link>

                </div>

            </div>
        </>
    );
}

export default Profile;
