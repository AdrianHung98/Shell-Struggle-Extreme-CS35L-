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

async function getUserRef (uid) {
    const userpath = 'users/' + uid;
    const userRef = await doc(firestore, userpath);
    return userRef;
} 

async function getUserProfile(uid) {
  const userRef = await getUserRef(uid);
  const userProfile = await getDoc(userRef);
  if (userProfile.exists()) {
    return userProfile.data();
  } else {
    console.log("user with uid", uid, "does not exist");
    return false;
  }
}

async function getUIDByUsername(username) {
  const userMapRef = await doc(firestore, 'users/userMap');
  const userMap = (await getDoc(userMapRef)).data();
  return userMap[username];
}


/**
 * im storing user turtles like this: 
 *   {
 *     turtle_class_1: custom_name_1, 
 *     turtle_class_2: custom_name_2
 *   }
 * 
 * if the user doesn't have a turtle of some class, it's just undefined
 * this is indicated by a null value when you try to access
 *  getTurtles(uid)['SomeTurtleClassTheUserDoesntHave']
 * 
 * you can see how i use this design choice in profile.jsx
 */

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

// helper function for testing, clears all entries in getTurtles(uid)
async function resetUserTurtles(user) {
  const userRef = await getUserRef(user);
  const delta = { turtles: {} };
  try {
      await updateDoc(userRef, delta);
  } catch {
      console.log("ERROR in resetUserTurtles(): user", user, "did not exist");
  }
}

// renaming a turtle is simply changing the value of getTurtles(uid)['TurtleClass']
async function renameTurtle(user, turtleClass, name) {
  const userRef = await getUserRef(user);
  let turtles = await getTurtles(user);
  if (turtles === false) {
    // create it if it doesnt exist
    // (shouldnt happen)
    turtles = {};
  }
  turtles[turtleClass] = name;
  const delta = { turtles: turtles };
  try {
      await updateDoc(userRef, delta);
      return turtles;
  } catch {
      console.log("ERROR in renameTurtle(): user", user, "did not exist"); return false;
  }
}

// unlocking a turtle is the same as renaming
// except it checks for whether the user already has the turtle class or not
// returns false if the user already has the turtle class
async function unlockTurtle(user, turtleClass, name) {
  let turtles = await getTurtles(user);
  if (turtles === false) turtles = {};
  // user already has this turtle class
  if (turtles[turtleClass]) return false;
  return await renameTurtle(user, turtleClass, name);
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

async function sendRequest(fromUID, toUID) {
    const toRef = await getUserRef(toUID);
    const toUserProfile = await getDoc(toRef);
    const fromUser = (await getUserProfile(fromUID))?.username;
    if (toUserProfile.exists()) {
        const toUserData = toUserProfile.data();
        let requests = toUserData.requests;
        // remove all previous requests from the same user
        requests = requests.filter(user => user !== fromUser);
        requests.push(fromUser);
        if (requests.length > 5) {
            requests = requests.slice(1, 6);
        }
        updateDoc(toRef, {requests: requests});
        alert('Challenge request sent!');
    } else {
        console.log("ERROR in getNames(): uid", toUID, "does not exist"); return false;
    }
}

export { 
  addTurtleClass, getTurtleClass, getTurtleClasses, resetTurtleClasses,
  getUserRef, getUserProfile, getUIDByUsername, 
  getTurtles, unlockTurtle, renameTurtle, resetUserTurtles, 
  getWallet, incWallet,
  getNames, setName,
  uploadPicture,
  sendRequest
};