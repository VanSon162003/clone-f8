import { useEffect } from "react";
import { useGetSettingsQuery } from "@/services/admin/systemSettingsService";

const DynamicFavicon = () => {
    const { data: settings } = useGetSettingsQuery({
        pollingInterval: 30000, // Poll every 30 seconds to check for updates
    });

    useEffect(() => {
        const updateFavicons = () => {
            const baseUrl = import.meta.env.VITE_BASE_URL || "";

            // Thêm timestamp để tránh cache
            const timestamp = new Date().getTime();

            // Update favicon links
            const faviconLinks = document.querySelectorAll('link[rel*="icon"]');
            faviconLinks.forEach((link) => {
                const sizes = link.getAttribute("sizes");
                if (sizes) {
                    link.href = `${baseUrl}/api/v1/uploads/favicons/favicon-${sizes}.png?t=${timestamp}`;
                } else {
                    link.href = `${baseUrl}/favicon.png?t=${timestamp}`;
                }
            });

            // Update apple touch icon
            const appleTouchIcon = document.querySelector(
                'link[rel="apple-touch-icon"]'
            );
            if (appleTouchIcon) {
                appleTouchIcon.href = `${baseUrl}/apple-touch-icon.png?t=${timestamp}`;
            }

            // Update manifest
            const manifest = document.querySelector('link[rel="manifest"]');
            if (manifest) {
                manifest.href = `${baseUrl}/manifest.json?t=${timestamp}`;
            }
        };

        // Initial update
        if (settings) {
            updateFavicons();
        }

        // Set up an interval to check for favicon updates
        const intervalId = setInterval(updateFavicons, 30000); // Check every 30 seconds

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [settings]);

    return null; // This component doesn't render anything
};

export default DynamicFavicon;
