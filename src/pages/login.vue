<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- Arka plan şekilleri -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardText>
          <h4 class="text-h4 mb-1 text-center">
            Association Admin Panel
          </h4>
          <p class="mb-0 text-center">
            {{ $t('Please sign in to your account') }}
          </p>
        </VCardText>

        <!-- LOGIN FORM -->
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmitLogin"
          >
            <VRow>
              <!-- email -->
              <VCol
                cols="12"
                class="mb-4"
              >
                <AppTextField
                  v-model="credentials.email"
                  :label="$t('Email')"
                  :placeholder="$t('Email')"
                  type="email"
                  autofocus
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                  class="auth-input"
                />
              </VCol>

              <!-- password -->
              <VCol
                cols="12"
                class="mb-4"
              >
                <AppTextField
                  v-model="credentials.password"
                  :label="$t('Password')"
                  placeholder="············"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  class="auth-input"
                  style="min-width: 300px;"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex flex-column align-left my-6">
                  <RouterLink
                    class="text-primary"
                    :to="{ name: 'register-form' }"
                  >
                    {{ $t('Register') }}
                  </RouterLink>
                  <RouterLink
                    class="text-primary"
                    :to="{ name: 'forgot-password' }"
                  >
                    {{ $t('Forgot Password') }}
                  </RouterLink>
                </div>
              </VCol>

              <VCol
                cols="12"
                class="d-flex justify-center"
              >
                <VBtn
                  block
                  type="submit"
                  class="auth-btn"
                  :loading="isLoading"
                >
                  {{ $t('Login') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>

  <SnackBar ref="snackbar" />
</template>

<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import axios from '@/plugins/axios'
import { ref } from "vue"

definePage({
  meta: { layout: 'blank', unauthenticatedOnly: true },
})

const router = useRouter()
const snackbar = ref()
const refVForm = ref()
const isPasswordVisible = ref(false)
const isLoading = ref(false)

const credentials = ref({ email: '', password: '' })
const errors = ref({ email: undefined, password: undefined })

const onSubmitLogin = async () => {
  const { valid } = await refVForm.value.validate()
  if (!valid) return
  isLoading.value = true

  try {
    const res = await axios.post('/auth/login', {
      email: credentials.value.email,
      password: btoa(credentials.value.password),
    })

    if (res.status >= 200 && res.status < 300) {
      snackbar.value.show('OTP mailinize gönderildi.', 'success')
      isLoading.value = false
      router.push({
        name: 'two-steps',
        query: { email: credentials.value.email },
      })
      
      return
    }else if(res.status === 403) {
      snackbar.value.show(res.data || 'Hesap kilitli veya onaysız.', 'error')
      isLoading.value = false
    }else if(res.status === 401) {
      snackbar.value.show(res.data, 'error')
      isLoading.value = false
    }else if(res.status === 460) {
      console.log(res)
      router.push({ name: 'first-entry-id', params: { id: res.data.passwordUUID } })
    }
  } catch (err) {
    if (err.response?.status === 403)
      snackbar.value.show(err.response.data || 'Hesap kilitli veya onaysız.', 'error')
    else if (err.response?.status === 401)
      snackbar.value.show('Email veya şifre hatalı.', 'error')
    else snackbar.value.show('Beklenmedik bir hata oluştu.', 'error')
    isLoading.value = false
  }
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
