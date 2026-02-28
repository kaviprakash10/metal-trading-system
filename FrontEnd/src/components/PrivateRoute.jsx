import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute(props) {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('token')) { // wihtout logginf in, if the user tries to access protected pages, he redireact
            return navigate("/login");
        }
    }, [])
    if (!localStorage.getItem('token')) { // loading is called before the navigation, when the user is not logged in
        return <p>Loading...</p>
    }
    return props.children; // if the user is logged in , then the page is displayed
}