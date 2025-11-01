import { Button, Card, Space } from "antd";
import { EditOutlined, DeleteOutlined, MenuOutlined } from "@ant-design/icons";
import { useDrag, useDrop } from "react-dnd";
import isHttps from "@/utils/isHttps";
import PropTypes from "prop-types";
import { useRef } from "react";
import { ItemTypes } from "./constants";

const lessonPropType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    track: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        course: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
});

LessonItem.propTypes = {
    lesson: lessonPropType.isRequired,
    index: PropTypes.number.isRequired,
    handleEdit: PropTypes.func.isRequired,
    setSelectedLesson: PropTypes.func.isRequired,
    setIsDeleteModalOpen: PropTypes.func.isRequired,
    onMoveLesson: PropTypes.func.isRequired,
};

export default function LessonItem({
    lesson,
    index,
    handleEdit,
    setSelectedLesson,
    setIsDeleteModalOpen,
    onMoveLesson,
}) {
    const ref = useRef(null);

    const [{ isDragging }, drag, dragPreview] = useDrag({
        type: ItemTypes.LESSON,
        item: { id: lesson.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.LESSON,
        hover: (item) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Time to actually perform the action
            onMoveLesson(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    return (
        <div ref={dragPreview}>
            <Card.Grid
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                    marginBottom: 8,
                    opacity,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div ref={ref}>
                        <MenuOutlined style={{ cursor: "grab" }} />
                    </div>
                    <img
                        src={
                            isHttps(lesson.thumbnail)
                                ? lesson.thumbnail
                                : `${import.meta.env.VITE_BASE_URL}${
                                      lesson.thumbnail
                                  }`
                        }
                        alt={lesson.title}
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: "bold" }}>{lesson.title}</div>
                        <div>{lesson.description || "Không có mô tả"}</div>
                    </div>
                </div>
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(lesson)}
                    >
                        Sửa
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setSelectedLesson(lesson);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Xóa
                    </Button>
                </Space>
            </Card.Grid>
        </div>
    );
}
