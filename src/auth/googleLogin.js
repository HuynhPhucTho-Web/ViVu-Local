import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../components/firebase"

const provider = new GoogleAuthProvider()

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    avatar: user.photoURL,
  }
}
