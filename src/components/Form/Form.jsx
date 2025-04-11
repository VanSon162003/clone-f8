import React from "react";
import { ALLOW_REGISTER_INPUTS } from "./consts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function Form({
    onSubmit = () => {},
    schema,
    defaultValue,
    formProps,
    children,
}) {
    const config = {
        defaultValue,
        ...formProps,
    };

    if (schema) config.resolver = yupResolver(schema);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(config);

    const inputs = React.Children.toArray(children).map((child) => {
        if (!ALLOW_REGISTER_INPUTS.includes(child.type)) return child;

        return React.cloneElement(child, {
            register: register(child.props.name),
            message: errors[child.props.name]?.message,
        });
    });

    return <form onSubmit={handleSubmit(onSubmit)}>{inputs}</form>;
}

export default Form;
