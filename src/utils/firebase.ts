import { doc, getDoc } from "firebase/firestore";
import { getUser } from "./firebase-admin.js";
import { FIRESTORE_DB } from "./firebase.config.js";
import { get, getDatabase, ref } from "firebase/database";

export interface CommunityMember {
  uid: string;
  email: string;
  emailVerified: boolean;
  disabled: boolean;
  metadata: Metadata;
  tokensValidAfterTime: string;
  providerData: ProviderDatum[];
}

export interface Metadata {
  lastSignInTime: string;
  creationTime: string;
  lastRefreshTime: string;
}

export interface ProviderDatum {
  uid: string;
  email: string;
  providerId: string;
}

type User = {
  id: string;
  created_at: string;
  diseases: string[];
  dob: string;
  gender: "Male" | "Female";
  image?: string;
  name: string;
  phoneNumber: string;
};

const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      return { id: userId, ...(userData as Omit<User, "id">) };
    } else {
      console.warn(`User with ID ${userId} not found`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export async function getCommunityMembersById(userId: string) {
  if (!userId) throw new Error("User id is not defined.");

  try {
    const communityDoc = await getDoc(doc(FIRESTORE_DB, "community", userId));
    const memberIds = communityDoc.exists()
      ? communityDoc.data()?.community
      : [];

    const memberPromises = memberIds.map(async (memberId: string) => {
      const basicInfo = await getUser(memberId);
      const additionalInfo = await getUserById(memberId);

      return {
        ...basicInfo,
        ...additionalInfo,
      };
    });

    const membersData = (await Promise.all(memberPromises)).filter(Boolean);
    return membersData;
  } catch (error) {
    console.error("Error fetching community members:", error);
    return [];
  }
}
