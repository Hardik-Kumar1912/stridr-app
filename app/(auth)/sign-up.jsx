import { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { styles } from "@/assets/styles/auth.styles.js";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (imageLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [imageLoaded]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setError("");
    } catch (err) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("The email is already in use. Please try another.");
      } else {
        setError("An error occurred during sign-up. Please try again.");
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        setError("");
        router.replace("/");
      } else {
        setError("Verification not complete. Try again.");
      }
    } catch (err) {
      setError("Invalid verification code or something went wrong.");
    }
  };

  const renderError = () =>
    error ? (
      <View style={styles.errorBox}>
        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => setError("")}>
          <Ionicons name="close" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    ) : null;

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>
        {renderError()}
        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#9A8478"
          onChangeText={setCode}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginBottom: 20, height: 180 }}>
          {!imageLoaded && (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 70 }} />
          )}
          <Animated.Image
            source={require("../../assets/images/signupIcon.png")}
            style={[
              styles.illustration,
              {
                opacity: fadeAnim,
                position: "absolute",
                width: 210,
                height: 210,
                resizeMode: "contain",
              },
            ]}
            onLoadEnd={() => setImageLoaded(true)}
          />
        </View>

        <Text style={styles.title}>Create Account</Text>

        {renderError()}

        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={setEmailAddress}
          style={[styles.input, error && styles.errorInput]}
          placeholderTextColor="#9A8478"
        />

        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry
          onChangeText={setPassword}
          style={[styles.input, error && styles.errorInput]}
          placeholderTextColor="#9A8478"
        />

        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
