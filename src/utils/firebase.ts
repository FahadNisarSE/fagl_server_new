import { doc, getDoc } from "firebase/firestore";
import { getUser } from "./firebase-admin.ts";
import { FIRESTORE_DB } from "./firebase.config.ts";

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

export async function getCommunityMembersById(userId: string) {
  if (!userId) throw new Error("User id is not defined.");

  const communityDoc = await getDoc(doc(FIRESTORE_DB, "community", userId));
  const memberIds = communityDoc.exists() ? communityDoc.data()?.community : [];

  const memberPromises = memberIds.map((userId: string) => getUser(userId));

  const membersData = (await Promise.all(memberPromises)) as CommunityMember[];
  return membersData.filter((member) => member);
}
