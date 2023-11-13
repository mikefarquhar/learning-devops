import { Link } from "react-router-dom";
import { FederatedComponent } from "federated-component";

export function About() {
    return (
        <FederatedComponent
            scope="mfe"
            module="./About"
            fallback={<p>Loading...</p>}
            captureError={console.error}
        />
    );
    // return (
    //     <>
    //         <h1>About</h1>
    //         <ul>
    //             <li>
    //                 <Link to={"/"}>Home</Link>
    //             </li>
    //             <li>
    //                 <Link to={"/about"}>About</Link>
    //             </li>
    //         </ul>
    //     </>
    // );
}
