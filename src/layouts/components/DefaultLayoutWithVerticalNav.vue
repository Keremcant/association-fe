<script setup>
import navItems from '@/navigation/vertical'
import { themeConfig } from '@themeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'

const menu = ref([])
const associationData = useCookie('associationData')

onBeforeMount(async () => {
  try {
    const response = await axios.get(`/module/get-module-by-user/${associationData.value.role.uuid}`)
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

// @layouts plugin
import { HorizontalNavLayout, VerticalNavLayout } from '@layouts'
import { useCookie } from "@core/composable/useCookie.js"
import axios from "@/plugins/axios.js"
</script>

<template>
  <VerticalNavLayout :nav-items="menu">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            size="26"
            icon="tabler-menu-2"
          />
        </IconBtn>

        <NavbarThemeSwitcher />

        <VSpacer />

        <NavBarI18n
          v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
          :languages="themeConfig.app.i18n.langConfig"
        />
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>
