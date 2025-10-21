import { useEffect, useRef, useState } from "react";
import styles from "./SearchForm.module.scss";
import searchImg from "@/assets/icons/search.svg";
import SearchResult from "../SearchResult";
import { useSearchQuery } from "@/services/searchService";
import useDebounce from "@/hook/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
function SearchForm() {
    const [value, setValue] = useState("");

    const [close, setClose] = useState(false);
    const [searchResult, setSearchResult] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const input = useRef();
    const debouncedValue = useDebounce(value, 500);

    const { data: searchResults, isFetching } = useSearchQuery(
        { q: debouncedValue },
        {
            skip: !debouncedValue || debouncedValue.trim().length < 2,
        }
    );

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
        if (debouncedValue && debouncedValue.trim().length >= 2) {
            const hasResults =
                searchResults?.data &&
                (searchResults.data.courses?.length > 0 ||
                    searchResults.data.posts?.length > 0 ||
                    searchResults.data.videos?.length > 0);
            setShowResult(hasResults);
        } else {
            setShowResult(false);
        }
    }, [debouncedValue, searchResults]);

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
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                )}
            </div>

            {searchResult && (
                <div className={styles.tippy}>
                    <div className={styles.tippyWrap}>
                        <div className={styles.result}>
                            <div className={styles.header}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />

                                {debouncedValue.trim().length < 2 ? (
                                    <span>
                                        Vui lòng nhập ít nhất 2 ký tự để tìm
                                        kiếm
                                    </span>
                                ) : showResult ? (
                                    <span>Kết quả cho &apos;{value}&apos;</span>
                                ) : (
                                    <span>
                                        Không có kết quả cho &apos;{value}&apos;
                                    </span>
                                )}
                            </div>

                            {searchResults?.data && (
                                <>
                                    <SearchResult
                                        setClose={setClose}
                                        title={"Khoá học"}
                                        setSearchResult={setSearchResult}
                                        setValue={setValue}
                                        searchList={
                                            searchResults.data.courses || []
                                        }
                                        value={value}
                                    />

                                    <SearchResult
                                        setClose={setClose}
                                        title={"Bài viết"}
                                        setSearchResult={setSearchResult}
                                        setValue={setValue}
                                        searchList={
                                            searchResults.data.posts || []
                                        }
                                        value={value}
                                    />

                                    <SearchResult
                                        setClose={setClose}
                                        title={"Video"}
                                        setSearchResult={setSearchResult}
                                        setValue={setValue}
                                        searchList={
                                            searchResults.data.videos || []
                                        }
                                        value={value}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchForm;
