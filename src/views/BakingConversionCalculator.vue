<template>
  <div id="BakingConversionCalculatorApp">
    <h1>📏 食譜尺寸換算工具</h1>

    <div class="input-output-row">
      <div class="input-col">
        <label for="original"
          >🔹 原始食譜材料（每行一項，例如：雞蛋 3 顆）</label
        >
        <textarea
          id="original"
          rows="8"
          v-model="inputText"
          placeholder="例：低筋麵粉 100 克&#10;雞蛋 3 顆&#10;牛奶 120 ml"
        ></textarea>
      </div>
      <div class="output-col">
        <label for="result">🔸 轉換後結果</label>
        <div class="output" id="result">
          <pre>{{ result }}</pre>
        </div>
        <button v-if="result" class="copy-btn" @click="copyResult">
          複製結果
        </button>
      </div>
    </div>
    <hr />
    <div class="mold-row">
      <div class="mold-col">
        <h3>原模具資訊</h3>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" value="round" v-model="fromShape" />
            <span>圓形模具</span>
          </label>
          <label class="radio-label">
            <input type="radio" value="square" v-model="fromShape" />
            <span>方形模具</span>
          </label>
          <label class="radio-label">
            <input
              type="radio"
              value="custom"
              v-model="fromShape"
              @change="fromUnit = 'cm'"
            />
            <span>自定義(長方體/公分)</span>
          </label>
        </div>
        <div class="radio-group">
          <label class="radio-label">
            <input
              type="radio"
              value="inch"
              v-model="fromUnit"
              :disabled="fromShape === 'custom'"
            />
            <span :class="{ disabled: fromShape === 'custom' }">吋</span>
          </label>
          <label class="radio-label">
            <input type="radio" value="cm" v-model="fromUnit" />
            <span>公分</span>
          </label>
        </div>
        <div v-if="fromUnit === 'inch'">
          <div v-if="fromShape === 'round'" class="input-row">
            <span class="required">*</span>
            <select v-model.number="fromSize1Inch">
              <option :value="null" disabled>選擇(吋)</option>
              <option v-for="size in inchOptions" :key="size" :value="size">
                {{ size }} 吋
              </option>
            </select>
            <input
              v-model.number="fromHeightCm"
              type="number"
              placeholder="高度(公分)預設為5公分"
            />
          </div>
          <div v-else class="input-row">
            <span class="required">*</span>
            <select v-model.number="fromSize1Inch">
              <option :value="null" disabled>選擇(吋)</option>
              <option v-for="size in inchOptions" :key="size" :value="size">
                {{ size }} 吋
              </option>
            </select>
            <input
              v-model.number="fromHeightCm"
              type="number"
              placeholder="高度(公分)預設為5公分"
            />
          </div>
        </div>
        <div v-else>
          <div v-if="fromShape === 'round'" class="input-row">
            <span class="required">*</span>
            <input
              v-model.number="fromSize1Cm"
              type="number"
              placeholder="直徑(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="fromHeightCm"
              type="number"
              placeholder="高度(公分)"
            />
          </div>
          <div v-else-if="fromShape === 'custom'" class="input-row">
            <span class="required">*</span>
            <input
              v-model.number="fromSize1Cm"
              type="number"
              placeholder="長度(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="fromSize2Cm"
              type="number"
              placeholder="寬度(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="fromHeightCm"
              type="number"
              placeholder="高度(公分)"
            />
          </div>
          <div v-else-if="fromShape === 'square'" class="input-row">
            <span class="required">*</span>
            <input
              v-model.number="fromSize1Cm"
              type="number"
              placeholder="邊長(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="fromHeightCm"
              type="number"
              placeholder="高度(公分)"
            />
          </div>
          <div v-else class="input-row">
            <span class="required">*</span>
            <input
              v-model.number="fromSize1Cm"
              type="number"
              placeholder="長度(公分)"
            />
            <input
              v-model.number="fromSize2Cm"
              type="number"
              placeholder="寬度(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="fromHeightCm"
              type="number"
              placeholder="高度(公分)"
            />
          </div>
        </div>
      </div>
      <div class="mold-col">
        <h3>新模具資訊</h3>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" value="round" v-model="toShape" />
            <span>圓形模具</span>
          </label>
          <label class="radio-label">
            <input type="radio" value="square" v-model="toShape" />
            <span>方形模具</span>
          </label>
          <label class="radio-label">
            <input
              type="radio"
              value="custom"
              v-model="toShape"
              @change="toUnit = 'cm'"
            />
            <span>自定義(長方體/公分)</span>
          </label>
        </div>
        <div class="radio-group">
          <label class="radio-label">
            <input
              type="radio"
              value="inch"
              v-model="toUnit"
              :disabled="toShape === 'custom'"
            />
            <span :class="{ disabled: toShape === 'custom' }">吋</span>
          </label>
          <label class="radio-label">
            <input type="radio" value="cm" v-model="toUnit" />
            <span>公分</span>
          </label>
        </div>
        <div v-if="toUnit === 'inch'">
          <div v-if="toShape === 'round'" class="input-row">
            <span class="required">*</span>
            <select v-model.number="toSize1Inch">
              <option :value="null" disabled>選擇(吋)</option>
              <option v-for="size in inchOptions" :key="size" :value="size">
                {{ size }} 吋
              </option>
            </select>
            <!-- 吋模具高度不必填，不顯示紅色* -->
            <input
              v-model.number="toHeightCm"
              type="number"
              placeholder="高度(公分)預設為5公分"
            />
          </div>
          <div v-else class="input-row">
            <span class="required">*</span>
            <select v-model.number="toSize1Inch">
              <option :value="null" disabled>選擇(吋)</option>
              <option v-for="size in inchOptions" :key="size" :value="size">
                {{ size }} 吋
              </option>
            </select>
            <!-- 吋模具高度不必填，不顯示紅色* -->
            <input
              v-model.number="toHeightCm"
              type="number"
              placeholder="高度(公分)預設為5公分"
            />
          </div>
        </div>
        <div v-else>
          <div v-if="toShape === 'round'" class="input-row">
            <span class="required">*</span>
            <input
              v-model.number="toSize1Cm"
              type="number"
              placeholder="直徑(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="toHeightCm"
              type="number"
              placeholder="高度(公分)"
            />
          </div>
          <div v-else-if="toShape === 'custom'" class="input-row">
            <span class="required">*</span>
            <input
              v-model.number="toSize1Cm"
              type="number"
              placeholder="長度(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="toSize2Cm"
              type="number"
              placeholder="寬度(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="toHeightCm"
              type="number"
              placeholder="高度(公分)"
            />
          </div>
          <div v-else-if="toShape === 'square'" class="input-row">
            <span class="required">*</span>
            <input
              v-model.number="toSize1Cm"
              type="number"
              placeholder="邊長(公分)"
            />
            <span class="required">*</span>
            <input
              v-model.number="toHeightCm"
              type="number"
              placeholder="高度(公分)"
            />
          </div>
        </div>
      </div>
    </div>

    <button @click="convertRecipe">換算食譜</button>
  </div>
</template>

<script setup lang="ts">
import "@/assets/styles/BakingConversionCalculator/BakingConversionCalculator.scss";
import { ref } from "vue";

const INCH_TO_CM = 2.54;

// 響應式欄位
const inputText = ref("");
const fromShape = ref<"round" | "square" | "custom">("round");
const fromUnit = ref<"inch" | "cm">("inch");
const fromSize1Inch = ref<number | null>(null); // 吋-直徑或長度
const fromSize2Inch = ref<number | null>(null); // 吋-寬度
const fromHeightInch = ref<number | null>(null); // 吋-高度
const fromSize1Cm = ref<number | null>(null); // 公分-直徑或長度
const fromSize2Cm = ref<number | null>(null); // 公分-寬度
const fromHeightCm = ref<number | null>(null); // 公分-高度
const toShape = ref<"round" | "square" | "custom">("round");
const toUnit = ref<"inch" | "cm">("inch");
const toSize1Inch = ref<number | null>(null); // 吋-直徑或長度
const toSize2Inch = ref<number | null>(null); // 吋-寬度
const toHeightInch = ref<number | null>(null); // 吋-高度
const toSize1Cm = ref<number | null>(null); // 公分-直徑或長度
const toSize2Cm = ref<number | null>(null); // 公分-寬度
const toHeightCm = ref<number | null>(null); // 公分-高度
const result = ref("");

function copyResult() {
  if (!result.value) return;
  navigator.clipboard
    .writeText(result.value)
    .then(() => {
      alert("已複製到剪貼簿！");
    })
    .catch(() => {
      alert("複製失敗，請手動複製。");
    });
}

// 常用吋尺寸選項
const inchOptions = [4, 5, 6, 7, 8, 9, 10, 12];

function parseLine(line: string) {
  const match = line.match(/^(.+?)\s+([\d\.]+)\s*(.+)?$/);
  if (match) {
    return {
      name: match[1],
      amount: parseFloat(match[2]),
      unit: match[3] || "",
    };
  }
  return null;
}

function convertToCm(value: number, unit: string) {
  return unit === "inch" ? value * INCH_TO_CM : value;
}

function getVolume(
  shape: string,
  size1: number,
  size2: number | null,
  height: number
) {
  if (shape === "round") {
    const radius = size1 / 2;
    return Math.PI * radius * radius * height;
  } else if (shape === "square") {
    return size1 * (size2 ?? size1) * height;
  } else if (shape === "custom") {
    // 長方體體積 = 長*寬*高
    return size1 * (size2 ?? 1) * height;
  }
  return 1;
}

function roundAmount(amount: number, unit: string, name: string) {
  const eggUnits = ["蛋", "蛋黃", "蛋白"];
  if (eggUnits.some((word) => name.includes(word))) {
    return Math.round(amount);
  }
  const wholeUnits = ["顆", "個", "枚", "片"];
  const integerUnits = ["克", "g", "公克", "ml", "毫升"];
  if (wholeUnits.some((u) => unit.includes(u))) {
    return Math.round(amount);
  } else if (integerUnits.some((u) => unit.includes(u))) {
    return Math.round(amount);
  } else {
    return parseFloat(amount.toFixed(1));
  }
}

function getDefaultHeight(unit: string): number {
  // 常見烤模高度：2吋或5公分
  return unit === "inch" ? 2 : 5;
}

// 取得高度（永遠以公分為主，吋模具時也只取公分欄位）
function getHeightCm(unit: string, heightCm: number | null): number {
  if (heightCm && heightCm > 0) return heightCm;
  return getDefaultHeight("cm");
}

function convertRecipe() {
  const input = inputText.value.trim();
  let f1, f2, fh, t1, t2, th;
  // 依 shape 決定 input 來源
  if (fromShape.value === "custom") {
    f1 = fromSize1Cm.value;
    f2 = fromSize2Cm.value;
    fh = fromHeightCm.value;
  } else if (fromShape.value === "square" && fromUnit.value === "cm") {
    f1 = fromSize1Cm.value;
    f2 = fromSize1Cm.value; // 方形公分只用單邊
    fh = fromHeightCm.value;
  } else {
    f1 = fromUnit.value === "inch" ? fromSize1Inch.value : fromSize1Cm.value;
    f2 =
      fromShape.value === "round"
        ? fromUnit.value === "inch"
          ? fromSize1Inch.value
          : fromSize1Cm.value
        : fromUnit.value === "inch"
        ? fromSize1Inch.value // 方形吋：長=寬
        : fromSize2Cm.value;
    fh = getHeightCm(fromUnit.value, fromHeightCm.value);
  }
  if (toShape.value === "custom") {
    t1 = toSize1Cm.value;
    t2 = toSize2Cm.value;
    th = toHeightCm.value;
  } else if (toShape.value === "square" && toUnit.value === "cm") {
    t1 = toSize1Cm.value;
    t2 = toSize1Cm.value; // 方形公分只用單邊
    th = toHeightCm.value;
  } else {
    t1 = toUnit.value === "inch" ? toSize1Inch.value : toSize1Cm.value;
    t2 =
      toShape.value === "round"
        ? toUnit.value === "inch"
          ? toSize1Inch.value
          : toSize1Cm.value
        : toUnit.value === "inch"
        ? toSize1Inch.value // 方形吋：長=寬
        : toSize2Cm.value;
    th = getHeightCm(toUnit.value, toHeightCm.value);
  }

  // 修正：所有尺寸都需轉為公分，並處理 null 預設值
  const fromCm1 = convertToCm(f1 ?? 0, fromUnit.value);
  const fromCm2 = convertToCm(f2 ?? 0, fromUnit.value);
  const fromCmH = fromHeightCm.value
    ? fromHeightCm.value
    : getDefaultHeight("cm");
  const toCm1 = convertToCm(t1 ?? 0, toUnit.value);
  const toCm2 = convertToCm(t2 ?? 0, toUnit.value);
  const toCmH = toHeightCm.value ? toHeightCm.value : getDefaultHeight("cm");

  const fromVolume = getVolume(fromShape.value, fromCm1, fromCm2, fromCmH);
  const toVolume = getVolume(toShape.value, toCm1, toCm2, toCmH);
  if (!fromVolume || !toVolume) {
    result.value = "模具體積不能為0，請檢查尺寸輸入";
    return;
  }
  const ratio = toVolume / fromVolume;

  const lines = input.split("\n");
  const output: string[] = [];

  lines.forEach((line) => {
    const parsed = parseLine(line);
    if (parsed) {
      const { name, amount, unit } = parsed;
      let newAmount = amount * ratio;
      newAmount = roundAmount(newAmount, unit, name);
      output.push(`${name} ${newAmount} ${unit}`);
    } else {
      output.push(line);
    }
  });

  result.value = output.join("\n");
}
</script>

<style scoped>
.required {
  color: red;
  margin-right: 0.2em;
}
.copy-btn {
  font-size: 0.75em;
  padding: 1px 7px;
  margin-top: 4px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: #888;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.copy-btn:hover {
  background: #e0e0e0;
  color: #333;
}
</style>
