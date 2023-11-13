import { Link } from "react-router-dom";

export function About() {
    return (
        <>
            <h1>About</h1>
            <ul>
                <li>
                    <Link to={"/"}>Home</Link>
                </li>
                <li>
                    <Link to={"/about"}>About</Link>
                </li>
            </ul>
        </>
    );
}
