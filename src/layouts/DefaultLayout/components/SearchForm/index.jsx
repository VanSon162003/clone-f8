import { useEffect, useRef, useState } from "react";

import styles from "./SearchForm.module.scss";

import searchImg from "@/assets/icons/search.svg";
import SearchResult from "../SearchResult";
function SearchForm() {
    const [value, setValue] = useState("");

    const [close, setClose] = useState(false);
    const [searchResult, setSearchResult] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const [searchCourse, setSearchCourse] = useState([]);
    const [searchArticle, setSearchArticle] = useState([]);
    const [searchVideo, setSearchVideo] = useState([]);

    const input = useRef();

    document.onclick = (e) => {
        const tippy = e.target.closest("._tippy_1kzjv_53");
        const input = e.target.closest("._input_1kzjv_5");

        if (input) {
            if (value) {
                setSearchResult(true);
                return;
            }
        }
        if (!tippy) {
            setSearchResult(false);
            return;
        }
    };

    useEffect(() => {
        if (value.length > 1) {
            const timeId = setTimeout(() => {
                fetch(`http://localhost:3000/free?q=${value}`)
                    .then((res) => res.json())
                    .then((data) => setSearchCourse(data));

                fetch(`http://localhost:3000/article?q=${value}`)
                    .then((res) => res.json())
                    .then((data) => setSearchArticle(data));

                fetch(`http://localhost:3000/video?q=${value}`)
                    .then((res) => res.json())
                    .then((data) => setSearchVideo(data));

                if (
                    searchCourse.length === 0 &&
                    searchArticle.length === 0 &&
                    searchVideo.length === 0
                ) {
                    setShowResult(false);
                } else {
                    setShowResult(true);
                }
            }, 1000);

            return () => {
                clearTimeout(timeId);
            };
        }
    }, [value]);

    const handleCLoseText = () => {
        setValue("");
        setClose(false);
        setSearchResult(false);

        input.current?.focus();
    };

    const handleChangValue = (e) => {
        setValue(e.target.value);
        setClose(e.target.value !== "");
        setSearchResult(e.target.value !== "");
    };

    return (
        <div className={`d-flex-center ${styles.searchForm}`}>
            <div className={`${styles.wrapper} d-flex-center`}>
                <div className={`${styles.searchIcon} d-flex-center`}>
                    <img src={searchImg} alt="search" />
                </div>
                <input
                    ref={input}
                    type="text"
                    placeholder="Tìm kiếm khoá học, bài viết, video, ..."
                    className={styles.input}
                    value={value}
                    onChange={handleChangValue}
                />

                {close && (
                    <div className={styles.closeText} onClick={handleCLoseText}>
                        <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="xmark"
                            className="svg-inline--fa fa-xmark "
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                        >
                            <path
                                fill="currentColor"
                                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                            ></path>
                        </svg>
                    </div>
                )}
            </div>

            {searchResult && (
                <div className={styles.tippy}>
                    <div className={styles.tippyWrap}>
                        <div className={styles.result}>
                            <div className={styles.header}>
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="magnifying-glass"
                                    className="svg-inline--fa fa-magnifying-glass _icon_15ttk_79"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                                    ></path>
                                </svg>

                                {showResult ? (
                                    <span>Không có kết quả cho '{value}'</span>
                                ) : (
                                    <span>Kết quả cho '{value}'</span>
                                )}
                            </div>

                            <SearchResult
                                setClose={setClose}
                                title={"Khoá học"}
                                setSearchResult={setSearchResult}
                                setValue={setValue}
                                searchList={searchCourse}
                            />

                            <SearchResult
                                setClose={setClose}
                                title={"Bài viết"}
                                setSearchResult={setSearchResult}
                                setValue={setValue}
                                searchList={searchArticle}
                            />

                            <SearchResult
                                setClose={setClose}
                                title={"Video"}
                                setSearchResult={setSearchResult}
                                setValue={setValue}
                                searchList={searchVideo}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchForm;
