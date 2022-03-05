import { firestore } from "./firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore"

async function getUserRef (username) {
    const userpath = 'users/' + username;
    const userRef = await doc(firestore, userpath);
    return userRef;
} 

async function getWallet (user) {
    const userRef = await getUserRef(user);
    const userProfile = await getDoc(userRef);
    if (userProfile.exists()) {
        const userData = userProfile.data();
        return userData.wallet;
    } else {
        console.log("ERROR in getWallet(): user", user, "did not exist");
        return -1;
    }
}

async function incWallet (user, amount) {
    const balance = await getWallet(user)
    const newAmount = balance + amount;
    if (newAmount < 0) {
        console.log("ERROR in incWallet(): insufficient funcds")
        return -1;
    }
    const userProfile = await getUserRef(user);
    const newWallet = {
        wallet: newAmount
    }
    try {
        await updateDoc(userProfile, newWallet);
    } catch {
        console.log("Error in incWallet(): user", user, "doesn't exist");
        return -1;
    }
    return newAmount;
}


export { getWallet, incWallet }

