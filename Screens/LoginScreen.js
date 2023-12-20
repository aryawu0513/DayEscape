import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  // for Firestore access
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

export default function LoginScreen({ auth, signedInProps, firebaseProps }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { db } = firebaseProps;

  useEffect(() => {
    setErrorMsg("");
  }, []);

  async function signUpUserEmailPassword() {
    if (password.length < 6) {
      setErrorMsg("Password too short");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(
        `signUpUserEmailPassword: sign up for email ${email} succeeded (but email still needs verification).`
      );
      console.log(`User UID: ${user.uid}`);
      setEmail("");
      setPassword("");
      await setDoc(doc(db, "users", user.uid), { created: true });

      if (user) {
        sendEmailVerification(user)
          .then(() => {
            console.log("signUpUserEmailPassword: sent verification email");
            setErrorMsg(
              `A verification email has been sent to ${email}. You will not be able to sign in to this account until you click on the verification link in that email.`
            );
          })
          .catch((error) => {
            console.log(`sendEmailVerification error: ${error.message}`);
          });
      } else {
        console.log("User is null or undefined after sign up");
        setErrorMsg("Error during sign up. Please try again.");
      }
    } catch (error) {
      console.log(`signUpUserEmailPassword: sign up failed for email ${email}`);
      const errorMessage = error.message;
      console.log(`createUserWithEmailAndPassword error: ${errorMessage}`);
      setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
    }
  }

  async function signInUserEmailPassword() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      console.log(`signInUserEmailPassword succeeded for email ${email}`);
      checkEmailVerification();
      signedInProps.setUid(userCredential.user.uid);
      //signedInProps.setSignedInUser(true);
    } catch (error) {
      console.log(`signInUserEmailPassword: sisgn in failed for email ${email}`);
      const errorMessage = error.message;
      console.log(`signInUserEmailPassword error: ${errorMessage}`);
      setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
    }
  }

  function checkEmailVerification() {
    if (auth.currentUser) {
      console.log(
        `checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`
      );
      if (auth.currentUser.emailVerified) {
        console.log(
          `checkEmailVerification: setSignedInUser for ${auth.currentUser.email}`
        );
        signedInProps.signInUser(auth.currentUser.uid);
        setErrorMsg("");
      } else {
        console.log("checkEmailVerification: remind user to verify email");
        setErrorMsg(
          `You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`
        );
      }
    }
  }
  async function handleSignInPress() {
    try {
      await signInUserEmailPassword();
    } catch (error) {
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.signInOutPane}>
        <Text style={styles.title}>Login Screen</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            placeholder="Enter your email address"
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMsg("");
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorMsg("");
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={handleSignInPress}
            buttonColor={"#215ED5"}
          >
            Sign In
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={() => signUpUserEmailPassword()}
            buttonColor={"#215ED5"}
          >
            Sign Up
          </Button>
        </View>
        <View style={errorMsg === "" ? styles.hidden : styles.errorBox}>
          <Text style={styles.errorMessage}>{errorMsg}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signInOutPane: {
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    width: "48%",
  },
  buttonText: {
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorMessage: {
    color: "white",
    fontSize: 16,
  },
  hidden: {
    display: "none",
  },
});
