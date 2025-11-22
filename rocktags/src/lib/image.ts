import { storage } from "../config/firebase"; 
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";


// Shape of a photo we return from our helpers
export interface CatPhoto {
  name: string;     
  fullPath: string;  
  url: string;       
}

// Get list of cats 
export async function getCats(): Promise<string[]> {
  const rootRef = ref(storage);          
  const result = await listAll(rootRef);

  return result.prefixes.map((folderRef) => folderRef.name);
}

export async function getCatPhotos(catName: string): Promise<CatPhoto[]> {
  const folderRef = ref(storage, `${catName}/`);
  const result = await listAll(folderRef);

  const photos = await Promise.all(
    result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        url,
      } as CatPhoto;
    })
  );

  return photos;
}

// Post a photo
export async function postPhoto(
  catName: string,
  file: File

): Promise<CatPhoto> {
  const path = `${catName}/${file.name}`;
  const fileRef = ref(storage, path);

  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return {
    name: snapshot.ref.name,
    fullPath: snapshot.ref.fullPath,
    url,
  };
}

// Add a photo
export async function addPhoto(
  catName: string,
  file: File
): Promise<CatPhoto> {
  return postPhoto(catName, file);
}

// Delete a photo
export async function deletePhoto(
    catName: string,
    fileName: string
): Promise<void> {
  const fileRef = ref(storage, `${catName}/${fileName}`);
  await deleteObject(fileRef);
}
