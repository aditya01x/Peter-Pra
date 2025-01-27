import { useState, useEffect, useRef } from 'react'

const LoadAssests = ({ children, onProgress }) => {
    const [loading, setLoading] = useState(true);
    const loadedAssetsRef = useRef(0);
    const hasStartedLoadingRef = useRef(false);
    
    // Updated with actual paths from your components
    const imageAssets = [
        "/Peter-Pra/assets/images/story1.webp", 
        "/Peter-Pra/assets/images/story2.webp", 
        "/Peter-Pra/assets/images/story3.webp", 
        "/Peter-Pra/assets/images/story4.webp",
        "/Peter-Pra/assets/images/post1.webp", 
        "/Peter-Pra/assets/images/post2.webp", 
        "/Peter-Pra/assets/images/post3.webp",
        "/Peter-Pra/assets/images/post4.webp",
        "/Peter-Pra/assets/images/post5.webp",
        "/Peter-Pra/assets/images/favicon.png"
    ];

    const videoAssets = [
        "/Peter-Pra/assets/ptrhub.mp4"  // From SidePage.jsx
    ];

    const totalAssets = imageAssets.length + videoAssets.length;

    const updateProgress = () => {
        if (loadedAssetsRef.current >= totalAssets) return;
        loadedAssetsRef.current++;
        // Calculate progress from 0 to 18 based on loaded assets
        const rawProgress = (loadedAssetsRef.current / totalAssets) * 18;
        // Round to nearest integer
        const progress = Math.floor(rawProgress);
        onProgress(progress);
    };

    const preloadImages = async () => {
        try {
            const promises = imageAssets.map((src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        updateProgress();
                        resolve();
                    };
                    img.onerror = (err) => {
                        console.error(`Failed to load image: ${src}`, err);
                        reject(err);
                    };
                });
            });

            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Error preloading images:', error);
            return false;
        }
    };

    const preloadVideos = async () => {
        try {
            const promises = videoAssets.map((src) => {
                return new Promise((resolve, reject) => {
                    const video = document.createElement('video');
                    video.preload = 'auto';
                    video.src = src;
                    video.onloadeddata = () => {
                        updateProgress();
                        resolve();
                    };
                    video.onerror = (err) => {
                        console.error(`Failed to load video: ${src}`, err);
                        reject(err);
                    };
                });
            });

            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Error preloading videos:', error);
            return false;
        }
    };

    const loadAllAssets = async () => {
        if (hasStartedLoadingRef.current) return; // Prevent multiple load attempts
        hasStartedLoadingRef.current = true;
        
        try {
            console.log('Starting to load assets...');
            const [imagesLoaded, videosLoaded] = await Promise.all([
                preloadImages(),
                preloadVideos()
            ]);

            if (imagesLoaded && videosLoaded) {
                console.log('All assets loaded successfully');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error loading assets:', error);
            setLoading(false);
        }
    };

    // Start with 0 progress when component mounts
    useEffect(() => {
        onProgress(0);
    }, []);

    useEffect(() => {
        loadAllAssets();
        
        return () => {
            // Cleanup
            hasStartedLoadingRef.current = false;
            loadedAssetsRef.current = 0;
        };
    }, []);

    return children;
};

export default LoadAssests;