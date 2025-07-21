import {  
  createContext,  
  useContext,  
  useEffect,  
  useState,  
  type ReactNode,  
} from "react";  

// Tipo del contexto  
interface AuthContextType {  
  token: string | null;  
  login: (tokenLogin: string) => void;  
  logout: () => void;  
}  

const AuthContext = createContext<AuthContextType | undefined>(undefined);  

export function AuthProvider({ children }: { children: ReactNode }) {  
  const [token, setToken] = useState<string | null>(null);  

  // Cargar token desde localStorage al montar  
  useEffect(() => {  
    const tokenStored = localStorage.getItem("Token");  
    if (tokenStored) {  
      setToken(tokenStored);  
    }  
  }, []);  

  // Función para iniciar sesión  
  const login = (tokenLogin: string) => {  
    try {  
      setToken(tokenLogin);  
      localStorage.setItem("Token", tokenLogin);  
    } catch (error) {  
      console.error("Error al guardar el token:", error);  
    }  
  };  

  // Función para cerrar sesión  
  const logout = () => {  
    try {  
      setToken(null);  
      localStorage.removeItem("Token");  
    } catch (error) {  
      console.error("Error al eliminar el token:", error);  
    }  
  };  

  return (  
    <AuthContext.Provider value={{ token, login, logout }}>  
      {children}  
    </AuthContext.Provider>  
  );  
}  

// Hook personalizado para acceder al contexto  
export function useAuth() {  
  const context = useContext(AuthContext);  
  if (!context) {  
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");  
  }  
  return context;  
}