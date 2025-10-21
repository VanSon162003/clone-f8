import { useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styles from "./ActivityHeatmap.module.scss";

const ActivityHeatmap = ({ data = [] }) => {
    const formattedData = useMemo(() => {
        const countsByDate = {};
        data.forEach((item) => {
            let rawDate = item?.date || item?.createdAt;
            if (!rawDate) return;
            let dateObj = new Date(rawDate);
            if (isNaN(dateObj.getTime())) return;
            const date = dateObj.toISOString().split("T")[0];
            countsByDate[date] = (countsByDate[date] || 0) + (item.count || 1);
        });
        const arr = Object.entries(countsByDate).map(([date, count]) => ({
            date,
            count,
        }));
        return arr;
    }, [data]);

    const totalActivities = formattedData.reduce(
        (sum, item) => sum + item.count,
        0
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>
                    {totalActivities} hoạt động trong 12 tháng qua
                </span>
            </div>

            <div className={styles.heatmap}>
                <CalendarHeatmap
                    startDate={new Date(`${new Date().getFullYear()}-01-01`)}
                    endDate={new Date(`${new Date().getFullYear()}-12-31`)}
                    values={formattedData}
                    classForValue={(value) => {
                        if (
                            !value ||
                            !value.date ||
                            !value.count ||
                            value.count <= 0
                        )
                            return "color-empty";
                        let level = 1;
                        if (value.count >= 4) level = 4;
                        else if (value.count === 3) level = 3;
                        else if (value.count === 2) level = 2;
                        else if (value.count === 1) level = 1;
                        return `color-scale-${level}`;
                    }}
                    showWeekdayLabels
                    weekdayLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
                />

                <div className={styles.legend}>
                    <span>Ít hơn</span>
                    <div className={styles.squares}>
                        <div className={styles.square0}></div>
                        <div className={styles.square1}></div>
                        <div className={styles.square2}></div>
                        <div className={styles.square3}></div>
                        <div className={styles.square4}></div>
                    </div>
                    <span>Nhiều hơn</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
