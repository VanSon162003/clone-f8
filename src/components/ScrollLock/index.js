import { useEffect } from "react";

export default function ScrollLock() {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        const style = document.createElement("style");
        style.innerHTML = `
      html, body {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE và Edge cũ */
        overflow: hidden; /* chặn cuộn */
      }
      html::-webkit-scrollbar, body::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return null;
}
