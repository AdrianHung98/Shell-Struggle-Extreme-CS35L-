import { firestore } from "./firebase";
import { collection, deleteDoc, doc, updateDoc, getDoc, getDocs, setDoc } from "firebase/firestore"

async function addTurtleClass(turtleClass) {
  await setDoc(doc(firestore, 'turtleClasses', turtleClass.className), turtleClass);
}

async function getTurtleClasses() {
  const turtleClassesCollectionRef = collection(firestore, 'turtleClasses');
  const turtleClassesSnapshot = await getDocs(turtleClassesCollectionRef);
  let turtleClasses = [];
  turtleClassesSnapshot.forEach(turtleClass => turtleClasses.push(turtleClass.data()));
  return turtleClasses;
}

async function getTurtleClass(className) {
  const turtleClasses = await getTurtleClasses();
  return turtleClasses.find(turtleClass => turtleClass.className === className);
}

async function resetTurtleClasses() {
  const turtleClassesCollectionRef = collection(firestore, 'turtleClasses');
  const turtleClassesSnapshot = await getDocs(turtleClassesCollectionRef);
  turtleClassesSnapshot.forEach(async turtleClass => await deleteDoc(turtleClass.ref));
}

function getUserRef (username) {
    const userpath = 'users/' + username;
    const userRef = doc(firestore, userpath);
    return userRef;
} 

async function getTurtles(user) {
    const userRef = getUserRef(user);
    const userProfile = await getDoc(userRef);
    if (userProfile.exists()) {
        const userData = userProfile.data();
        return userData.turtles;
    } else {
        console.log("ERROR in getTurtles(): user", user, "does not exist"); return false;
    }
}

async function unlockTurtle(user, index) {
    const userRef = getUserRef(user);
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
    const userRef = getUserRef(user);
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
    const userProfile = getUserRef(user);
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

async function getNames(user) {
    const userRef = getUserRef(user);
    const userProfile = await getDoc(userRef);
    if (userProfile.exists()) {
        const userData = userProfile.data();
        return userData.names;
    } else {
        console.log("ERROR in getNames(): user", user, "does not exist"); return false;
    }
}

async function setName(user, index, name) {
    const userRef = getUserRef(user);
    let namesArray = await getNames(user);
    if (namesArray === false) {return false}
    namesArray[index] = name;
    const newNames = {
        turtles: namesArray
    };
    try {
        await updateDoc(userRef, newNames);
        return newNames;
    } catch {
        console.log("ERROR in unlockTurtle(): user", user, "did not exist"); return false;
    }    
}

async function uploadPicture(user, url) {
    const userRef = getUserRef(user);
    updateDoc(userRef, {
        icon: url
    });
}

async function sendRequest(fromUser, toUser) {
    console.log("Called sendRequest??");
    const toRef = getUserRef(toUser);
    const toUserProfile = await getDoc(toRef);
    if (toUserProfile.exists()) {
        const toUserData = toUserProfile.data();
        let requests = toUserData.requests;
        requests.push(fromUser);
        if (requests.length > 5) {
            requests = requests.slice(1, 6);
        }
        updateDoc(toRef, {requests: requests});
    } else {
        console.log("ERROR in getNames(): user", toUser, "does not exist"); return false;
    }
}

export { addTurtleClass, getTurtleClass, getTurtleClasses, resetTurtleClasses,
        getTurtles, unlockTurtle, 
        getWallet, incWallet,
        getNames, setName,
        uploadPicture,
        sendRequest
};

