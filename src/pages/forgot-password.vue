<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <RouterLink to="/">
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
            </RouterLink>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">
            {{ $t('Forgot Password') }}
          </h4>
          <p class="mb-0">
            {{ $t('Enter your email and we ll send you instructions to reset your password') }}
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.email"
                  autofocus
                  type="email"
                  :label="$t('Email')"
                  :rules="[requiredValidator, emailValidator]"
                  :placeholder="$t('Email')"
                />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn
                  block
                  type="onSubmit"
                >
                  {{ $t('Send Reset Link') }}
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    size="20"
                    class="me-1 flip-in-rtl"
                  />
                  <span>{{ $t('Back To Login') }}</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'
import axios from "@/plugins/axios"

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const form = ref({ email: '' })
const refVForm = ref()
const router = useRouter()

const onSubmit = () => {
  refVForm.value?.validate().then(async ({ valid: isValid }) => {
    if (isValid)
      try {

        const res = await axios.post(`/user-api/send-update-password-mail/${form.value.email}`)


        if (res.status >= 200 && res.status < 300) {
          router.push({ name: 'login' })
        } else {
          console.error('Dosya yükleme hatası')
          isLoading.value = false
        }


      } catch (err) {
        snackbar.value.show('Incorrect password or incorrect e-mail. Please Try Again', 'error')
      }
  })
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
