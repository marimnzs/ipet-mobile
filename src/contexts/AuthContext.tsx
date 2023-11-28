import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

type TAuthContext = {
  isLoggedIn: boolean;
  user: FirebaseAuthTypes.User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  initializing: boolean;
};

const AuthContext = React.createContext<TAuthContext>({} as TAuthContext);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(_user => {
      if (initializing) {
        setInitializing(false);
      }
      setUser(_user);
    });

    return unsubscribe;
  }, [initializing]);

  async function signIn(email: string, password: string) {
    await auth().signInWithEmailAndPassword(email, password);
  }

  function signOut() {
    auth().signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: Boolean(user),
        user,
        signIn,
        signOut,
        initializing,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
