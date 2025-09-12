import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  findNodeHandle,
  UIManager,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from "../state/AuthProvider";
import { uploadImage } from "../API/API";
import ScreenTemplate from "./Template/ScreenTemplate";
import LoadingSection from "../components/home_sections/SectionTemplate/LoadingSection";

const Upload = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const [step, setStep] = useState(1);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // dimensions
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");

  // NEW: weight (lb)
  const [weight, setWeight] = useState("");

  const [isSigned, setIsSigned] = useState(false);
  const [isFramed, setIsFramed] = useState(false);
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Paintings", value: "paintings" },
    { label: "Photography", value: "photography" },
    { label: "Graphic Design", value: "graphic design" },
    { label: "Illustrations", value: "illustrations" },
    { label: "Sculptures", value: "sculptures" },
    { label: "Woodwork", value: "woodwork" },
    { label: "Graffiti", value: "graffiti" },
    { label: "Stencil", value: "stencil" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [showMeasureHelp, setShowMeasureHelp] = useState(false);

  // Refs for keyboard flow + auto-scroll
  const scrollRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const heightRef = useRef(null);
  const widthRef = useRef(null);
  const lengthRef = useRef(null);
  const weightRef = useRef(null); // NEW
  const priceRef = useRef(null);

  const displayError = (msg) =>
    Platform.OS === "web" ? alert(msg) : Alert.alert("Error", msg);

  const selectImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) return alert("Permission required");

    const picker = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!picker.canceled) {
      const selected = picker.assets[0];
      const resized = await ImageManipulator.manipulateAsync(
        selected.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage({ ...selected, uri: resized.uri });
    }
  };

  // Smoothly scroll focused input into view
  const scrollIntoView = (ref) => {
    if (!ref?.current || !scrollRef?.current) return;
    const node = findNodeHandle(ref.current);
    if (!node) return;
    UIManager.measureLayout(
      node,
      findNodeHandle(scrollRef.current),
      () => {},
      (x, y) => scrollRef.current.scrollTo({ y: Math.max(0, y - 20), animated: true })
    );
  };

  const handleSubmit = async () => {
    const priceVal = parseFloat(price);
    const heightVal = parseFloat(height);
    const widthVal = parseFloat(width);
    const lengthVal = parseFloat(length);
    const weightVal = parseFloat(weight); // NEW

    if (
      !image ||
      !title ||
      !description ||
      !category ||
      !priceVal ||
      !heightVal ||
      !widthVal ||
      !lengthVal ||
      !weightVal // NEW
    ) {
      return displayError("Please complete all fields");
    }
    if (
      priceVal <= 0 ||
      heightVal <= 0 ||
      widthVal <= 0 ||
      lengthVal <= 0 ||
      weightVal <= 0 // NEW
    ) {
      return displayError("Numeric fields must be positive values.");
    }

    setIsLoading(true);

    try {
      // 1) Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", { uri: image.uri, name: title, type: "image/jpeg" });
      formData.append("upload_preset", "edevre");
      formData.append("folder", "artwork");

      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dttomxwev/image/upload", {
        method: "POST",
        body: formData,
      });
      const result = await cloudRes.json();

      if (!result.secure_url) return displayError("Image upload failed");

      // 2) Send metadata to API (backend can ignore weight if it doesn't store it)
      const payload = {
        userId: userData.user.user._id,
        artistName: userData.user.user.name,
        name: title,
        imageLink: result.secure_url,
        price: priceVal,
        description,
        category,
        stage: "review",
        dimensions: { height: heightVal, width: widthVal, length: lengthVal },
        weight: weightVal, // NEW
        isSigned,
        isFramed,
      };

      const dbRes = await uploadImage(payload, userData.token);

      if (dbRes.success) {
        Alert.alert("Success", "Artwork submitted for review!");
        setStep(1);
        setImage(null);
        setTitle("");
        setDescription("");
        setCategory("");
        setPrice("");
        setHeight("");
        setWidth("");
        setLength("");
        setWeight(""); // NEW
        setIsSigned(false);
        setIsFramed(false);
        navigation.navigate("Home");
      } else {
        displayError("Server Error: " + (dbRes.data?.error || ""));
      }
    } catch (e) {
      console.error("Error submitting:", e);
      displayError("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const isStepOneValid = image && title && description && category;
  const isStepTwoValid = price && height && width && length && weight; // NEW

  return (
    <ScreenTemplate>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {step === 1 && (
              <View style={styles.card}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.imageBox} onPress={selectImage}>
                  {image ? (
                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                  ) : (
                    <Text style={styles.imageText}>Tap to Upload Image</Text>
                  )}
                </TouchableOpacity>

                <TextInput
                  ref={titleRef}
                  style={styles.input}
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onFocus={() => scrollIntoView(titleRef)}
                  onSubmitEditing={() => descRef.current?.focus()}
                />

                <TextInput
                  ref={descRef}
                  style={styles.inputMultiline}
                  placeholder="Description"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  returnKeyType="done"
                  onFocus={() => scrollIntoView(descRef)}
                />

                <DropDownPicker
                  open={open}
                  value={category}
                  items={items}
                  setOpen={setOpen}
                  setValue={setCategory}
                  setItems={setItems}
                  placeholder="Category"
                  style={styles.dropdown}
                  dropDownContainerStyle={{ maxHeight: 180 }}
                  listMode="MODAL"
                />

                <TouchableOpacity
                  style={[styles.button, { opacity: isStepOneValid ? 1 : 0.5 }]}
                  onPress={() => isStepOneValid && setStep(2)}
                  disabled={!isStepOneValid}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View style={styles.card}>
                <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
                  <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                {image && <Image source={{ uri: image.uri }} style={styles.imagePreviewTop} />}

                {/* Row: Height / Width / Length */}
                <View style={styles.dimRow}>
                  <View style={styles.dimItem}>
                    <Text style={styles.dimLabel}>Height (in)</Text>
                    <TextInput
                      ref={heightRef}
                      style={styles.dimInput}
                      placeholder="e.g. 24"
                      value={height}
                      onChangeText={setHeight}
                      keyboardType="numeric"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onFocus={() => scrollIntoView(heightRef)}
                      onSubmitEditing={() => widthRef.current?.focus()}
                    />
                  </View>
                  <View style={styles.dimItem}>
                    <Text style={styles.dimLabel}>Width (in)</Text>
                    <TextInput
                      ref={widthRef}
                      style={styles.dimInput}
                      placeholder="e.g. 36"
                      value={width}
                      onChangeText={setWidth}
                      keyboardType="numeric"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onFocus={() => scrollIntoView(widthRef)}
                      onSubmitEditing={() => lengthRef.current?.focus()}
                    />
                  </View>
                  <View style={styles.dimItem}>
                    <Text style={styles.dimLabel}>Length (in)</Text>
                    <TextInput
                      ref={lengthRef}
                      style={styles.dimInput}
                      placeholder="e.g. 2"
                      value={length}
                      onChangeText={setLength}
                      keyboardType="numeric"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onFocus={() => scrollIntoView(lengthRef)}
                      onSubmitEditing={() => weightRef.current?.focus()} // go to weight
                    />
                  </View>
                </View>

                {/* How to measure helper */}
                <TouchableOpacity
                  onPress={() => setShowMeasureHelp(true)}
                  style={styles.measureLink}
                  activeOpacity={0.8}
                >
                  <Text style={styles.measureLinkText}>📏 How to measure</Text>
                </TouchableOpacity>

                {/* Switches */}
                <View style={styles.switchRow}>
                  <Text>Signed:</Text>
                  <Switch value={isSigned} onValueChange={setIsSigned} />
                </View>
                <View style={styles.switchRow}>
                  <Text>Framed:</Text>
                  <Switch value={isFramed} onValueChange={setIsFramed} />
                </View>

                {/* Row: Weight + Price */}
                <View style={styles.rowTwo}>
                  <View style={styles.col}>
                    <Text style={styles.smallLabel}>Weight (lb)</Text>
                    <TextInput
                      ref={weightRef}
                      style={styles.input}
                      placeholder="e.g. 12.5"
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="numeric"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onFocus={() => scrollIntoView(weightRef)}
                      onSubmitEditing={() => priceRef.current?.focus()}
                    />
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.smallLabel}>Price ($)</Text>
                    <TextInput
                      ref={priceRef}
                      style={styles.input}
                      placeholder="e.g. 299.99"
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="numeric"
                      returnKeyType="done"
                      onFocus={() => scrollIntoView(priceRef)}
                      onSubmitEditing={() => {
                        if (isStepTwoValid) handleSubmit();
                        Keyboard.dismiss();
                      }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, { marginTop: 16, opacity: isStepTwoValid ? 1 : 0.5 }]}
                  onPress={() => isStepTwoValid && handleSubmit()}
                  disabled={!isStepTwoValid}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Measuring guide modal */}
          <Modal
            visible={showMeasureHelp}
            transparent
            animationType="fade"
            onRequestClose={() => setShowMeasureHelp(false)}
          >
            <Pressable style={styles.modalBackdrop} onPress={() => setShowMeasureHelp(false)}>
              <View style={styles.modalCard} pointerEvents="box-none">
                <Text style={styles.modalTitle}>How to Measure Your Artwork</Text>
                <Text style={styles.modalSub}>Use a tape measure. Enter inches.</Text>

                <View style={styles.diagramWrap}>
                  <View style={styles.canvas}>
                    <View style={styles.rect}>
                      <View style={[styles.arrowH, { top: "100%" }]}>
                        <View style={styles.arrowLine} />
                        <Text style={styles.arrowLabel}>Width</Text>
                        <View style={styles.arrowLine} />
                      </View>

                      <View style={styles.arrowVWrap}>
                        <View style={styles.arrowV}>
                          <View style={styles.arrowLineV} />
                          <Text style={styles.arrowLabel}>Height</Text>
                          <View style={styles.arrowLineV} />
                        </View>
                      </View>

                      <View style={styles.depthBadge}>
                        <Text style={styles.depthText}>Length (Depth)</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.tipList}>
                  <Text style={styles.tip}>• Height: top to bottom.</Text>
                  <Text style={styles.tip}>• Width: left to right.</Text>
                  <Text style={styles.tip}>• Length (depth): thickness of canvas/frame.</Text>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setShowMeasureHelp(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.closeBtnText}>Got it</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <LoadingSection loadingMsg="Uploading Your Art!" size="large" />
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  card: { paddingVertical: 8 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    minHeight: 90,
    fontSize: 15,
  },

  dropdown: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  imageBox: {
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
  },
  imageText: { color: "#007bff", fontSize: 16 },
  imagePreview: { width: "100%", height: "100%", borderRadius: 8 },
  imagePreviewTop: { width: "100%", height: 200, borderRadius: 10, marginBottom: 16 },

  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Dimensions row
  dimRow: { flexDirection: "row", gap: 10, marginBottom: 6 },
  dimItem: { flex: 1 },
  dimLabel: { fontSize: 12, color: "#555", marginBottom: 6, fontWeight: "600" },
  dimInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  measureLink: { alignSelf: "flex-start", marginBottom: 12, marginTop: 6 },
  measureLinkText: { color: "#007bff", fontWeight: "700" },

  // Row: weight + price
  rowTwo: { flexDirection: "row", gap: 10 },
  col: { flex: 1 },
  smallLabel: { fontSize: 12, color: "#555", marginBottom: 6, fontWeight: "600" },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  backButton: { marginBottom: 12 },
  backText: { color: "#007bff", fontSize: 16, fontWeight: "500" },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },

  diagramWrap: { alignItems: "center", marginBottom: 12 },
  canvas: {
    width: 260,
    height: 180,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  rect: {
    width: 160,
    height: 100,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowH: {
    position: "absolute",
    width: 160,
    height: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  arrowLine: { flex: 1, height: 2, backgroundColor: "#111827" },
  arrowVWrap: { position: "absolute", left: -28, top: 0, bottom: 0, justifyContent: "center" },
  arrowV: { width: 16, height: 100, alignItems: "center", justifyContent: "space-between" },
  arrowLineV: { width: 2, height: 34, backgroundColor: "#111827" },
  arrowLabel: { fontSize: 11, fontWeight: "700", color: "#111827" },
  depthBadge: {
    position: "absolute",
    right: -12,
    bottom: -14,
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  depthText: { fontSize: 11, color: "#4338CA", fontWeight: "700" },
  tipList: { marginTop: 6, marginBottom: 12 },
  tip: { color: "#374151", fontSize: 13, marginBottom: 4 },
  closeBtn: {
    alignSelf: "center",
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  closeBtnText: { color: "#fff", fontWeight: "800", letterSpacing: 0.4 },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 999,
  },
});

export default Upload;
