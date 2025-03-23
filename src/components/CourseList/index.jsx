import React from "react";

import CourseItem from "../CourseItem";

function CourseList({ courseType, courseList }) {
    return (
        <div className="row row-cols-4 gy-6">
            {courseList.map((item) => (
                <CourseItem key={item.id} item={item} courseType={courseType} />
            ))}
        </div>
    );
}

export default CourseList;
