import React, { useState } from "react";
import "./styles.css";
import Input from "../input";
import Button from "../Button";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,  signInWithPopup } from "firebase/auth";
import { db, auth, provider } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();


  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("Email", email);
    console.log("Password", password);
    console.log("Confirm Password", confirmPassword);

    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User", user);
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user)
            navigate("/dashboard")
            toast.success("User Created!");

          })
          .catch((error) => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Passoward and confirm password does not mathc");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!!!");
      setLoading(false);
    }
  }

  function signinWithEmail() {
    setLoading(true);
    console.log("Email", email);
    console.log("Password", password);

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User Logged In!", user);
          createDoc(user)
          setLoading(false);
          navigate("/dashboard")
          toast.success("User Logged In!");

          // ...
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });


    } else {
      toast.error("All fields are mandatory login!!!");
      setLoading(false);
    }
  }

  async function createDoc(user) {

    if (!user) return;

    const useRef = doc(db, "users", user.uid);
    const userData = await getDoc(useRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photURL: user.photoURL ? user.photoURL : "",
          createAt: new Date(),
        });
        toast.success("Doc Created!")
      } catch (error) {
        toast.error(error.message)
      }
    } else {
      toast.error("Doc already exists");
      setLoading(false)
    }

  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("User>>", user)
          createDoc(user)
          setLoading(false);
          navigate("/dashboard");
          toast.success("User authenticated!")
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    } catch (error) {
      setLoading(false);
      toast.error(error.message)
      
    }

  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
            <Input
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"JohnDoe@gmail.com"}
              type={"email"}
            />
            <Input
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
              type={"password"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={signinWithEmail}
            />
            <p className="p-login">or</p>
            <Button
            onClick={googleAuth}
              text={loading ? "Loading..." : "Login Using Google"}
              blue={true}
            />
            <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
              Or Don't Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
            <Input
              label={"Fulll Name"}
              state={name}
              setState={setName}
              placeholder={"John Doe"}
              type={"text"}
            />
            <Input
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"JohnDoe@gmail.com"}
              type={"email"}
            />
            <Input
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
              type={"password"}
            />
            <Input
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Exapmle@123"}
              type={"password"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup Using Email and Password"}
              onClick={signupWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Signup Using Google"}
              blue={true}
            />
            <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
              Or Have An Account Already? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
