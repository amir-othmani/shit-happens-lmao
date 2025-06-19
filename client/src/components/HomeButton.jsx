import { Button } from "react-bootstrap";
import { Link } from "react-router";

function HomeButton() {
    return (
        <Link to="/">
            <Button variant="primary">Go to Homepage</Button>
        </Link>
    );
}

export default HomeButton;