<template>
  <VCard>
    <VRow no-gutters>
      <VCol cols="8">
        <VCardText>
          <h5 class="text-h5 text-no-wrap">
            Merhaba Doğaç
          </h5>
          <p class="mb-2">
            Güncel Borç Tutarı
          </p>
          <h4 class="text-h4 text-primary mb-1">
            10.000 TL
          </h4>
        </VCardText>
      </VCol>

      <VCol cols="4">
        <VCardText class="pb-0 px-0 position-relative h-100">
          <VImg
            :src="congoImg"
            :height="$vuetify.display.smAndUp ? 147 : 125"
            class="congo-john-img w-100"
          />
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>

<script setup>
import congoImg from '@images/illustrations/congo-illustration.png'
</script>

<style lang="scss" scoped>
.congo-john-img {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 1.25rem;
}
</style>
