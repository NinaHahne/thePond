import {useState} from "react";

export function useStatefulFields() {
    const [values, setValues] = useState({});

    const handleChange = e => {
        // problem: old values would be deleted/replaced with setValues, not just updating. "...values" (... = spread operator) is solving that problem
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };
    return [values, handleChange];

}
