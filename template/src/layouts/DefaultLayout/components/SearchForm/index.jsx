import React, { useRef } from "react";
import styles from "./SearchForm.module.scss";

import searchImg from "@/assets/icons/search.svg";
function SearchForm() {
    return (
        <div className={`d-flex-center ${styles.searchForm}`}>
            <div className={`${styles.wrapper} d-flex-center`}>
                <div className={`${styles.searchIcon} d-flex-center`}>
                    <img src={searchImg} alt="search" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm khoá học, bài viết, video, ..."
                    className={styles.input}
                />
            </div>
        </div>
    );
}

export default SearchForm;
