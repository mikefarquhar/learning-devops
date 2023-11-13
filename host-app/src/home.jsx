import { Link } from "react-router-dom";

export function Home() {
    return (
        <>
            <h1>Home</h1>
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
