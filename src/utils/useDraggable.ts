import { ref, computed, onBeforeUnmount, watch, type Ref } from "vue";
import type { CSSProperties } from "vue";

let globalZIndex = 1000;

export function useDraggable(
  blockRef: Ref<HTMLElement | null>,
  initX = 50,
  initY = 50,
  initZ = 1000,
  margin = 16 // 邊界內縮距離
) {
  const x = ref(initX);
  const y = ref(initY);
  const dragging = ref(false);
  const zIndex = ref(initZ);
  let offsetX = 0;
  let offsetY = 0;

  // 記錄上一次的視窗大小
  let lastWindowWidth = window.innerWidth;
  let lastWindowHeight = window.innerHeight;

  // 動態取得區塊寬高
  function getBlockSize() {
    const el = blockRef.value;
    if (!el) return { width: 0, height: 0 };
    const rect = el.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  const blockStyle = computed<CSSProperties>(() => ({
    position: "fixed",
    left: x.value + "px",
    top: y.value + "px",
    cursor: dragging.value ? "grabbing" : "grab",
    userSelect: "none",
    zIndex: zIndex.value,
  }));

  function onMouseDown(e: MouseEvent) {
    dragging.value = true;
    offsetX = e.clientX - x.value;
    offsetY = e.clientY - y.value;
    // 拖曳時自動置頂
    globalZIndex++;
    zIndex.value = globalZIndex;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.value) return;
    const { width, height } = getBlockSize();
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    // 限制不超出視窗，並往內限縮 margin
    newX = Math.max(margin, Math.min(window.innerWidth - width - margin, newX));
    newY = Math.max(
      margin,
      Math.min(window.innerHeight - height - margin, newY)
    );
    x.value = newX;
    y.value = newY;
  }

  function onMouseUp() {
    dragging.value = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  // resize 時根據比例調整座標，並即時取得寬高
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const { width, height } = getBlockSize();
    if (w !== lastWindowWidth || h !== lastWindowHeight) {
      const scaleX = (w - 2 * margin - width) / (lastWindowWidth - 2 * margin - width);
      const scaleY = (h - 2 * margin - height) / (lastWindowHeight - 2 * margin - height);
      x.value = Math.max(margin, Math.min(w - width - margin, Math.round((x.value - margin) * scaleX + margin)));
      y.value = Math.max(margin, Math.min(h - height - margin, Math.round((y.value - margin) * scaleY + margin)));
      lastWindowWidth = w;
      lastWindowHeight = h;
    }
  }

  window.addEventListener("resize", onResize);

  onBeforeUnmount(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("resize", onResize);
  });

  // 若 blockRef 變動，重新調整位置避免初始超出
  watch(blockRef, (el) => {
    if (el) {
      const { width, height } = getBlockSize();
      x.value = Math.max(margin, Math.min(window.innerWidth - width - margin, x.value));
      y.value = Math.max(margin, Math.min(window.innerHeight - height - margin, y.value));
    }
  });

  return {
    blockStyle,
    onMouseDown,
    x,
    y,
    dragging,
    zIndex,
  };
}
