import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Create a Context for the user role
const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    }, []);

    return (
        <UserContext.Provider value={{ role, setRole }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
