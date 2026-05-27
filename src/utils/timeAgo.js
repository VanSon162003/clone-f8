export const timeAgo = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffMs = now - createdDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays < 1) {
        const hh = String(createdDate.getHours()).padStart(2, "0");
        const mm = String(createdDate.getMinutes()).padStart(2, "0");
        const ss = String(createdDate.getSeconds()).padStart(2, "0");

        return `${hh}:${mm}:${ss}`;
    }

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    if (years > 0) return `${years} năm trước`;
    if (months > 0) return `${months} tháng trước`;
    return `${days} ngày trước`;
};
