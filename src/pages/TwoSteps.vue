<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- Üst şekil -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- Alt şekil -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- Auth kart -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardText>
          <h4 class="text-h4 mb-1 text-center">
            İki Adımlı Doğrulama
          </h4>
          <p class="mb-1 text-center">
            E-posta adresinize gönderilen OTP kodunu giriniz.
          </p>
          <h6 class="text-h6 text-center">
            {{ route.query.email }}
          </h6>
        </VCardText>

        <VCardText>
          <VForm
            ref="refOtpForm"
            @submit.prevent="onSubmitOtp"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-body-1 text-center mb-2">
                  6 haneli güvenlik kodunu giriniz
                </h6>

                <!-- OTP Input -->
                <div class="d-flex justify-center mb-6">
                  <VOtpInput
                    v-model="otpCode"
                    :length="6"
                    type="number"
                    :disabled="isVerifying"
                    class="pa-0 otp-input"
                    @finish="onFinishOtp"
                  />
                </div>
              </VCol>

              <!-- Doğrula Butonu -->
              <VBtn
                :loading="isVerifying"
                :disabled="isVerifying"
                block
                type="submit"
              >
                Doğrula
              </VBtn>


              <!-- OTP Yeniden Gönder -->
              <VCol
                cols="12"
                class="text-center mt-4"
              >
                <VBtn
                  variant="text"
                  color="primary"
                  :disabled="resendDisabled"
                  @click="resendOtp"
                >
                  {{ resendDisabled
                    ? `${resendTimer} saniye sonra tekrar deneyin`
                    : 'OTP Yeniden Gönder' }}
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
import { useAbility } from '@/plugins/casl/composables/useAbility.js'

definePage({
  name: 'two-steps',
  meta: { layout: 'blank', unauthenticatedOnly: true },
})

const router = useRouter()
const route = useRoute()
const snackbar = ref()
const ability = useAbility()
const refOtpForm = ref()

const otpCode = ref('')
const isVerifying = ref(false)
const resendDisabled = ref(false)
const resendTimer = ref(60)
let resendInterval = null

onMounted(() => startResendTimer())
onUnmounted(() => clearInterval(resendInterval))

const onFinishOtp = async value => {
  otpCode.value = value
}

const onSubmitOtp = async () => {
  const { valid } = await refOtpForm.value.validate()
  if (!valid) return

  isVerifying.value = true // buton loading + disable olacak

  try {
    const res = await axios.post('/auth/verify-otp', {
      email: route.query.email,
      otp: otpCode.value,
    })

    if (res.status >= 200 && res.status < 300) {
      // 🔹 Burada butonu açmıyoruz artık!
      await handleSuccessfulLogin(res.data)
    } else {
      snackbar.value.show(res.data || 'Kod hatalı veya süresi dolmuş.', 'error')
      isVerifying.value = false // sadece hata durumunda aç
    }
  } catch (err) {
    snackbar.value.show(err.response?.data?.message || 'Kod hatalı veya süresi dolmuş.', 'error')
    isVerifying.value = false // sadece hata durumunda aç
  }
}



// OTP yeniden gönder
const resendOtp = async () => {
  try {
    await axios.post('/auth/resend-otp', { email: route.query.email })
    snackbar.value.show('Yeni OTP kodu e-posta adresinize gönderildi.', 'success')
    startResendTimer()
  } catch (err) {
    snackbar.value.show('OTP gönderilemedi.', 'error')
  }
}

// Geri sayım
const startResendTimer = () => {
  resendDisabled.value = true
  resendTimer.value = 60
  clearInterval(resendInterval)
  resendInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      resendDisabled.value = false
      clearInterval(resendInterval)
    }
  }, 1000)
}

// Başarılı giriş sonrası işlemler
const handleSuccessfulLogin = async data => {
  const { accessToken, userData, userAbilities } = data

  useCookie('associationAbilityRules').value = userAbilities
  ability.update(userAbilities)
  useCookie('associationData').value = userData
  useCookie('associationToken').value = accessToken

  await nextTick(() => {
    const roleRoutes = { ADMIN: '/dashboard/user-dashboard' }
    const redirectPath = roleRoutes[userData.role?.name] || '/dashboard/user-dashboard'

    router.replace(redirectPath)
  })
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.otp-input {
  .v-otp-input__content {
    justify-content: center;
    gap: 8px;
  }

  .v-otp-input__field {
    width: 48px;
    height: 56px;
    font-size: 1.25rem;
    text-align: center;
    border-radius: 8px;
  }
}
</style>
