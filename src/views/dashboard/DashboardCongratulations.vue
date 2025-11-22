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
            {{ debtTitle }}
          </p>
          <h4 class="text-h4 text-primary mb-1">
            <template v-if="data?.totalReceivableAmount > 0">
              {{ formatCurrency(data?.totalReceivableAmount) }}

              <!-- 📌 Tarih kısmı -->
              <div
                v-if="data?.lastDebtCreatedDate"
                class="text-body-2 text-grey-darken-1 mt-1"
              >
                {{ formatDate(data.lastDebtCreatedDate) }}
              </div>

              <div
                v-else
                class="text-body-2 text-grey-darken-1 mt-1"
              >
                Tarih bilgisi bulunmamaktadır
              </div>
            </template>

            <template v-else>
              Aidat Borcunuz bulunmamaktadır
            </template>
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
import { ref } from "vue"

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const route = useRoute()

console.log(route.name)

const debtTitle = computed(() => {
  if (route.name === 'dashboard-dashboard') return 'Toplam borç'
  if (route.name === 'dashboard-user-dashboard') return 'Üye Aidat Borcu'
  
  return 'Borç Bilgisi'
})

// 🔹 Para formatlamak için küçük yardımcı fonksiyon
const formatCurrency = amount => {
  if (!amount) return '0 TL'
  
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
}

const formatDate = dateString => {
  if (!dateString) return null
  const date = new Date(dateString)

  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style lang="scss" scoped>
.congo-john-img {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 1.25rem;
}
</style>
