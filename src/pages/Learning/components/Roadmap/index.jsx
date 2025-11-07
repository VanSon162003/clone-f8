import styles from "./Roadmap.module.scss";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { setHeaderBack } from "@/features/auth/headerSlice";

function Roadmap({ data = {} }) {
    console.log(data);

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(setHeaderBack(true));
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <div className={styles.info}>
                    <h2 className={styles.title}>
                        <Button
                            onClick={handleClick}
                            to={`/learning-paths/${data.slug}`}
                        >
                            {data?.title}
                        </Button>
                    </h2>

                    <p className={styles.desc}>{data?.description}</p>
                </div>
                <div className={styles.thumb}>
                    <Button
                        onClick={handleClick}
                        to={`/learning-paths/${data.slug}`}
                        className={styles.thumbRound}
                    >
                        <img
                            src={`${import.meta.env.VITE_BASE_URL}${
                                data.thumbnail
                            }`}
                            alt={data?.title}
                        />
                    </Button>
                </div>
            </div>

            {/* CTA có thể lấy từ server nếu cần trong tương lai */}

            <div>
                <Button
                    onClick={handleClick}
                    to={`/learning-paths/${data.slug}`}
                    rounded
                    primary
                    size="medium"
                    className={`${styles.wrapBtn}`}
                >
                    <span className={styles.inner}>XEM CHI TIẾT</span>
                </Button>
            </div>
        </div>
    );
}

export default Roadmap;
