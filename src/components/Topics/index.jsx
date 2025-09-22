import React from "react";
import styles from "./Topics.module.scss";

function Topics(marginTop = false) {
    return (
        <aside className={`${styles.wrapper} ${marginTop && styles.mt}`}>
            <h3>Xem các bài viết theo chủ đề</h3>

            <ul className={styles.topPic}>
                <li>
                    <a href="#">Front-end / Mobile apps</a>
                </li>
                <li>
                    <a href="#">Back-end / Devops</a>
                </li>
                <li>
                    <a href="#">UI / UX / Design</a>
                </li>
                <li>
                    <a href="#">Others</a>
                </li>
            </ul>
        </aside>
    );
}

export default Topics;
