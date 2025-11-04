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
import AppSelect from "@core/components/app-form-elements/AppSelect.vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
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
</script>

<template>
  <HorizontalNavLayout :nav-items="menu">
    <!-- 👉 navbar -->
    <template #navbar>
      <div class="d-flex align-center w-100 position-relative">
        <!-- Sol: Logo -->
        <div class="d-flex align-center">
          <RouterLink
            to="/"
            class="app-logo d-flex align-center gap-x-3"
          >
            <VNodeRenderer :nodes="themeConfig.app.logo" />
            <h1 class="app-title font-weight-bold leading-normal text-xl text-capitalize">
              {{ themeConfig.app.title }}
            </h1>
          </RouterLink>
        </div>

        <!-- Ortada: Dropdown -->
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

        <!-- Sağ: Tema + Profil + Dil -->
        <div class="d-flex align-center gap-x-2">
          <NavBarI18n
            v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
            :languages="themeConfig.app.i18n.langConfig"
          />
          <NavbarThemeSwitcher />
          <UserProfile />
        </div>
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
  </HorizontalNavLayout>
</template>
