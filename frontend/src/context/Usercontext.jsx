import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Create a Context for the user role
const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedToken = localStorage.getItem("accessToken");
        setRole(storedRole);
        setToken(storedToken);
    }, []);

    return (
        <UserContext.Provider value={{ role, setRole, token, setToken }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
