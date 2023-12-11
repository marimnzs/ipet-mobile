import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {get, ref} from 'firebase/database';
import db from '../firebase';

type TAuthContext = {
  isLoggedIn: boolean;
  user: FirebaseAuthTypes.User | null;
  userAddresses: LocalizacaoMobile[];
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  initializing: boolean;
};

export interface LocalizacaoMobile {
  latitude: number;
  longitude: number;
  rua: string;
}

const AuthContext = React.createContext<TAuthContext>({} as TAuthContext);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userAddresses, setUserAddresses] = useState<LocalizacaoMobile[]>([]);

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

  //pegando endereços do usuário
  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = ref(db, 'IpetClientsMobile/' + user.uid + '/enderecos');
        const docSnap = await get(docRef);
        if (!docSnap.exists()) {
          console.log('Documento não encontrado!');
          return;
        }

        const data = docSnap.val();

        const dataArray = Object.values(data) as LocalizacaoMobile[];
        setUserAddresses(dataArray);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: Boolean(user),
        user,
        signIn,
        signOut,
        initializing,
        userAddresses,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
