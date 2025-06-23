import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // likely a soft off-white
    padding: 20,
    justifyContent: "center",
  },
  illustration: {
    width: 280,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 40,
    paddingBottom: 20
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
    paddingBottom: 20
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.subtext || COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  errorInput: {
    borderColor: COLORS.error || "#ff4d4f",
  },
  button: {
    backgroundColor: COLORS.primary, // green tone for Stridr
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    color: COLORS.text,
    fontSize: 15,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  verificationContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  verificationInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 18,
    color: COLORS.text,
    width: "100%",
    textAlign: "center",
    letterSpacing: 3,
  },
  errorBox: {
    backgroundColor: "#FFEAEA",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error || "#ff4d4f",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});
