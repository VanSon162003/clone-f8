import React from "react";
import { Link } from "react-router-dom";
import styles from "./SearchResult.module.scss";

function SearchResult({
    title,
    searchList,
    setSearchResult,
    setClose,
    setValue,
}) {
    return (
        <>
            {searchList.length > 0 && (
                <div>
                    <div className={styles.heading}>
                        <h5>{title}</h5>
                        <Link
                            to="search"
                            className={styles.seeMore}
                            onClick={() => {
                                setSearchResult(false);
                                setClose(false);
                                setValue("");
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
                                    <img src={item.img} alt={item.title} />
                                </div>
                                <span>{item.title}</span>
                            </Link>
                        ))}
                </div>
            )}
        </>
    );
}

export default SearchResult;
