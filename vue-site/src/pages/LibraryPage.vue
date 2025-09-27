<template>
  <!-- 封面 -->
  <section
    class="cover-frame cover-frame-library"
    :style="{ '--cover-img': 'url(' + base + '/images/library/library_banner.png)' }"
  >
    <div class="cover-frame-inner">
      <div class="lib-switch-btns">
        <button
          class="lib-switch-btn"
          :class="{ active: currentBlock==='A' }"
          @click="currentBlock='A'"
          @mouseenter="hover='vault'"
          @mouseleave="hover=''"
          aria-label="顯示區塊 vault">
          <img
            :src="base + (currentBlock==='A'
                  ? btnAActive
                  : (hover==='A' ? btnAHover : btnA))"
            alt="vault按鈕"
            draggable="false"
            @error="onImgErr($event,'A')" />
        </button>
        <button
          class="lib-switch-btn"
          :class="{ active: currentBlock==='B' }"
          @click="currentBlock='B'"
          @mouseenter="hover='gallery'"
          @mouseleave="hover=''"
          aria-label="顯示區塊 gallery">
          <img
            :src="base + (currentBlock==='B'
                  ? btnBActive
                  : (hover==='B' ? btnBHover : btnB))"
            alt="gallery按鈕"
            draggable="false"
            @error="onImgErr($event,'B')" />
        </button>
      </div>
    </div>
  </section>

  <!-- 下方背景 + 區塊切換 -->
  <section
    class="library-section-switch use-img"
    :style="{ '--switch-bg': 'url(' + base + '/images/library/library_bk.png)' }"
    ref="librarySectionRef"
  >
    <img class="lib-bg-img" :src="base + '/images/library/library_bk.png'" alt="下方背景圖">
    <div class="lib-block-wrap">
      <!-- Block A (Vault) -->
      <transition name="fade">
        <div
          v-if="currentBlock==='A'"
          key="A"
          class="lib-block lib-block-a"
          ref="blockARef"
        >
          <section class="library-photo-section-vault">
            <!-- Block A 改為簡單 2 欄 * 3 行 grid，不使用絕對定位 -->
            <div class="lib-photo-grid lib-photo-grid-a" ref="gridRefA" data-static-grid="1">
              <div
                v-for="(p,i) in photosA"
                :key="'A-'+i"
                class="lib-photo-item"
                :class="p.type"
              >
                <img
                  v-if="p.type==='single'"
                  :src="base + p.src"
                  :alt="p.alt"
                  class="lib-photo-raw"
                  loading="lazy"
                  @error="onPhotoErr($event,true)"
                />
                <div
                  v-else
                  class="lib-photo-frame clickable-frame"
                  :style="{ '--frame-img': 'url(' + base + p.frameSrc + ')' }"
                  @click="handleImageClick(p)"
                  role="button"
                  tabindex="0"
                  @keydown.enter="handleImageClick(p)"
                  @keydown.space="handleImageClick(p)"
                  :aria-label="`查看大圖: ${p.alt}`"
                >
                  <img
                    class="lib-photo-inner"
                    :src="base + p.innerSrc"
                    :alt="p.alt"
                    loading="lazy"
                    @error="onPhotoErr($event,false)"
                    :style="imgStyleB(p)"
                  />
                </div>
                <div v-if="p.caption" class="lib-cap">{{ p.caption }}</div>
              </div>
            </div>
          </section>
        </div>
      </transition>

      <!-- Block B (Gallery) -->
      <transition name="fade">
        <div
          v-if="currentBlock==='B'"
          key="B"
          class="lib-block lib-block-b"
          ref="blockBRef"
        >
          <section class="library-photo-section">
            <div class="lib-photo-grid lib-photo-grid-b" ref="gridRefB" :data-static-grid="useResponsiveLayout ? '1' : '0'">
              <div
                v-for="(p,i) in photosB"
                :key="'B-'+i"
                class="lib-photo-item"
                :class="[p.type, p.absolute && !useResponsiveLayout && 'abs']"
                :style="useResponsiveLayout ? {} : itemStyleB(p)"
              >
                <img
                  v-if="p.type==='single'"
                  :src="base + p.src"
                  :alt="p.alt"
                  class="lib-photo-raw"
                  loading="lazy"
                  @error="onPhotoErr($event,true)"
                />
                <div
                  v-else
                  class="lib-photo-frame clickable-frame"
                  :style="{ '--frame-img': 'url(' + base + p.frameSrc + ')' }"
                  @click="handleImageClick(p)"
                  role="button"
                  tabindex="0"
                  @keydown.enter="handleImageClick(p)"
                  @keydown.space="handleImageClick(p)"
                  :aria-label="`查看大圖: ${p.alt}`"
                >
                  <img
                    class="lib-photo-inner"
                    :src="base + p.innerSrc"
                    :alt="p.alt"
                    loading="lazy"
                    @error="onPhotoErr($event,false)"
                    :style="imgStyleB(p)"
                  />
                </div>
                <div v-if="p.caption" class="lib-cap">{{ p.caption }}</div>
              </div>
            </div>
          </section>
        </div>
      </transition>
    </div>
  </section>

  <!-- 圖片放大彈出視窗 -->
  <Teleport to="body">
    <div 
      v-if="showImageModal" 
      class="image-modal-overlay"
      @click="closeImageModal"
      @keydown.esc="closeImageModal"
    >
      <div 
        class="image-modal-content"
        @click.stop
        role="dialog"
        aria-modal="true"
        :aria-label="`大圖檢視: ${modalImageAlt}`"
      >
        <button 
          class="image-modal-close"
          @click="closeImageModal"
          aria-label="關閉大圖"
        >
          ×
        </button>
        <img 
          :src="modalImageSrc" 
          :alt="modalImageAlt"
          class="image-modal-img"
          ref="modalImage"
          loading="lazy"
          @load="handleImageLoad"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import '@/styles/library.css';
import { useLibraryPageState } from '../composables/libraryPageState';

const {
  base,
  currentBlock,
  btnA, btnAActive, btnAHover,
  btnB, btnBActive, btnBHover,
  hover,
  photosA,
  photosB,
  onImgErr,
  onPhotoErr,
  gridRefA,
  gridRefB,
  blockARef,
  blockBRef,
  librarySectionRef,
  itemStyleA,
  itemStyleB,
  imgStyleB,
  useResponsiveLayout,
  // 圖片放大功能
  showImageModal,
  modalImageSrc,
  modalImageAlt,
  modalImage,
  openImageModal,
  closeImageModal,
  handleImageLoad,
  handleImageClick,
  handleEscape,
  handleResize
} = useLibraryPageState();
</script>

<!-- 樣式已分離至 library.css -->
