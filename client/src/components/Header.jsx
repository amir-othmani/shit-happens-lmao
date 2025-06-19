import { Navbar } from "react-bootstrap"
import { Link } from "react-router"

function Header() {
  return <Navbar bg='primary py-3 mt-auto'>
            <Link to="/" className="text-decoration-none">
              <h1 className="text-light ms-4">Stuff happens!</h1>
            </Link>
          </Navbar>
}

export default Header