<script setup>
import navItems from '@/navigation/horizontal'
import { themeConfig } from '@themeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'
import { HorizontalNavLayout } from '@layouts'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import axios from "@/plugins/axios"
import { useCookie } from '@/@core/composable/useCookie'


const menu = ref([])
const miningData = useCookie('miningData')

onBeforeMount(async () => {
  try {
    const response = await axios.get(`/module/get-module-by-user/${miningData.value.role.uuid}`)
    if (response.status >= 200 && response.status < 300) {
      menu.value = response.data.map(e => {
        const menuItem = {
          title: e.title,
          icon: JSON.parse(e.icon),
          to: e.targetPath,
        }

        if (e.targetPath != null) {
          menuItem.targetPath = e.targetPath
        }

        if (e.children && e.children.length > 0) {
          menuItem.children = e.children.map(c => ({
            title: c.title,
            icon: JSON.parse(c.icon),
            to: c.targetPath,
          }))
        }

        return menuItem
      })
    }
  } catch (error) {
    console.error("Error fetching modules:", error)
  }
})
</script>

<template>
  <HorizontalNavLayout :nav-items="menu">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink
        to="/"
        class="app-logo d-flex align-center gap-x-3"
      >
        <VNodeRenderer :nodes="themeConfig.app.logo" />

        <h1 class="app-title font-weight-bold leading-normal text-xl text-capitalize">
          {{ themeConfig.app.title }}
        </h1>
      </RouterLink>
      <VSpacer />

      <NavBarI18n
        v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
        :languages="themeConfig.app.i18n.langConfig"
      />

      <NavbarThemeSwitcher class="me-2" />
      <UserProfile />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </HorizontalNavLayout>
</template>
