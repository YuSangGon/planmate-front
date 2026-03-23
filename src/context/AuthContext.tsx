import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getMe,
  login as loginApi,
  signup as signupApi,
  type AuthUser,
  type UserRole,
} from "../services/authApi";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<void>;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "planmate_access_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedToken) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await getMe(storedToken);
        setToken(storedToken);
        setUser(response.data);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    void bootstrapAuth();
  }, []);

  const login = async (input: { email: string; password: string }) => {
    const response = await loginApi(input);

    localStorage.setItem(AUTH_STORAGE_KEY, response.data.accessToken);
    setToken(response.data.accessToken);
    setUser(response.data.user);
  };

  const signup = async (input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    const response = await signupApi(input);

    localStorage.setItem(AUTH_STORAGE_KEY, response.data.accessToken);
    setToken(response.data.accessToken);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: !!user && !!token,
      isAuthLoading,
      login,
      signup,
      logout,
    }),
    [user, token, isAuthLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
