<template>
  <div class="new-password-page">
    <VCard
      class="password-card"
      max-width="400"
    >
      <VCardText class="text-center">
        <h3>{{ $t('Create New Password') }}</h3>
        <p class="subtitle">
          {{ $t('Please enter your current password and set a new password') }}
        </p>
      </VCardText>

      <VCardText>
        <VForm
          ref="refVForm"
          @submit.prevent="onSubmit"
        >
          <VRow>
            <!-- New Password -->
            <VCol
              cols="12"
              class="mb-4"
            >
              <AppTextField
                v-model="credentials.newPassword"
                :label="$t('New Password')"
                :rules="[requiredValidator, passwordValidator]"
                :append-inner-icon="showNewPassword ? 'tabler-eye-off' : 'tabler-eye'"
                :type="showNewPassword ? 'text' : 'password'"
                @click:append-inner="showNewPassword = !showNewPassword"
              />
            </VCol>

            <!-- Confirm New Password -->
            <VCol
              cols="12"
              class="mb-4"
            >
              <AppTextField
                v-model="credentials.confirmPassword"
                :label="$t('Confirm New Password')"
                :rules="[requiredValidator, matchPasswordValidator]"
                :append-inner-icon="showConfirmPassword ? 'tabler-eye-off' : 'tabler-eye'"
                :type="showConfirmPassword ? 'text' : 'password'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
              />
            </VCol>

            <VCol
              cols="12"
              class="d-flex justify-center"
            >
              <VBtn
                block
                type="submit"
                color="primary"
                :loading="isLoading"
              >
                {{ $t('Save New Password') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
  <SnackBar ref="snackbar" />
</template>

<script setup>
import { ref } from 'vue'
import { VForm } from 'vuetify/components/VForm'
import axios from "@/plugins/axios.js"
import SnackBar from "@/components/SnackBar.vue"
import { useI18n } from "vue-i18n"

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const { t } = useI18n()
const refVForm = ref(null)
const isLoading = ref(false)
const snackbar = ref()
const route = useRoute()
const id = ref(route.params.id)
const router = useRouter()

const credentials = ref({
  newPassword: '',
  confirmPassword: '',
})

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const requiredValidator = v => !!v || t('This field is required')
const passwordValidator = v => v.length >= 6 || t('New password must be at least 6 characters long and contain at least one special character')
const matchPasswordValidator = v => v === credentials.value.newPassword || t('New password and confirmation password do not match')

const onSubmit = async () => {
  if (refVForm.value.validate()) {

    const payload = {
      newPassword: btoa(credentials.value.newPassword),
      confirmPassword: btoa(credentials.value.confirmPassword),
    }

    isLoading.value = true

    const response = await axios.put(`/user-api/update-new-password/${id.value}`, payload)
    if (response.status >= 200 && response.status < 300) {
      isLoading.value = false
      router.push('/login')
    } else {
      isLoading.value = false
      snackbar.value.show(response.data, 'error')
    }

  }
}
</script>

<style lang="scss">
.new-password-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
}

.password-card {
  width: 100%;
  max-width: 800px;
  padding: 32px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.password-card .subtitle {
  color: #6b7280; /* Hafif gri */
  font-size: 0.95rem;
  margin-bottom: 24px;
}
</style>
