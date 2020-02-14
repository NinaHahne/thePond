import { useState } from "react";
import axios from '../axios';

export function useAuthSubmit(url, values) {
    const [error, setError] = useState();

    const handleSubmit = () => {
        // const soundHopIn = new Audio("/sounds/364700__alegemaate__water-splash.wav");
        axios
            .post(url, values)
            .then(({ data }) => {
                if (data.success) {
                    // const soundHopIn = new Audio("../../public/sounds/364700__alegemaate__water-splash.wav");
                    // soundHopIn.play();
                    // setTimeout(location.replace("/"), 500);
                    // soundHopIn.play();
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
