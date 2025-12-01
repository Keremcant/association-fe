<template>
  <VRow class="match-height">
    <!-- 👉 Congratulations -->
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <DashboardCongratulations :data="dashboardData" />
    </VCol>

    <!-- 👉 Statistics -->
    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <DashboardStatistics
        class="h-100"
        :data="dashboardData"
      />
    </VCol>

    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommercePopularProducts :data="dashboardData" />
    </VCol>
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <DashboardAwarenessDays :data="dashboardData" />
    </VCol>
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <DashboardAnnouncements :data="dashboardData" />
    </VCol>
  </VRow>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from '@/plugins/axios.js'

// Import Components
import DashboardCongratulations from '@/views/dashboard/DashboardCongratulations.vue'
import DashboardStatistics from '@/views/dashboard/DashboardStatistics.vue'
import EcommerceEarningReports from '@/views/dashboard/ecommerce/EcommerceEarningReports.vue'
import EcommerceExpensesRadialBarCharts from '@/views/dashboard/ecommerce/EcommerceExpensesRadialBarCharts.vue'
import EcommerceGeneratedLeads from '@/views/dashboard/ecommerce/EcommerceGeneratedLeads.vue'
import EcommerceOrder from '@/views/dashboard/ecommerce/EcommerceOrder.vue'
import EcommercePopularProducts from '@/views/dashboard/ecommerce/EcommercePopularProducts.vue'
import EcommerceRevenueReport from '@/views/dashboard/ecommerce/EcommerceRevenueReport.vue'
import EcommerceTotalProfitLineCharts from '@/views/dashboard/ecommerce/EcommerceTotalProfitLineCharts.vue'
import EcommerceTransactions from '@/views/dashboard/ecommerce/EcommerceTransactions.vue'
import DashboardAwarenessDays from "@/views/dashboard/ecommerce/DashboardAwarenessDays.vue"
import DashboardAnnouncements from "@/views/dashboard/ecommerce/DashboardAnnouncements.vue"

const { t } = useI18n()

const dashboardData = ref(null)
const snackbar = ref({ show: (msg, type) => console.log(msg, type) }) // örnek snackbar

onBeforeMount(async () => {
  try {
    const response = await axios.get('/dashboard/get-user-dashboard')
    if (response.status >= 200 && response.status < 300) {
      dashboardData.value = response.data
    } else {
      snackbar.value.show(t('Failed to load dashboard data'), 'error')
    }
  } catch (error) {
    console.error(error)
    snackbar.value.show(t('Failed to load dashboard data'), 'error')
  }
})
</script>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
