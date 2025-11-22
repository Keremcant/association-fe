<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle>{{ t('User Information') }}</VCardTitle>
        <VDivider />
        <VCardText>
          <VForm>
            <VRow>
              <!-- First Name -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.firstName"
                  :label="t('First Name')"
                  :placeholder="t('First Name')"
                  :disabled="!updatable"
                />
              </VCol>

              <!-- Last Name -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.lastName"
                  :label="t('Last Name')"
                  :placeholder="t('Last Name')"
                  :disabled="!updatable"
                />
              </VCol>

              <!-- Email -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.email"
                  :label="t('Email')"
                  :placeholder="t('Email')"
                  :disabled="!updatable"
                />
              </VCol>

              <!-- Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.phone"
                  :label="t('Phone')"
                  :placeholder="t('Phone')"
                  :disabled="!updatable"
                />
              </VCol>

              <!-- TR Identity No -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="accountDataLocal.identityNumber"
                  :label="t('TR Identity No')"
                  :placeholder="t('TR Identity No')"
                  :disabled="!updatable"
                />
              </VCol>

              <!-- Güncelle Butonu veya Bilgi Mesajı -->
              <VCol
                cols="12"
                class="d-flex flex-column gap-2 mt-4"
              >
                <template v-if="updatable">
                  <VBtn
                    color="primary"
                    :loading="isLoading"
                    @click.prevent="saveChanges"
                  >
                    {{ t('Update') }}
                  </VBtn>
                </template>

                <template v-else>
                  <p class="text-body-1 text-grey-darken-1">
                    Profil bilginizi güncellemek istiyorsanız. Hafta içi 09:00 – 17:30 saatleri arasında
                    <a>0532 467 91 32</a> numarası ile iletişime geçiniz.
                  </p>
                </template>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <SnackBar ref="snackbar" />
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios.js'
import AppTextField from '@core/components/app-form-elements/AppTextField.vue'
import { useI18n } from 'vue-i18n'
import { useCookie } from '@/@core/composable/useCookie' // ✅ login bilgisini almak için

const { t } = useI18n()

// 🔹 Giriş yapan kullanıcıyı al
const userData = useCookie('associationData') // Login sonrası set edilen cookie
const loggedInUser = ref(userData.value.id ? userData.value.id : null)


// 🔹 Form bilgileri
const accountDataLocal = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  identityNumber: '',
})

const userUUID = ref(null)
const isLoading = ref(false)
const snackbar = ref()
const updatable = ref()

const getUserData = async () => {
  try {
    if (!loggedInUser.value) {
      console.error('Kullanıcı oturumu bulunamadı.')
      
      return
    }

    isLoading.value = true
    userUUID.value = loggedInUser.value

    const response = await axios.get(`/user-api/${userUUID.value}`)

    const user = response.data || {}

    accountDataLocal.value.firstName = user.firstName || ''
    accountDataLocal.value.lastName = user.lastName || ''
    accountDataLocal.value.email = user.email || ''
    accountDataLocal.value.phone = user.gsm || ''
    accountDataLocal.value.identityNumber = user.identityNumber || ''
    updatable.value = user.updatable
  } catch (error) {
    console.error('Kullanıcı verisi alınamadı:', error)
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  if (!userUUID.value) return
  try {
    isLoading.value = true

    const payload = {
      firstName: accountDataLocal.value.firstName,
      lastName: accountDataLocal.value.lastName,
      email: accountDataLocal.value.email,
      gsm: accountDataLocal.value.phone,
      identityNumber: accountDataLocal.value.identityNumber,
    }

    const response = await axios.put(`/user-api/${userUUID.value}`, payload)

    if (response.status >= 200 && response.status < 300) {
      snackbar.value.show('Profile Updated.', 'success')
      getUserData()
    }
  } catch (err) {
    console.error('Güncelleme hatası:', err)
  } finally {
    isLoading.value = false
  }
}

// 🔹 Formu eski haline döndür
const cancelChanges = () => {
  getUserData()
}

// 🔹 Sayfa yüklendiğinde çalıştır
onMounted(() => {
  getUserData()
})
</script>
