<!-- ❗Errors in the form are set on line 60 -->
<script setup>
import { VForm } from 'vuetify/components/VForm'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import axios from "@/plugins/axios"
// eslint-disable-next-line import/extensions
import { useAbility } from "@/plugins/casl/composables/useAbility.js"

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAbility()

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()

const credentials = ref({
  email: '',
  password: '',
})

const snackbar = ref()

const login = async () => {
  try {
    const encodedPassword = btoa(credentials.value.password)

    const res = await axios.post('/auth/login', {
      email: credentials.value.email,
      password: encodedPassword,
    })

    const { accessToken, userData, userAbilities } = res.data

    // Eğer firstEntry true ise query paramlara bakma, direkt yönlendir
    if (userData.firstEntry) {
      router.push({ name: 'first-entry-id', params: { id: userData.id } })

      return
    }

    // Normal login akışı
    useCookie('miningAbilityRules').value = userAbilities
    ability.update(userAbilities)

    if (Array.isArray(userData.role) && userData.role.length === 1) {
      userData.role = userData.role
    }

    useCookie('miningData').value = userData
    useCookie('miningToken').value = accessToken

    await nextTick(() => {
      const roleRoutes = { 'ADMIN': '/dashboard/dashboard' }
      const redirectPath = roleRoutes[userData.role.name] || '/dashboard/dashboard'

      // query param varsa normal kullanıcı için kullan, firstEntry için zaten return ettik
      router.replace(route.query.to ? String(route.query.to) : redirectPath)
    })
  } catch (err) {
    snackbar.value.show('Incorrect password or incorrect e-mail. Please Try Again', 'error')
  }
}



const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

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

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <!--
          <VCardItem class="justify-center">
          <VCardTitle>
          <RouterLink to="/">
          <div class="app-logo">
          <img
          width="200px"
          :src="udeaLogo"
          >
          </div>
          </RouterLink>
          </VCardTitle>
          </VCardItem>
        -->

        <VCardText>
          <h4 class="text-h4 mb-1">
            <span class="text-capitalize">mining Admin Panel</span>
          </h4>
          <p class="mb-0">
            {{ $t('Please sign-in to your account') }}
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
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
              </VCol>

              <VCol
                cols="12"
                class="d-flex justify-center"
              >
                <VBtn
                  block
                  type="submit"
                  class="auth-btn"
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

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
