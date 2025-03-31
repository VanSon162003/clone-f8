import React from "react";

import styles from "./Community.module.scss";
import Button from "@/components/Button";

function Community() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <h2>Tham gia cộng đồng học viên f8 trên Facebook</h2>
                <p>
                    Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy
                    tham gia hỏi đáp, chia sẻ và hỗ trợ nhau trong quá trình học
                    nhé.
                </p>

                <Button
                    href="https://www.facebook.com/groups/f8official"
                    target="_blank"
                >
                    Tham gia nhóm
                </Button>
            </div>
        </div>
    );
}

export default Community;
