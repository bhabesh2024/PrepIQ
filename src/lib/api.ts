import { auth, db, googleProvider } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const QuestionsAPI = {
  fetchBySubject: async (subject: string, topic?: string) => {
    // 1. Subject check karega (exact match chahiye jaise "Mathematics")
    let q = query(collection(db, "questions"), where("subject", "==", subject));
    
    // 2. JSON me URL wala topic 'chapterId' me hai (jaise "algebra")
    if (topic) {
      q = query(q, where("chapterId", "==", topic));
    }
    
    const querySnapshot = await getDocs(q);
    // JSON me "id" number nahi balki Firebase ka string ID hota hai
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  submitQuiz: async (results: any) => {
    const docRef = await addDoc(collection(db, "quiz_results"), results);
    return { id: docRef.id, ...results };
  }
};

export const AuthAPI = {
  login: async (credentials: { identifier: string; password?: string }) => {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.identifier, credentials.password!);
    return { token: await userCredential.user.getIdToken(), user: userCredential.user };
  },
  
  signup: async (userData: { name: string; username: string; phone: string; email: string; password?: string; }) => {
    // 1. Firebase Auth me user banayein
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password!);
    
    // 2. Auth Profile me Name update karein
    await updateProfile(userCredential.user, { displayName: userData.name });

    // 3. Firestore 'profiles' collection me extra data save karein
    await setDoc(doc(db, "profiles", userCredential.user.uid), {
      name: userData.name,
      username: userData.username,
      phone: userData.phone,
      email: userData.email,
      createdAt: new Date().toISOString()
    });

    return { token: await userCredential.user.getIdToken(), user: userCredential.user };
  },

  loginWithGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check karein ki user pehli baar aaya hai kya
    const profileRef = doc(db, "profiles", result.user.uid);
    const profileSnap = await getDoc(profileRef);

    // Agar naya user hai toh database me profile bana dein
    if (!profileSnap.exists()) {
      await setDoc(profileRef, {
        name: result.user.displayName,
        email: result.user.email,
        username: result.user.email?.split('@')[0], // Email se username nikal liya
        phone: result.user.phoneNumber || "",
        createdAt: new Date().toISOString()
      });
    }

    return { token: await result.user.getIdToken(), user: result.user };
  }
};