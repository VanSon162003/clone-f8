import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./SearchResult.module.scss";
import isHttps from "@/utils/isHttps";

function SearchResult({
    title,
    searchList = [],
    setSearchResult,
    setClose,
    value,
}) {
    return (
        <>
            {searchList.length > 0 && (
                <div>
                    <div className={styles.heading}>
                        <h5>{title}</h5>
                        <Link
                            to={`/search-results?q=${value}&type=${
                                title === "Khoá học" ? "courses" : "posts"
                            }`}
                            className={styles.seeMore}
                            onClick={() => {
                                setSearchResult(false);
                                setClose(false);
                            }}
                        >
                            Xem thêm
                        </Link>
                    </div>

                    {searchList
                        .filter((_, i) => i < 3)
                        .map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={styles.searchItem}
                            >
                                <div className={styles.avatar}>
                                    <img
                                        src={
                                            isHttps(item.img)
                                                ? item.img
                                                : `${
                                                      import.meta.env
                                                          .VITE_BASE_URL
                                                  }${item.img}`
                                        }
                                        alt={item.title}
                                    />
                                </div>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: item.title,
                                    }}
                                />
                            </Link>
                        ))}
                </div>
            )}
        </>
    );
}

SearchResult.propTypes = {
    title: PropTypes.string.isRequired,
    searchList: PropTypes.array,
    setSearchResult: PropTypes.func.isRequired,
    setClose: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default SearchResult;
