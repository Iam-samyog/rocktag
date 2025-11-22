import { db } from "@/config/firebase"; 
import { GeoPoint } from "firebase/firestore";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

interface Cat {
  id: string,
  about: string,
  coordinates: GeoPoint,
  dietary_restrictions: string[],
  fav_spot: string,
  feeding_time: string[],
  image_url: string,
  recommended_snacks: string[],
  tagline: string,
  where_not_to_rub: string[],
  where_to_rub: string[]
};

export async function getAllCats() {
  const catsCollectionRef = collection(db, 'cats');

  const snapshot = await getDocs(catsCollectionRef);
  const catsArr : Cat[] = snapshot.docs.map(doc => {
    return {
      id: doc.id, 
      ...doc.data()
    } as Cat;
  });

  const catsObj = catsArr.reduce<Record<string, Cat>>((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  return catsObj;
}

export async function getCat(catId : string) : Promise<Cat | null> {
  const catDocRef = doc(db, 'cats', catId);

  const docSnapshot = await getDoc(catDocRef)

  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    
    return {
        id: docSnapshot.id,
        ...data
    } as Cat;
  } else {
    return null;
  }
}

export async function createOrUpdateCat(newCat : Cat) {
  try {
    const catDocRef = doc(db, 'cats', newCat.id);
    await setDoc(catDocRef, newCat);

    console.log(`Successfully added/updated cat ${newCat.id}`);
  } catch (err) {
    console.error(`Could not add/update cat ${newCat.id}. `, err);
  }
}

export async function deleteCat(catId : string) {
  try {
    const catDocRef = doc(db, 'cats', catId);
    await deleteDoc(catDocRef);

    console.log(`Successfully deleted cat ${catId}`);
  } catch (err) {
    console.error(`Could not delete cat ${catId}. `, err);
  }
}