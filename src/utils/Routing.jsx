import { Routes, Route } from "react-router-dom"
import Intro from "../components/Intro"
import Profile from "../components/Profile"
import Reel from "../components/Reel"
import WishingPage from "../components/WishingPage"
import SidePage from "../components/SidePage"

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reel" element={<Reel />} />
            <Route path="/wishing" element={<WishingPage />} />
            <Route path="/peter-hub" element={<SidePage />} />
        </Routes>
    )
}

export default Routing  