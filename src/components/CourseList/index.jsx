import React from "react";

import CourseItem from "../CourseItem";

function CourseList({ courseType, courseList, courseEnrolled = false }) {
    return (
        <div
            className={`${
                courseEnrolled ? "row g-4 g-xl-3 g-md-2" : "row row-cols-4 gy-6"
            }`}
        >
            {courseList.map((item) => (
                <CourseItem
                    key={item.id}
                    item={item}
                    courseType={courseType}
                    courseEnrolled={courseEnrolled}
                />
            ))}
        </div>
    );
}

export default CourseList;
