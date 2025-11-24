import { db } from "@/config/firebase"; 
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

interface User {
  id: string,
  displayName: string,
  role: string //remove to use custom claims
};

export async function getAllUsers() {
  try {
    const userCollectionRef = collection(db, 'users');

    const snapshot = await getDocs(userCollectionRef);
    const usersArr : User[] = snapshot.docs.map(doc => {
      return {
        id: doc.id, 
        ...doc.data()
      } as User;
    });

    const usersObj = usersArr.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    return usersObj;
  } catch (err) {
    console.error('Getting all users failed. ', err);
  }
}

export async function getUser(userId : string) : Promise<User | null> {
  try {
    const userDocRef = doc(db, 'users', userId);

    const docSnapshot = await getDoc(userDocRef)

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      
      return {
          id: docSnapshot.id,
          ...data
      } as User;
    } else {
      return null;
    }
  } catch (err) {
    console.error(`Getting user ${userId} failed. `, err);
    return null;
  }
}

// !!! Need to prevent admins banning admins !!!

export async function banUser(userId : string) {
  try {
    const bannedDocRef = doc(db, 'banned', userId);

    await setDoc(bannedDocRef, {
      id: userId
    });

    console.log("banned ID: ", userId);
  } catch (err) {
    console.error(`Error banning user: ${userId} `, err);
  }
}

export async function unbanUser(userId : string) {
  try {
    const bannedDocRef = doc(db, 'banned', userId);
    await deleteDoc(bannedDocRef);
    console.log(`Document with ID ${userId} successfully unbanned`);
  } catch (err) {
    console.error(`Error unbanning user: ${userId} `, err);
  }
}