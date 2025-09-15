import Button from "@/components/Button";
import styles from "./BlogDetail.module.scss";
import ParentCard from "@/components/ParentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@/components/Avatar";
import Actions from "@/components/Actions";
import BlogItem from "../Blog/components/BlogItem";

function BlogDetail() {
    const [countHearts, setCountHearts] = useState(0);
    const [isHearts, setIsHearts] = useState(false);
    const [countComments, setCountComments] = useState(0);

    const handleHeart = () => {
        if (isHearts) {
            if (countHearts === 0) return;

            setCountHearts(countHearts - 1);

            setIsHearts(!isHearts);
        } else {
            setCountHearts(countHearts + 1);
            setIsHearts(!isHearts);
        }
    };

    return (
        <ParentCard>
            <div className="row">
                <div className="col col-3  col-xxl-2 d-lg-none ">
                    <div className={styles.aside}>
                        <Button href="/@name">
                            <h4 className={styles.username}>username</h4>
                        </Button>
                        <p className={styles.userTitle}>Có hoặc không</p>
                        <hr />
                        <div className={styles.wrapper}>
                            <div
                                onClick={handleHeart}
                                className={`${styles.bntReact} ${
                                    isHearts && styles.active
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={isHearts ? faHeartSolid : faHeart}
                                />
                                <span>{countHearts}</span>
                            </div>
                            <div className={styles.bntReact}>
                                <FontAwesomeIcon icon={faComment} />
                                <span>{countComments}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-6 col-xxl-8 col-lg-12">
                    <article>
                        <h1 className={styles.heading}>Tieu de ow day</h1>
                        <div className={styles.header}>
                            <div className={styles.user}>
                                <Avatar
                                    username={`/@oke`}
                                    blog
                                    fontSize={"5.6px"}
                                    authorName={"Son Van"}
                                    avatar={`/src/assets/imgs/user.jpg`}
                                />
                            </div>
                            <Actions />
                        </div>

                        <div className={styles.wrapperContent}></div>
                    </article>

                    <div className={styles.bodyBottom}>
                        <div className={styles.wrapper}>
                            <div
                                onClick={handleHeart}
                                className={`${styles.bntReact} ${
                                    isHearts && styles.active
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={isHearts ? faHeartSolid : faHeart}
                                />
                                <span>{countHearts}</span>
                            </div>
                            <div className={styles.bntReact}>
                                <FontAwesomeIcon icon={faComment} />
                                <span>{countComments}</span>
                            </div>
                        </div>

                        <div className={styles.tags}>
                            {/* map */}
                            <a href="#!" className={styles.tag}>
                                DevOps
                            </a>
                            <a href="#!" className={styles.tag}>
                                DevOps
                            </a>
                        </div>

                        <div className={styles.relatedPost}>
                            <h3 className={styles.relatedHeading}></h3>
                        </div>

                        <BlogItem />
                    </div>
                </div>
            </div>
        </ParentCard>
    );
}

export default BlogDetail;
