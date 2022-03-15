import { createContext, useState, useContext, useMemo } from 'react';
import { loginData, registerData } from '../interfaces';
import { server } from '../services/server';

interface IAuthContext {
  loggedIn: boolean;
  loading: boolean;
  login: (data: loginData) => Promise<void>;
  register: (data: registerData) => Promise<void>;
  logout: () => void;
  onLoad: () => void;
}
const AuthContext = createContext<IAuthContext | null>(null);

export const useAuthContext = () => {
  return useContext(AuthContext);
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = useState({ loggedIn: false, loading: false });

  const authFunctions = useMemo(() => {
    return {
      login: async (data: loginData) => {
        setAuthState({ loggedIn: false, loading: true });
        return server.login(data)
          .then(() => setAuthState({ loggedIn: true, loading: false }))
          .catch((error) => {
            setAuthState({ loggedIn: false, loading: false });
            console.log(error.response);
          })
      },
      register: async (data: registerData) => {
        setAuthState({ loggedIn: false, loading: true });
        return server.register(data)
          .then(() => setAuthState({ loggedIn: true, loading: false }))
          .catch((error) => {
            setAuthState({ loggedIn: false, loading: false });
            console.log(error.response);
          })
      },
      logout: () => {
        server.logout();
        setAuthState({ loggedIn: false, loading: false });
      },
      onLoad: () => {
        setAuthState((prevState) => {
          return { ...prevState, loading: false }
        })
      }
    }
  }, [])


  const Auth = { ...authState, ...authFunctions };

  return (
    <AuthContext.Provider value={Auth}>
      {children}
    </AuthContext.Provider>
  );
}