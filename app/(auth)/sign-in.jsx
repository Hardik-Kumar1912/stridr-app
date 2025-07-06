import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
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
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/auth.styles.js";
import { COLORS } from "../../constants/colors.js";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
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

  const onSignInPress = async () => {
    if (!isLoaded) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error("Sign-in not complete:", JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("An error occurred during sign-in. Please try again.");
      }
    }
  };

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
            source={require("../../assets/images/loginIcon.png")}
            style={[
              styles.illustration,
              {
                opacity: fadeAnim,
                position: "absolute",
                width: 210,
                height: 210,
                resizeMode: "contain",
                marrginBottom: 20,
              },
            ]}
            onLoadEnd={() => setImageLoaded(true)}
          />
        </View>

        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={setEmailAddress}
          style={[styles.input, error && styles.errorInput]}
          placeholderTextColor="#9A8478"
        />

        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={setPassword}
          style={[styles.input, error && styles.errorInput]}
          placeholderTextColor="#9A8478"
        />

        <TouchableOpacity onPress={onSignInPress} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
