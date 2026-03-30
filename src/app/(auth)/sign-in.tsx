import useSocialAuth from "@/hooks/useSocialAuth";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Provider = "oauth_google" | "oauth_github" | "oauth_apple";

function AuthButton({
  title,
  icon,
  iconBgClassName,
  onPress,
  disabled,
  loading,
  loadingText,
  dark = false,
}: {
  title: string;
  icon: React.ReactNode;
  iconBgClassName: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText: string;
  dark?: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 14, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        }}
        className={`h-14 flex-row items-center rounded-2xl px-4 ${
          dark ? "bg-black" : "bg-white"
        }`}
        style={{
          shadowColor: "#000",
          shadowOpacity: dark ? 0.22 : 0.08,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 3,
          opacity: disabled ? 0.75 : 1,
        }}
      >
        <View
          className={`h-9 w-9 items-center justify-center rounded-full ${iconBgClassName}`}
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 2,
          }}
        >
          {icon}
        </View>

        <Text
          className={`ml-3 flex-1 text-base font-semibold ${
            dark ? "text-white" : "text-slate-800"
          }`}
        >
          {loading ? loadingText : title}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color={dark ? "#fff" : "#64748b"} />
        ) : (
          <FontAwesome
            name="angle-right"
            size={18}
            color={dark ? "#cbd5e1" : "#94a3b8"}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function SignInScreen() {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const { height } = useWindowDimensions();

  const isGoogleClicked = loadingStrategy === "oauth_google";
  const isAppleClicked = loadingStrategy === "oauth_apple";
  const isGitHubClicked = loadingStrategy === "oauth_github";
  const isLoading = isGoogleClicked || isAppleClicked || isGitHubClicked;

  const blob1 = useSharedValue(0);
  const blob2 = useSharedValue(0);
  const blob3 = useSharedValue(0);

  useEffect(() => {
    blob1.value = withRepeat(withTiming(1, { duration: 7000 }), -1, true);
    blob2.value = withRepeat(withTiming(1, { duration: 9000 }), -1, true);
    blob3.value = withRepeat(withTiming(1, { duration: 11000 }), -1, true);
  }, [blob1, blob2, blob3]);

  const blob1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(blob1.value, [0, 1], [-12, 16]) },
      { translateY: interpolate(blob1.value, [0, 1], [8, -18]) },
      { scale: interpolate(blob1.value, [0, 1], [1, 1.08]) },
    ],
  }));

  const blob2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(blob2.value, [0, 1], [18, -16]) },
      { translateY: interpolate(blob2.value, [0, 1], [-10, 14]) },
      { scale: interpolate(blob2.value, [0, 1], [1, 1.05]) },
    ],
  }));

  const blob3Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(blob3.value, [0, 1], [-10, 12]) },
      { translateY: interpolate(blob3.value, [0, 1], [12, -10]) },
      { scale: interpolate(blob3.value, [0, 1], [1, 1.06]) },
    ],
  }));

  const signIn = (provider: Provider) => handleSocialAuth(provider);

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["top", "bottom"]}>
      <LinearGradient
        colors={["#0b1f18", "#113526", "#0b1f18"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <View className="absolute inset-0">
          <Animated.View
            style={blob1Style}
            className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-500/20"
          />
          <Animated.View
            style={blob2Style}
            className="absolute -right-28 top-36 h-80 w-80 rounded-full bg-lime-400/10"
          />
          <Animated.View
            style={blob3Style}
            className="absolute left-10 bottom-24 h-44 w-44 rounded-full bg-white/8"
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 px-5 pt-2">
            <Animated.View
              entering={FadeInDown.duration(650)}
              className="items-center"
            >
              <Text className="text-center text-5xl font-extrabold tracking-[1px] text-white">
                GROCIFY
              </Text>
              <Text className="mt-2 text-center text-sm text-white/75">
                Plan smarter. Shop happier.
              </Text>

              <View
                className="mt-6 w-full overflow-hidden rounded-[34px] border border-white/15 bg-white/10 p-4"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.18,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 4,
                }}
              >
                <Image
                  source={require("../../../assets/images/auth.png")}
                  style={{
                    width: "100%",
                    height: Math.min(height * 0.32, 320),
                  }}
                  contentFit="contain"
                  transition={220}
                />
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(180).duration(700)}
              className="mt-6 flex-1 rounded-t-[40px] bg-white px-5 pb-8 pt-6"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.16,
                shadowRadius: 22,
                shadowOffset: { width: 0, height: -6 },
                elevation: 8,
              }}
            >
              <View className="items-center">
                <View className="rounded-full bg-emerald-50 px-4 py-1.5">
                  <Text className="text-[11px] font-bold uppercase tracking-[1.3px] text-emerald-700">
                    Welcome Back
                  </Text>
                </View>

                <Text className="mt-3 text-center text-[15px] leading-6 text-slate-500">
                  Choose a social provider and jump right into your personalized
                  grocery experience.
                </Text>
              </View>

              <View className="mt-7 gap-3">
                <Animated.View entering={FadeInUp.delay(260).duration(500)}>
                  <AuthButton
                    title="Continue with Google"
                    loadingText="Connecting..."
                    loading={isGoogleClicked}
                    disabled={isLoading}
                    onPress={() => signIn("oauth_google")}
                    iconBgClassName="bg-white"
                    icon={
                      <Image
                        source={require("../../../assets/images/google.png")}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                  />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(330).duration(500)}>
                  <AuthButton
                    title="Continue with GitHub"
                    loadingText="Connecting..."
                    loading={isGitHubClicked}
                    disabled={isLoading}
                    onPress={() => signIn("oauth_github")}
                    iconBgClassName="bg-white"
                    icon={
                      <FontAwesome name="github" size={22} color="#111827" />
                    }
                  />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400).duration(500)}>
                  <AuthButton
                    title="Continue with Apple"
                    loadingText="Connecting..."
                    loading={isAppleClicked}
                    disabled={isLoading}
                    onPress={() => signIn("oauth_apple")}
                    iconBgClassName="bg-white"
                    dark
                    icon={
                      <FontAwesome6 name="apple" size={18} color="#111827" />
                    }
                  />
                </Animated.View>
              </View>

              <Text className="mt-6 text-center text-xs leading-5 text-slate-400">
                By continuing, you agree to our Terms & Privacy Policy.
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
