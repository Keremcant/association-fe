<template>
  <VRow class="match-height">
    <!-- 👉 Congratulation John -->
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <DashboardCongratulations />
    </VCol>

    <!-- 👉 Ecommerce Transition -->
    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <DashboardStatistics class="h-100" />
    </VCol>

    <VCol
      cols="12"
      lg="4"
    >
      <VRow>
        <!-- 👉 Total Profit Line -->
        <VCol
          cols="12"
          lg="6"
          md="3"
          sm="6"
        >
          <EcommerceTotalProfitLineCharts />
        </VCol>

        <!-- 👉 Expenses Radial Bar Charts -->
        <VCol
          cols="12"
          lg="6"
          md="3"
          sm="6"
        >
          <EcommerceExpensesRadialBarCharts />
        </VCol>

        <!-- 👉 Generated Leads -->
        <VCol
          cols="12"
          md="6"
          lg="12"
        >
          <EcommerceGeneratedLeads />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Revenue Report -->
    <VCol
      cols="12"
      lg="8"
    >
      <EcommerceRevenueReport />
    </VCol>

    <!-- 👉 Earning Reports -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceEarningReports />
    </VCol>

    <!-- 👉 Popular Products -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommercePopularProducts />
    </VCol>

    <!-- 👉 Order -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceOrder />
    </VCol>

    <!-- 👉 Transaction -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceTransactions />
    </VCol>

    <!-- 👉 Invoice Table -->
    <!--
      <VCol
      cols="12"
      lg="8"
      >
      <EcommerceInvoiceTable />
      </VCol>
    -->
  </VRow>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

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
import Dashboard from "@/pages/dashboard/dashboard.vue"

//import EcommerceInvoiceTable from '@/views/dashboard/ecommerce/EcommerceInvoiceTable.vue'

const { t } = useI18n()
</script>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
