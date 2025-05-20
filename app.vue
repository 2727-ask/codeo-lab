<template>
  <div class="flex h-screen w-screen overflow-hidden">
    <!-- Column 1: Fixed 5% -->
    <div class="bg-gray-800 text-white flex-shrink-0" :style="{ width: '5vw' }">
      <div class="h-full flex items-center justify-center">
        <SideNavigationMenu />
      </div>
    </div>

    <!-- Column 2: Resizable, min 0vw, max 60vw, initial 20vw -->
    <div
      class="bg-gray-100 flex-shrink-0 relative"
      :style="{ width: col2Width + 'vw', overflow: 'hidden' }"
    >
      <div class="h-full flex items-center justify-center">Col 2</div>
      <!-- Dragger for Col 2 (right edge) -->
      <div
        class="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10"
        @mousedown="startCol2Resize"
      ></div>
    </div>

    <!-- Column 3: Flexible with 2 rows, row2 overlays row1 and is vertically resizable -->
    <div class="bg-white flex-1 relative" :style="{ minWidth: '0' }">
      <!-- Row 1 (base row) -->
      <div class="h-full w-full relative">
        <div class="h-full flex items-center justify-center bg-blue-50">
          Row 1 (Base)
        </div>
        <!-- Row 2 (overlay, resizable in height) -->
        <div
          class="absolute left-0 w-full bg-blue-200 shadow-lg z-20 flex flex-col"
          :style="{ bottom: 0, height: row2Height + '%' }"
        >
          <!-- Dragger for Row 2 (top edge) -->
          <div
            class="h-2 w-full cursor-row-resize bg-blue-300 z-30"
            @mousedown="startRow2Resize"
          ></div>
          <div class="flex-1 flex items-center justify-center">
            Row 2 (Overlay)
          </div>
        </div>
      </div>
      <!-- Dragger for Col 4 (left edge), positioned at the right edge of Col 3 -->
      <div
        class="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10"
        @mousedown="startCol4Resize"
      ></div>
    </div>

    <!-- Column 4: Resizable, min 0vw, max 60vw, initial 20vw -->
    <div
      class="bg-gray-200 flex-shrink-0"
      :style="{ width: col4Width + 'vw', overflow: 'hidden' }"
    >
      <div class="h-full flex items-center justify-center">Col 4</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const col2Width = ref(20); // in vw
const col4Width = ref(20); // in vw

let resizingCol2 = false;
let resizingCol4 = false;

function startCol2Resize(e: MouseEvent) {
  resizingCol2 = true;
  document.body.style.cursor = "col-resize";
  window.addEventListener("mousemove", handleCol2Resize);
  window.addEventListener("mouseup", stopCol2Resize);
}

function handleCol2Resize(e: MouseEvent) {
  if (!resizingCol2) return;
  const min = 0;
  const max = 60;
  const vw = window.innerWidth / 100;
  let newWidth = e.clientX / vw - 5; // subtract col1 width (5vw)
  newWidth = Math.max(min, Math.min(max, newWidth));
  col2Width.value = newWidth;
}

function stopCol2Resize() {
  resizingCol2 = false;
  document.body.style.cursor = "";
  window.removeEventListener("mousemove", handleCol2Resize);
  window.removeEventListener("mouseup", stopCol2Resize);
}

function startCol4Resize(e: MouseEvent) {
  resizingCol4 = true;
  document.body.style.cursor = "col-resize";
  window.addEventListener("mousemove", handleCol4Resize);
  window.addEventListener("mouseup", stopCol4Resize);
}

function handleCol4Resize(e: MouseEvent) {
  if (!resizingCol4) return;
  const min = 0;
  const max = 60;
  const vw = window.innerWidth / 100;
  let newWidth = (window.innerWidth - e.clientX) / vw;
  newWidth = Math.max(min, Math.min(max, newWidth));
  col4Width.value = newWidth;
}

function stopCol4Resize() {
  resizingCol4 = false;
  document.body.style.cursor = "";
  window.removeEventListener("mousemove", handleCol4Resize);
  window.removeEventListener("mouseup", stopCol4Resize);
}

// Row 2 (overlay) vertical resizing logic
const row2Height = ref(30); // in percent, initial 30% of col3 height
let resizingRow2 = false;

function startRow2Resize(e: MouseEvent) {
  resizingRow2 = true;
  document.body.style.cursor = "row-resize";
  window.addEventListener("mousemove", handleRow2Resize);
  window.addEventListener("mouseup", stopRow2Resize);
}

function handleRow2Resize(e: MouseEvent) {
  if (!resizingRow2) return;
  const col3 = document.querySelector(".bg-white.flex-1.relative");
  if (!col3) return;
  const rect = (col3 as HTMLElement).getBoundingClientRect();
  // Calculate height from bottom edge of col3 to mouse Y (since Row2 is absolutely positioned from bottom)
  let newHeight = ((rect.bottom - e.clientY) / rect.height) * 100;
  newHeight = Math.max(0, Math.min(100, newHeight));
  row2Height.value = newHeight;
}

function stopRow2Resize() {
  resizingRow2 = false;
  document.body.style.cursor = "";
  window.removeEventListener("mousemove", handleRow2Resize);
  window.removeEventListener("mouseup", stopRow2Resize);
}
</script>
