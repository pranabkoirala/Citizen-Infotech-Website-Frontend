
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // When the path changes, scroll to top-left (0, 0)
        // Using 'instant' instead of 'smooth' to prevent flash of content
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    // This component renders nothing visual
    return null;
}