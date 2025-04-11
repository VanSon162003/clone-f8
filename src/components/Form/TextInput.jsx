import React from "react";

function TextInput({ type = "text", name, register, message }) {
    return (
        <div>
            <input type="text" name={name} {...register} />
            {message && <div>{message}</div>}
        </div>
    );
}

export default TextInput;
