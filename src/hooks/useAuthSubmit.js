import { useState } from "react";
import axios from '../axios';

export function useAuthSubmit(url, values) {
    const [error, setError] = useState();

    const handleSubmit = () => {
        axios
            .post(url, values)
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    setError(true);
                }
            })
            .catch(err => {
                console.log("err in useAuthSubmit: ", err);
                setError(true);
            });
    };
    return [error, handleSubmit];
}
