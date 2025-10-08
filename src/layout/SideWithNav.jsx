import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import { NavLink, useNavigate } from 'react-router-dom';

import logo from "../assets/image/logo.svg";

const SideWithNav = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // JWT token

    // Redirect to login if token is missing
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const NavLinkItem = [
        { label: "Task", to: "/task" },
    ];

    const ManagerOnlyLinks = [
        { label: "Projects", to: "/project" },
        { label: "Assignees", to: "/assignees" },
    ];

    const handleLogout = () => {
        if (user) {
            const dismissedKey = `dismissedToasts_${user.email || user.name}`;
            localStorage.removeItem(dismissedKey); // clear dismissed tasks
        }

        localStorage.removeItem("user");
        localStorage.removeItem("token"); // remove JWT token
        navigate("/login");
    };

    // While redirecting, render nothing
    if (!token) return null;

    return (
        <Navbar expand="md" className="navbar-section fixed-top">
            <Container>
                <Navbar.Brand href="/task" className='text-white font-20 fw-600'>
                    <img src={logo} alt="logo" loading="lazy" className='img-fluid me-2' width={35} />Taskflow
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" className='border-0 shadow-none' />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="ms-auto my-2 my-lg-0">
                        {NavLinkItem.map((item, index) => (
                            <NavLink to={item.to} key={index} className='font-16 fw-500 ms-3 nav-items'>
                                {item.label}
                            </NavLink>
                        ))}

                        {/* Show only if user is manager */}
                        {user?.role?.toLowerCase() === "manager" &&
                            ManagerOnlyLinks.map((item, index) => (
                                <NavLink to={item.to} key={index} className='font-16 fw-500 ms-3 nav-items'>
                                    {item.label}
                                </NavLink>
                            ))
                        }
                    </Nav>

                    <Dropdown className='ms-3'>
                        <Dropdown.Toggle className='bg-transparent border-0' id="dropdown-basic">
                            <span>{user?.name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='bg-dark'>
                            <Dropdown.Item onClick={handleLogout} className='font-14 fw-500 bg-dark text-white'>
                                <LogoutSharpIcon className='fs-5' /> Log out
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default SideWithNav;
