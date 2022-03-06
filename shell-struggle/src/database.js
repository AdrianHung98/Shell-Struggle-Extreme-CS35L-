import { firestore } from "./firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore"

async function getUserRef (username) {
    const userpath = 'users/' + username;
    const userRef = await doc(firestore, userpath);
    return userRef;
} 

async function getTurtles(user) {
    const userRef = await getUserRef(user);
    const userProfile = await getDoc(userRef);
    if (userProfile.exists()) {
        const userData = userProfile.data();
        return userData.turtles;
    } else {
        console.log("ERROR in getTurtles(): user", user, "does not exist"); return false;
    }
}

async function unlockTurtle(user, index) {
    const userRef = await getUserRef(user);
    let turtleArray = await getTurtles(user);
    if (turtleArray === false) {return false}
    turtleArray[index] = true;
    const newTurtles = {
        turtles: turtleArray
    };
    try {
        await updateDoc(userRef, newTurtles);
        return newTurtles;
    } catch {
        console.log("ERROR in unlockTurtle(): user", user, "did not exist"); return false;
    }
}

async function getWallet (user) {
    const userRef = await getUserRef(user);
    const userProfile = await getDoc(userRef);
    if (userProfile.exists()) {
        const userData = userProfile.data();
        return userData.wallet;
    } else {
        console.log("ERROR in getWallet(): user", user, "did not exist"); return false;
    }
}

async function incWallet (user, amount) {
    const balance = await getWallet(user);
    if (balance === false) {return false;}
    const newAmount = balance + amount;
    if (newAmount < 0) {
        console.log("ERROR in incWallet(): insufficient funcds"); return false;
    }
    const userProfile = await getUserRef(user);
    const newWallet = {
        wallet: newAmount
    }
    try {
        await updateDoc(userProfile, newWallet);
    } catch {
        console.log("Error in incWallet(): user", user, "doesn't exist"); return false;
    }
    return newAmount;
}

export { getTurtles, unlockTurtle, getWallet, incWallet }

