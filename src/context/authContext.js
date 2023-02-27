import React, { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  //GoogleAuthProvider,
  //signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Auth/firebase";
import LoadingSpinner from '../components/Loading'
import { getDownloadURL, getStorage, ref, uploadBytes,} from "firebase/storage";


const storage = getStorage();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    });
  }, []);

  const updateUser = async(file, email, displayName, currentUser, setLoading, setOk) => {

    const fileRef = ref(storage, 'images/'+ currentUser.uid + '.png');
  
    setLoading(true);

    await uploadBytes(fileRef, file)

    const photoURL = await getDownloadURL(fileRef);
  
    updateProfile(currentUser, {photoURL, email, displayName});
    
    setLoading(false);

    setOk(true)
  }

  const login = (email, password, remember) => {
    setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  };

  /*const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };*/

  const logout = () => signOut(auth);

  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  if(pending){
    return <LoadingSpinner styleContainer={{backgroundColor: '#ecf0f4'}}/>
  }



  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        updateUser,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};