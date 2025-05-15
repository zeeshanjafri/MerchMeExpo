import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { generateDesign } from "../src/services/openaiService";

const COLORS = {
  neon: "#B1FF02",
  deepPurple: "#6B21A8",
  brandPurple: "#B600FF",
  frameGold: "#E1B200",
  orderGold: "#FFD700",
};

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Make it look like Studio Ghibli version");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState("1");

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need camera roll permissions to select an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  async function handleGenerate() {
    if (!selectedImage) {
      Alert.alert("Select an image first");
      return;
    }
    try {
      setGenerating(true);
      Alert.alert("Debug", "Starting generation...");
      console.log("Starting generation with image:", selectedImage);
      
      const generatedImageUri = await generateDesign(selectedImage, prompt);
      console.log("Generation complete:", generatedImageUri);
      setGeneratedImage(generatedImageUri);
      
    } catch (e: any) {
      console.error("Generation error:", e);
      Alert.alert("Generation failed", e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleCheckout() {
    try {
      Alert.alert("Checkout", "This would connect to a payment processor in a real app.");
    } catch (e: any) {
      Alert.alert("Checkout failed", e.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.neon }]}>
        <Text style={styles.logoText}>
          <Text style={{ color: "#000" }}>Merch</Text>
          <Text style={{ color: "#000" }}>Me</Text>
        </Text>
        <View style={styles.navLinks}>
          <Text style={styles.navLinkText}>Features</Text>
          <Text style={styles.navLinkText}>For Influencers</Text>
          <Text style={styles.navLinkText}>Sign In</Text>
        </View>
      </View>

      {/* Hero Tagline */}
      <View style={styles.heroTaglineWrapper}>
        <Text style={styles.taglineText}>
          CREATE YOUR OWN CUSTOM MERCH WITH AI.{"\n"}
          <Text style={{ color: COLORS.deepPurple }}>MADE & DELIVERED TO YOUR DOOR.</Text>
        </Text>
      </View>

      {/* Preview + Form */}
      <View style={styles.previewFormWrapper}>
        {/* Preview */}
        <View style={styles.previewContainer}>
          <Image
            source={
              generatedImage
                ? { uri: generatedImage }
                : require("../assets/images/your-design-here-t-shirt.png")
            }
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Create Your Custom Design</Text>
          <TouchableOpacity style={styles.fileButton} onPress={pickImage}>
            <FontAwesome name="upload" size={16} color="#555" style={{ marginRight: 8 }} />
            <Text>{selectedImage ? "Change Image" : "Choose File"}</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Text style={styles.fileInfo}>Selected! Ready to generate.</Text>
          )}
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Describe your design style"
            style={styles.promptInput}
          />
          <TouchableOpacity
            style={[styles.generateBtn, generating && { opacity: 0.7 }]}
            onPress={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.generateBtnText}>Generate Design</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Panel (show when design ready) */}
      {generatedImage && (
        <View style={styles.orderPanel}>
          <Text style={styles.orderNow}>ORDER NOW</Text>
          <Text style={styles.price}>$25.00</Text>
          {/* Size pills */}
          <View style={{ flexDirection: "row", marginVertical: 8 }}>
            {(["S", "M", "L", "XL"] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sizePill,
                  size === s && { backgroundColor: COLORS.brandPurple, borderColor: COLORS.neon },
                ]}
                onPress={() => setSize(s)}
              >
                <Text style={{ color: size === s ? "#fff" : COLORS.brandPurple, fontWeight: "700" }}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Quantity */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ marginRight: 6, fontWeight: "600" }}>Qty:</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.qtyInput}
            />
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Checkout with Stripe</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Influencer Callout */}
      <View style={styles.influencerSection}>
        <Text style={styles.influencerText}>
          For Influencers: Spin up your own MerchMe shop in seconds and start selling custom merch to your fans.
        </Text>
        <TouchableOpacity style={styles.createShopBtn}>
          <Text style={{ fontWeight: "bold" }}>Create Your Shop</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Why Choose MerchMe?</Text>
        <View style={styles.featureGrid}>
          {[
            {
              icon: "bolt",
              title: "AI-Powered Designs",
              desc: "Our AI transforms your ideas into stunning merch designs in seconds. No design skills needed.",
            },
            {
              icon: "truck",
              title: "Fast Delivery",
              desc: "Get your custom merch delivered to your door in 3-5 days. We handle everything from printing to shipping.",
            },
            {
              icon: "line-chart",
              title: "For Creators",
              desc: "Set up your own merch store in minutes and earn from every sale. We handle production and fulfillment.",
            },
          ].map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <View style={styles.featureIconWrapper}>
                <FontAwesome name={f.icon as any} size={20} color="#000" />
              </View>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>
          <Text style={{ color: "#fff" }}>Merch</Text>
          <Text style={{ color: COLORS.neon }}>Me</Text>
        </Text>
        <Text style={styles.footerText}>Create custom merch with AI.</Text>
        <Text style={styles.footerCopy}>© 2023 MerchMe. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "700",
  },
  navLinks: {
    flexDirection: "row",
  },
  navLinkText: {
    color: "#333",
    marginLeft: 16,
  },
  heroTaglineWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  taglineText: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 38,
  },
  previewFormWrapper: {
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  previewContainer: {
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 300,
  },
  formCard: {
    backgroundColor: "#fff",
    elevation: 2,
    borderRadius: 12,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  fileInfo: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  promptInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  generateBtn: {
    backgroundColor: COLORS.neon,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  generateBtnText: {
    fontWeight: "bold",
  },
  orderPanel: {
    margin: 16,
    backgroundColor: COLORS.orderGold,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 4,
  },
  orderNow: {
    fontWeight: "800",
    fontSize: 24,
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sizePill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.brandPurple,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  qtyInput: {
    width: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 6,
    textAlign: "center",
  },
  checkoutBtn: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  influencerSection: {
    backgroundColor: "#f5f5f5",
    padding: 24,
    alignItems: "center",
    marginTop: 24,
  },
  influencerText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  createShopBtn: {
    backgroundColor: COLORS.neon,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  featuresSection: {
    padding: 24,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  featureIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.neon,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDesc: {
    color: "#555",
    fontSize: 14,
  },
  featureGrid: {
    flexDirection: "column",
  },
  footer: {
    backgroundColor: "#111",
    padding: 24,
    alignItems: "center",
  },
  footerLogo: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },
  footerText: {
    color: "#aaa",
    marginBottom: 12,
  },
  footerCopy: {
    color: "#777",
    fontSize: 12,
  },
});