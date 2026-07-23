import React, { useRef, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");
const HANDLE_SIZE = 30;
const MIN_DIM = 80;

const PRESETS = [
  { label: "Free", ratio: null },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "16:9", ratio: 16 / 9 },
];

// Returns { originX, originY, width, height } in original image pixel coordinates.
export default function CropSelector({ imageUri, imageWidth, imageHeight, onConfirm, onCancel }) {
  // Fit image to screen width; cap height so controls are visible
  const MAX_H = SH * 0.58;
  let dW = SW;
  let dH = (imageHeight / imageWidth) * SW;
  if (dH > MAX_H) {
    dH = MAX_H;
    dW = (imageWidth / imageHeight) * MAX_H;
  }

  // Aspect ratio — stored in a ref so PanResponder closures never go stale
  const aspectRef = useRef(4 / 3);
  const [aspectLabel, setAspectLabel] = useState("4:3");

  // Initial crop box: 82% of display width, 4:3, centred
  const initW = dW * 0.82;
  const initH = initW / (4 / 3);
  const initX = (dW - initW) / 2;
  const initY = (dH - initH) / 2;

  // Single ref keeps position/size current for PanResponder (avoids stale state closures)
  const boxRef = useRef({ x: initX, y: initY, w: initW, h: initH });
  const [box, setBox] = useState({ x: initX, y: initY, w: initW, h: initH });

  const clampAndCommit = (next) => {
    let { x, y, w, h } = next;
    w = Math.max(MIN_DIM, Math.min(w, dW));
    h = Math.max(MIN_DIM, Math.min(h, dH));
    x = Math.max(0, Math.min(x, dW - w));
    y = Math.max(0, Math.min(y, dH - h));
    const c = { x, y, w, h };
    boxRef.current = c;
    setBox(c);
  };

  // ── Move box ──────────────────────────────────────────────────────────────
  const moveOrigin = useRef({ x: 0, y: 0 });
  const movePR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        moveOrigin.current = { x: boxRef.current.x, y: boxRef.current.y };
      },
      onPanResponderMove: (_, gs) => {
        clampAndCommit({
          ...boxRef.current,
          x: moveOrigin.current.x + gs.dx,
          y: moveOrigin.current.y + gs.dy,
        });
      },
      onPanResponderRelease: () => {
        moveOrigin.current = { x: boxRef.current.x, y: boxRef.current.y };
      },
    })
  ).current;

  // ── Resize box (bottom-right corner handle) ───────────────────────────────
  const resizeOrigin = useRef({ w: 0, h: 0 });
  const resizePR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        resizeOrigin.current = { w: boxRef.current.w, h: boxRef.current.h };
      },
      onPanResponderMove: (_, gs) => {
        const newW = resizeOrigin.current.w + gs.dx;
        const ar = aspectRef.current;
        const newH = ar ? newW / ar : resizeOrigin.current.h + gs.dy;
        clampAndCommit({ ...boxRef.current, w: newW, h: newH });
      },
      onPanResponderRelease: () => {
        resizeOrigin.current = { w: boxRef.current.w, h: boxRef.current.h };
      },
    })
  ).current;

  const applyAspect = (label, ratio) => {
    aspectRef.current = ratio;
    setAspectLabel(label);
    if (ratio) {
      clampAndCommit({ ...boxRef.current, h: boxRef.current.w / ratio });
    }
  };

  const handleConfirm = () => {
    const sx = imageWidth / dW;
    const sy = imageHeight / dH;
    const ox = Math.max(0, Math.round(box.x * sx));
    const oy = Math.max(0, Math.round(box.y * sy));
    // Clamp width/height so they never exceed image bounds from their origin
    const cw = Math.min(Math.round(box.w * sx), imageWidth - ox);
    const ch = Math.min(Math.round(box.h * sy), imageHeight - oy);
    onConfirm({ originX: ox, originY: oy, width: cw, height: ch });
  };

  const { x, y, w, h } = box;

  return (
    <View style={s.root}>
      {/* Aspect ratio presets */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.presetRow}>
        {PRESETS.map(({ label, ratio }) => (
          <TouchableOpacity
            key={label}
            style={[s.presetBtn, aspectLabel === label && s.presetBtnActive]}
            onPress={() => applyAspect(label, ratio)}
          >
            <Text style={[s.presetText, aspectLabel === label && s.presetTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Image area + crop overlay */}
      <View style={{ width: dW, height: dH, alignSelf: "center" }}>
        <Image source={{ uri: imageUri }} style={{ width: dW, height: dH }} resizeMode="stretch" />

        {/* Dimmed mask regions */}
        <View style={[s.dim, { top: 0, left: 0, right: 0, height: y }]} />
        <View style={[s.dim, { top: y + h, left: 0, right: 0, bottom: 0 }]} />
        <View style={[s.dim, { top: y, left: 0, width: x, height: h }]} />
        <View style={[s.dim, { top: y, left: x + w, right: 0, height: h }]} />

        {/* Crop box — draggable body */}
        <View
          {...movePR.panHandlers}
          style={[s.cropBox, { top: y, left: x, width: w, height: h }]}
        >
          <View style={[s.corner, { top: -1, left: -1, borderRightWidth: 0, borderBottomWidth: 0 }]} />
          <View style={[s.corner, { top: -1, right: -1, borderLeftWidth: 0, borderBottomWidth: 0 }]} />
          <View style={[s.corner, { bottom: -1, left: -1, borderRightWidth: 0, borderTopWidth: 0 }]} />
          <View style={[s.corner, { bottom: -1, right: -1, borderLeftWidth: 0, borderTopWidth: 0 }]} />
        </View>

        {/* Resize handle — rendered after crop box so it receives touches on overlap */}
        <View
          {...resizePR.panHandlers}
          style={[s.resizeHandle, { top: y + h - HANDLE_SIZE / 2, left: x + w - HANDLE_SIZE / 2 }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        />
      </View>

      <Text style={s.hint}>Drag to move  ·  Drag corner ◢ to resize</Text>

      {/* Action buttons */}
      <View style={s.actionRow}>
        <TouchableOpacity style={s.cancelBtn} onPress={onCancel}>
          <Text style={s.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.confirmBtn} onPress={handleConfirm}>
          <Text style={s.confirmText}>Use Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  presetRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  presetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  presetBtnActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  presetText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "600",
  },
  presetTextActive: {
    color: "#111",
  },
  dim: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  cropBox: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  corner: {
    position: "absolute",
    width: 18,
    height: 18,
    borderWidth: 3,
    borderColor: "#fff",
  },
  resizeHandle: {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  hint: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cancelText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 22,
  },
  confirmText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "700",
  },
});
