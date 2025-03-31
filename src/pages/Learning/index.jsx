import styles from "./Learning.module.scss";
import Roadmap from "./components/Roadmap";
import Community from "./components/Community";

function Learning() {
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <h1 className={styles.heading}>Lộ trình học</h1>
                <div className={`${styles.desc} ${styles.warp}`}>
                    <p>
                        Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một
                        lộ trình học. Ví dụ: Để đi làm với vị trí "Lập trình
                        viên Front-end" bạn nên tập trung vào lộ trình
                        "Front-end".
                    </p>
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.content}>
                    <Roadmap type="frontEnd" />
                    <Roadmap type="backEnd" />
                </div>
                <Community />
            </div>
        </div>
    );
}

export default Learning;
