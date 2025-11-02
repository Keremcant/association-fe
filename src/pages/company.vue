<script setup>
import { ref, watch } from 'vue'
import axios from '@/plugins/axios.js'
import { useI18n } from 'vue-i18n'
import AppTextField from '@core/components/app-form-elements/AppTextField.vue'
import AppSelect from '@core/components/app-form-elements/AppSelect.vue'
import CompanyEditDialog from "@/components/company/CompanyEditDialog.vue"

const { t } = useI18n()


// 🔹 Kullanıcı verileri
const users = ref([
  {
    id: 1,
    companyName: 'Özel Kış Gülü Özgür Evler Bakım Merkezi',
    companyPhone: '05551234567',
    companyEmail: 'info@ozguryazilim.com',
    region: 'Akdeniz',
    city: 'Mersin',
    workAddress: 'Çankaya Mah. Teknokent Cad. No:12',
  },
  {
    id: 2,
    companyName: 'Demir Ticaret A.Ş.',
    companyPhone: '905559876543',
    companyEmail: 'iletisim@demirticaret.com',
    region: 'Marmara',
    city: 'İstanbul',
    workAddress: 'Maslak Mh. Büyükdere Cd. No:45',
  },
  {
    id: 3,
    companyName: 'Kaya Bilişim Hizmetleri',
    companyPhone: '905553332211',
    companyEmail: 'destek@kayabilisim.com',
    region: 'Ege',
    city: 'İzmir',
    workAddress: 'Bornova Mh. Sanayi Cd. No:8',
  },
])

// 🔹 Dialog kontrolü
const isUserInfoEditDialogVisible = ref(false)
const selectedUser = ref(null)

// 🔹 localUser için güvenli başlangıç ve watch
const localUser = ref({
  companyName: '',
  companyPhone: '',
  companyEmail: '',
  region: '',
  city: '',
  workAddress: '',
})

watch(
  () => selectedUser.value,
  newVal => {
    if (newVal && typeof newVal === 'object') {
      localUser.value = JSON.parse(JSON.stringify(newVal)) // <-- structuredClone yerine
    } else {
      localUser.value = {
        companyName: '',
        companyPhone: '',
        companyEmail: '',
        region: '',
        city: '',
        workAddress: '',
      }
    }
  },
  { immediate: true },
)



// 🔹 Edit dialog açma
const openEditDialog = user => {
  selectedUser.value = user
  isUserInfoEditDialogVisible.value = true
}

// 🔹 Güncellenen veriyi kaydetme
const updateUser = async updatedUser => {
  try {
    // Backend update isteği
    await axios.post('/api/company/update', updatedUser)

    // Local listeyi güncelle
    const index = users.value.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) users.value[index] = { ...updatedUser }
  } catch (error) {
    console.error('Update failed:', error)
  }
}
</script>

<template>
  <VRow>
    <VCol
      v-for="user in users"
      :key="user.id"
      cols="12"
      md="4"
      class="d-flex"
    >
      <VCard class="flex-grow-1">
        <VCardText class="text-center pt-12 pb-6">
          <h5 class="text-h5 mt-4">
            {{ user.companyName }}
          </h5>
        </VCardText>

        <VCardText>
          <h5 class="text-h5">
            {{ t('Company Details') }}
          </h5>
          <VDivider class="my-4" />

          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                {{ t('Company Name') }}: {{ user.companyName }}
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ t('Company Phone') }}: {{ user.companyPhone }}
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ t('Company Email') }}: {{ user.companyEmail }}
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ t('Region') }}: {{ user.region }}
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ t('City') }}: {{ user.city }}
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <VCardText class="d-flex justify-center gap-x-4 pb-8">
          <VBtn
            variant="elevated"
            color="primary"
            @click="openEditDialog(user)"
          >
            {{ t('Edit') }}
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- 🔹 Edit Dialog -->
  <CompanyEditDialog
    v-model:is-user-info-edit-dialog-visible="isUserInfoEditDialogVisible"
    :selected-user="selectedUser"
    @update-user="updateUser"
  />
</template>

<style scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}
</style>
