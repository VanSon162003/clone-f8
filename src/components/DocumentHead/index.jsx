import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useGetSettingsQuery } from "@/services/admin/systemSettingsService";

const DocumentHead = () => {
    const { data } = useGetSettingsQuery(undefined, {
        refetchOnReconnect: true,
    });

    const settings = data?.data;
    useEffect(() => {
        if (settings) {
            // Update the favicon URLs and add timestamp to prevent caching
            const timestamp = new Date().getTime();
            const baseUrl = import.meta.env.VITE_BASE_URL || "";

            const faviconLinks = document.querySelectorAll('link[rel*="icon"]');
            faviconLinks.forEach((link) => {
                const sizes = link.getAttribute("sizes");
                if (sizes) {
                    link.href = `${baseUrl}uploads/favicons/favicon-${sizes}.png?t=${timestamp}`;
                } else {
                    link.href = `${baseUrl}favicon.png?t=${timestamp}`;
                }
            });

            const appleTouchIcon = document.querySelector(
                'link[rel="apple-touch-icon"]'
            );
            if (appleTouchIcon) {
                appleTouchIcon.href = `${baseUrl}apple-touch-icon.png?t=${timestamp}`;
            }
        }
    }, [settings]);

    const baseUrl = import.meta.env.VITE_BASE_URL || "";

    return (
        <Helmet>
            {/* Title and Meta */}
            <title>{settings?.name}</title>
            <meta
                name="description"
                content={settings?.description || "Học lập trình để đi làm"}
            />

            {/* Favicons */}
            <link rel="icon" type="image/png" href={`${baseUrl}favicon.png`} />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href={`${baseUrl}uploads/favicons/favicon-16x16.png`}
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href={`${baseUrl}uploads/favicons/favicon-32x32.png`}
            />
            <link
                rel="icon"
                type="image/png"
                sizes="48x48"
                href={`${baseUrl}uploads/favicons/favicon-48x48.png`}
            />
            <link
                rel="icon"
                type="image/png"
                sizes="64x64"
                href={`${baseUrl}uploads/favicons/favicon-64x64.png`}
            />
            <link
                rel="icon"
                type="image/png"
                sizes="128x128"
                href={`${baseUrl}uploads/favicons/favicon-128x128.png`}
            />
            <link
                rel="icon"
                type="image/png"
                sizes="256x256"
                href={`${baseUrl}uploads/favicons/favicon-256x256.png`}
            />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href={`${baseUrl}apple-touch-icon.png`}
            />
            <link rel="manifest" href={`${baseUrl}manifest.json`} />

            {/* Theme Color */}
            <meta name="theme-color" content="#ffffff" />

            {/* SEO Meta Tags */}
            {settings?.seo && (
                <>
                    <meta name="keywords" content={settings.seo.keywords} />
                    <meta
                        property="og:title"
                        content={settings.seo.title || settings.name}
                    />
                    <meta
                        property="og:description"
                        content={
                            settings.seo.description || settings.description
                        }
                    />
                    <meta
                        property="og:image"
                        content={`${baseUrl}${settings.logo}`}
                    />
                </>
            )}
        </Helmet>
    );
};

export default DocumentHead;
