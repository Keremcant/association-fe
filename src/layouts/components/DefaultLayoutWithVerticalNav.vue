<script setup>
import navItems from '@/navigation/vertical'
import { themeConfig } from '@themeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'

const menu = ref([])
const institutions = ref([])
const institution = ref()
const associationData = useCookie('associationData')

onBeforeMount(async () => {
  try {
    const response = await axios.get(`/institution/${associationData.value.id}/institutions`)
    if (response.status >= 200 && response.status < 300) {
      const validInstitutions = response.data.institutions.filter(inst => inst.uuid)

      institutions.value = validInstitutions.map(inst => ({
        label: inst.institutionName,
        value: inst.uuid,
      }))

      const activeInstitution = validInstitutions.find(i => i.active === true || i.active === "true" || i.active === 1)
      if (activeInstitution) institution.value = activeInstitution.uuid
    }
  } catch (error) {
    console.error("Error fetching institutions:", error)
  }
})


let initialized = false

watch(institution, async (newVal, oldVal) => {
  if (!initialized) {
    initialized = true

    return // ilk render’da tetiklemeyi atla
  }

  if (newVal && newVal !== oldVal) {
    try {
      const response = await axios.put(`/institution/active-institution/${newVal}/${associationData.value.id}`)
      if (response.status >= 200 && response.status < 300) {
        window.location.reload()
      } else {
        console.error("Aktif kurum güncellenemedi")
      }
    } catch (error) {
      console.error("Backend güncelleme hatası:", error)
    }
  }
})


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
import AppSelect from "@core/components/app-form-elements/AppSelect.vue"
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

        <div class="flex-grow-1 d-flex justify-center">
          <div style="max-width: 300px; width: 100%;">
            <AppSelect
              v-model="institution"
              :items="institutions"
              item-title="label"
              item-value="value"
            />
          </div>
        </div>

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
