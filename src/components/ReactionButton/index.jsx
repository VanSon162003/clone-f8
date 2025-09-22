import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import styles from "./ReactionButton.module.scss";

function ReactionButton({
    onReact,
    reactions = [],
    handleCountActedIds = () => {},
    userReaction = null,
}) {
    const [selected, setSelected] = useState(userReaction);

    useEffect(() => {
        setSelected(userReaction);
    }, [userReaction]);

    const handleReact = (reaction) => {
        const wasSelected = selected && selected.id === reaction.id;

        if (selected && !wasSelected) {
            handleCountActedIds({
                react: selected,
                isReact: false,
                isChange: true,
            });

            handleCountActedIds({
                react: reaction,
                isReact: true,
                isChange: true,
                previousReact: selected,
            });
        } else {
            handleCountActedIds({
                react: reaction,
                isReact: !wasSelected,
                isChange: false,
            });
        }

        const newSelected = wasSelected ? null : reaction;
        setSelected(newSelected);
        onReact?.(newSelected);
    };

    const toggleReact = () => {
        const defaultReaction = { id: 1, icon: "👍", label: "Thích" };
        const wasSelected = selected && selected.id === defaultReaction.id;

        if (selected && !wasSelected) {
            handleCountActedIds({
                react: selected,
                isReact: false,
                isChange: true,
            });

            handleCountActedIds({
                react: defaultReaction,
                isReact: true,
                isChange: true,
                previousReact: selected,
            });
        } else {
            handleCountActedIds({
                react: defaultReaction,
                isReact: !wasSelected,
                isChange: false,
            });
        }

        const newSelected = wasSelected ? null : defaultReaction;
        setSelected(newSelected);
        onReact?.(newSelected);
    };

    const getReactionColor = (reactionId) => {
        const colors = {
            1: "#1877f2", // Thích - xanh Facebook
            2: "#e91e63", // Yêu thích - đỏ hồng
            3: "#f7b125", // Haha - vàng
            4: "#f7b125", // Wow - vàng
            5: "#f7b125", // Buồn - vàng
            6: "#e91e63", // Phẫn nộ - đỏ
        };
        return colors[reactionId] || "#1877f2";
    };

    return (
        <Tippy
            className={styles.reaction}
            content={
                <div className={styles.reactionContainer}>
                    {reactions.map((r) => (
                        <span
                            key={r.id}
                            className={`${styles.react} ${
                                selected && selected.id === r.id
                                    ? styles.selected
                                    : ""
                            }`}
                            data-label={r.label}
                            onClick={() => handleReact(r)}
                            title={r.label}
                        >
                            {r.icon}
                        </span>
                    ))}
                </div>
            }
            placement="top"
            interactive={true}
            delay={[500, 100]}
            arrow={false}
            onHidden={true}
        >
            <button
                onClick={toggleReact}
                className={`${styles.interaction} ${
                    selected ? styles.reacted : ""
                }`}
                style={{
                    color: selected ? getReactionColor(selected.id) : undefined,
                }}
            >
                {selected ? (
                    <>
                        <span>{selected.label}</span>
                    </>
                ) : (
                    "Thích"
                )}
            </button>
        </Tippy>
    );
}

export default ReactionButton;
