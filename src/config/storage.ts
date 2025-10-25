import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth } from './firebase';

const storage = getStorage();

/**
 * Upload profile picture to Firebase Storage
 * @param file Image file to upload
 * @returns Download URL of uploaded image
 */
export const uploadProfilePicture = async (file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to upload profile picture');
  }

  const userId = auth.currentUser.uid;
  const fileExtension = file.name.split('.').pop();
  const fileName = `avatar.${fileExtension}`;
  const storageRef = ref(storage, `profiles/${userId}/${fileName}`);

  // Upload file
  await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

/**
 * Upload profile picture from webcam capture (base64)
 * @param base64Image Base64 encoded image string
 * @returns Download URL of uploaded image
 */
export const uploadProfilePictureFromWebcam = async (base64Image: string): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to upload profile picture');
  }

  // Convert base64 to blob
  const response = await fetch(base64Image);
  const blob = await response.blob();

  const userId = auth.currentUser.uid;
  const fileName = `avatar-webcam.jpg`;
  const storageRef = ref(storage, `profiles/${userId}/${fileName}`);

  // Upload blob
  await uploadBytes(storageRef, blob);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

/**
 * Upload profile video
 * @param file Video file to upload
 * @returns Download URL of uploaded video
 */
export const uploadProfileVideo = async (file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to upload profile video');
  }

  // Validate file size (max 50MB)
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('Video file size must be less than 50MB');
  }

  // Validate duration (max 30 seconds) - basic check via file size estimate
  // For a more accurate check, you'd need to load the video element

  const userId = auth.currentUser.uid;
  const fileExtension = file.name.split('.').pop();
  const fileName = `profile-video.${fileExtension}`;
  const storageRef = ref(storage, `profiles/${userId}/videos/${fileName}`);

  // Upload file
  await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

/**
 * Delete profile picture
 * @param photoURL URL of the photo to delete
 */
export const deleteProfilePicture = async (photoURL: string): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to delete profile picture');
  }

  try {
    const storageRef = ref(storage, photoURL);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    // Don't throw - deletion might fail if file doesn't exist
  }
};

/**
 * Upload timeline event photo
 * @param eventId Timeline event ID
 * @param file Image file to upload
 * @returns Download URL of uploaded image
 */
export const uploadTimelinePhoto = async (eventId: string, file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to upload timeline photos');
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image file size must be less than 10MB');
  }

  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `timeline-photos/${eventId}/${fileName}`);

  // Upload file
  await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

/**
 * Upload family shared media
 * @param category Category of media (e.g., 'achievements', 'events', 'screensavers')
 * @param file File to upload
 * @returns Download URL of uploaded file
 */
export const uploadFamilyMedia = async (category: string, file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to upload family media');
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `family-media/${category}/${fileName}`);

  // Upload file
  await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export default storage;
