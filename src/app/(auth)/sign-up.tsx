import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const loading = fetchStatus === "fetching";

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });

    if (error) return console.error(error);

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;

          const url = decorateUrl("/");
          router.push(url as Href);
        },
      });
    }
  };

  if (signUp.status === "complete" || isSignedIn) return null;

  // 🔐 OTP SCREEN
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center px-6">
        <View className="w-full bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-2xl font-bold text-center mb-4">
            Verify Email 📩
          </Text>

          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-lg mb-3"
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
          />

          {errors?.fields?.code && (
            <Text className="text-red-500 text-sm mb-2">
              {errors.fields.code.message}
            </Text>
          )}

          <Pressable
            className={`bg-blue-500 rounded-xl py-3 items-center ${
              loading && "opacity-50"
            }`}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text className="text-white font-semibold">
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </Pressable>

          <Pressable
            className="mt-3 items-center"
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text className="text-blue-500 font-semibold">Resend Code</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // 🧾 SIGN-UP SCREEN
  return (
    <View className="flex-1 bg-gray-100 items-center justify-center px-6">
      <View className="w-full bg-white rounded-2xl p-6 shadow-lg">
        {/* Title */}
        <Text className="text-3xl font-bold text-center mb-6">
          Create Account 🚀
        </Text>

        {/* Email */}
        <Text className="text-sm font-medium mb-1">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
        {errors?.fields?.emailAddress && (
          <Text className="text-red-500 text-sm mb-2">
            {errors.fields.emailAddress.message}
          </Text>
        )}

        {/* Password */}
        <Text className="text-sm font-medium mb-1">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors?.fields?.password && (
          <Text className="text-red-500 text-sm mb-2">
            {errors.fields.password.message}
          </Text>
        )}

        {/* Button */}
        <Pressable
          className={`bg-blue-500 rounded-xl py-3 items-center mt-2 ${
            (!emailAddress || !password || loading) && "opacity-50"
          }`}
          onPress={handleSubmit}
          disabled={!emailAddress || !password || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Sign Up</Text>
          )}
        </Pressable>

        {/* Footer */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/sign-in">
            <Text className="text-blue-500 font-semibold">Sign in</Text>
          </Link>
        </View>
      </View>

      {/* Clerk CAPTCHA */}
      <View nativeID="clerk-captcha" />
    </View>
  );
}
