<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useI18n } from 'vue-i18n'
import { useCookie } from '@/@core/composable/useCookie'
// eslint-disable-next-line import/extensions
import { useAbility } from "@/plugins/casl/composables/useAbility.js"

definePage({ meta: { layout: 'blank', unauthenticatedOnly: false } })

const router = useRouter()
const ability = useAbility()
const { t } = useI18n()

// TODO: Get type from backend
const userData = useCookie('associationData')

const permissionData=useCookie('permission')


const logout = async () => {

  // Remove "accessToken" from cookie
  useCookie('associationToken').value = null

  // Remove "userData" from cookie
  userData.value = null

  useCookie('permission').value=null

  permissionData.value=null


  // Redirect to login page
  await router.push('/login')

  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page

  // Remove "userAbilities" from cookie7
  useCookie('associationAbilityRules').value = null

  // Reset ability to initial ability
  ability.update([])


}

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'tabler-user',
    title: t('Profile'),
    to: '/profile',
  },
  {
    type: 'navItem',
    icon: 'tabler-settings',
    title: t('Company'),
    to: '/company',
  },
]
</script>

<template>
  <VBadge
    v-if="userData"
    dot
    bordered
    location="bottom right"
    offset-x="1"
    offset-y="2"
    color="success"
  >
    <VAvatar
      size="38"
      class="cursor-pointer"
      :color="!(userData && userData.avatar) ? 'primary' : undefined"
      :variant="!(userData && userData.avatar) ? 'tonal' : undefined"
    >
      <VIcon icon="tabler-user-square" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="240"
        location="bottom end"
        offset="12px"
      >
        <VList>
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  <VAvatar
                    :color="!(userData && userData.avatar) ? 'primary' : undefined"
                    :variant="!(userData && userData.avatar) ? 'tonal' : undefined"
                  >
                    <VIcon icon="tabler-user-square" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ userData.fullName || userData.username }}
            </VListItemTitle>
            <VListItemSubtitle>{{ userData.role.name }}</VListItemSubtitle>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                v-if="item.type === 'navItem'"
                :to="item.to"
              >
                <template #prepend>
                  <VIcon
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template
                  v-if="item.badgeProps"
                  #append
                >
                  <VBadge
                    rounded="sm"
                    class="me-3"
                    v-bind="item.badgeProps"
                  />
                </template>
              </VListItem>

              <VDivider
                v-else
                class="my-2"
              />
            </template>

            <div class="px-4 py-2">
              <VBtn
                block
                size="small"
                color="error"
                append-icon="tabler-logout"
                @click="logout"
              >
                {{ $t('Logout') }}
              </VBtn>
            </div>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
