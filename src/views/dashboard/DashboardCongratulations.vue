<template>
  <VCard>
    <VRow no-gutters>
      <VCol cols="8">
        <VCardText>
          <!-- 🔹 Merhaba + Kullanıcı Adı -->
          <h5 class="text-h5 text-no-wrap">
            Merhaba <span class="font-weight-medium text-primary">{{ data?.fullName || '' }}</span>
          </h5>

          <p class="mb-2">
            Toplam Alacak Tutarı
          </p>

          <!-- 🔹 Toplam alacak tutarı (örnek: 120.000 TL) -->
          <h4 class="text-h4 text-primary mb-1">
            {{ formatCurrency(data?.totalReceivableAmount) }}
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

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

// 🔹 Para formatlamak için küçük yardımcı fonksiyon
const formatCurrency = amount => {
  if (!amount) return '0 TL'
  
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
}
</script>

<style lang="scss" scoped>
.congo-john-img {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 1.25rem;
}
</style>
