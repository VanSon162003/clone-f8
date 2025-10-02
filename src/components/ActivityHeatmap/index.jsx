import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styles from "./ActivityHeatmap.module.scss";

const ActivityHeatmap = () => {
    // Generate simple mock data for 12 months
    const generateData = () => {
        const data = [];
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);

        for (let i = 0; i < 365; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            // Simple random activity
            if (Math.random() > 0.4) {
                data.push({
                    date: date.toISOString().split("T")[0],
                    count: Math.floor(Math.random() * 4) + 1,
                });
            }
        }
        return data;
    };

    const activities = generateData();
    const totalActivities = activities.reduce(
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
                    startDate={new Date("2024-01-01")}
                    endDate={new Date("2024-12-31")}
                    values={activities}
                    classForValue={(value) => {
                        if (!value) return "color-empty";
                        return `color-scale-${Math.min(value.count, 4)}`;
                    }}
                    showWeekdayLabels
                    weekdayLabels={["T2", "", "T4", "", "T6", "", ""]}
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
