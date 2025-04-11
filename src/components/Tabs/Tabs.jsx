import React, { useEffect, useRef, useState } from "react";
import styles from "./Tabs.module.scss";

function Tabs({
    defaultIndex = 0,
    children,
    onChange = () => {},
    className = "",
}) {
    const [currentTab, setCurrentTab] = useState(defaultIndex);

    const tabs = React.Children.toArray(children);

    const prevTab = useRef(defaultIndex);

    useEffect(() => {
        if (prevTab.current !== currentTab) onChange(currentTab);

        prevTab.current = currentTab;
    }, [currentTab, onChange]);

    return (
        <div className={`${styles.tabContainer} ${className}`}>
            <div className={styles.tabsList}>
                {tabs.map((tab, i) => (
                    <button
                        onClick={() => {
                            setCurrentTab(i);
                        }}
                        key={i}
                        className={`${styles.tabItem} ${
                            i === currentTab ? styles.active : ""
                        }`}
                    >
                        {tab.props.title}
                    </button>
                ))}
            </div>
            <div className={styles.tabsContent}>{tabs[currentTab]}</div>
        </div>
    );
}

export default Tabs;
