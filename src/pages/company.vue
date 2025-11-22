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
            {{ user.institutionName }}
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
                {{ t('Company Name') }}: {{ user.institutionName }}
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ t('Company Phone') }}: {{ user.institutionPhone }}
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ t('Company Email') }}: {{ user.institutionMail }}
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ t('Region') }}: {{ user.institutionRegion }}
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ t('City') }}: {{ user.institutionProvince }}
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <VCardText class="d-flex justify-center gap-x-4 pb-8">
          <template v-if="user.updatable === true || user.updatable === 'true'">
            <VBtn
              variant="elevated"
              color="primary"
              @click="openEditDialog(user)"
            >
              {{ t('Edit') }}
            </VBtn>
          </template>
          <template v-else>
            <p class="text-body-1 text-grey-darken-1">
              Kurum bilginizi güncellemek istiyorsanız. Hafta içi 09:00 – 17:30 saatleri arasında
              <a>0532 467 91 32</a> numarası ile iletişime geçiniz. {{ user.updatable }}
            </p>
          </template>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <VDialog
    v-model="uploadDialog"
    scrollable
    max-width="600px"
    transition="dialog-transition"
  >
    <VCard>
      <VCardText>
        <CompanyEditDialog
          v-model:is-user-info-edit-dialog-visible="uploadDialog"
          :selected-institution="selectedInstitutionUUID"
          @update-user="handleUpdateUser"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/plugins/axios.js'
import { useI18n } from 'vue-i18n'
import CompanyEditDialog from "@/components/company/CompanyEditDialog.vue"
import { useCookie } from "@core/composable/useCookie.js"

const { t } = useI18n()

const userData = useCookie('associationData')
const loggedInUser = ref(userData.value.id ? userData.value.id : null)
const userUUID = ref(null)
const isLoading = ref(false)
const users = ref([])
const uploadDialog = ref(false)
const selectedInstitutionUUID = ref(null)

// Kullanıcı verisini çek
const getUserData = async () => {
  try {
    if (!loggedInUser.value) return

    isLoading.value = true
    userUUID.value = loggedInUser.value

    const response = await axios.get(`/user-api/${userUUID.value}`)
    const user = response.data || {}

    users.value = user.institutions
  } catch (error) {
    console.error('Kullanıcı verisi alınamadı:', error)
  } finally {
    isLoading.value = false
  }
}

// Edit butonuna basınca diyalog aç
const openEditDialog = user => {
  selectedInstitutionUUID.value = user.uuid
  uploadDialog.value = true
}

// Emit geldiğinde tetiklenecek fonksiyon
const handleUpdateUser = async () => {
  uploadDialog.value = false // diyalogu kapat
  await getUserData() // listeyi yenile
}

onMounted(() => {
  getUserData()
})
</script>

<style scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}
</style>
