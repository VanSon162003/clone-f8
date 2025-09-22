export const timeAgo = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffMs = now - createdDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
        return "Hôm nay";
    }

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    if (years > 0) {
        return years === 1 ? "1 năm trước" : `${years} năm trước`;
    }

    if (months > 0) {
        return months === 1 ? "1 tháng trước" : `${months} tháng trước`;
    }

    return days === 1 ? "1 ngày trước" : `${days} ngày trước`;
};
