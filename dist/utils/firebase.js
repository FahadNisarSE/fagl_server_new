import { doc, getDoc } from "firebase/firestore";
import { getUser } from "./firebase-admin.js";
import { FIRESTORE_DB } from "./firebase.config.js";
export async function getCommunityMembersById(userId) {
    if (!userId)
        throw new Error("User id is not defined.");
    const communityDoc = await getDoc(doc(FIRESTORE_DB, "community", userId));
    const memberIds = communityDoc.exists() ? communityDoc.data()?.community : [];
    const memberPromises = memberIds.map((userId) => getUser(userId));
    const membersData = (await Promise.all(memberPromises));
    return membersData.filter((member) => member);
}
