<template>
  <VLayout class="fleet-app-layout">
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      width="360"
      absolute
      touchless
      location="start"
      border="none"
    >
      <VCard
        class="h-100 fleet-navigation-drawer"
        flat
      >
        <VCardItem>
          <VCardTitle>
            Fleet
          </VCardTitle>

          <template #append>
            <IconBtn
              class="d-lg-none navigation-close-btn"
              @click="isLeftSidebarOpen = !isLeftSidebarOpen"
            >
              <VIcon icon="tabler-x" />
            </IconBtn>
          </template>
        </VCardItem>

        <!-- 👉 Perfect Scrollbar -->
        <PerfectScrollbar
          :options="{ wheelPropagation: false, suppressScrollX: true }"
          style="block-size: calc(100% - 60px);"
        >
          <VCardText class="pt-0">
            <div
              v-for="(vehicle, index) in vehicleTrackingData"
              :key="index"
              class="mb-6"
            >
              <div
                class="d-flex align-center justify-space-between cursor-pointer"
                @click="flyToLocation(geojson.features[index].geometry.coordinates, index)"
              >
                <div class="d-flex gap-x-4 align-center">
                  <VAvatar
                    icon="tabler-car"
                    variant="tonal"
                    color="secondary"
                  />
                  <div>
                    <div class="text-body-1 text-high-emphasis">
                      {{ vehicle.name }}
                    </div>
                    <div class="text-body-1">
                      {{ vehicle.location }}
                    </div>
                  </div>
                </div>
                <IconBtn size="small">
                  <VIcon
                    :icon="showPanel[index] ? 'tabler-chevron-down' : $vuetify.locale.isRtl ? 'tabler-chevron-left' : 'tabler-chevron-right'"
                    class="text-high-emphasis"
                  />
                </IconBtn>
              </div>
              <VExpandTransition mode="out-in">
                <div v-show="showPanel[index]">
                  <div class="py-8">
                    <div class="d-flex justify-space-between mb-1">
                      <span class="text-body-1 text-high-emphasis">Delivery Process</span>
                      <span class="text-body-1">{{ vehicle.progress }}%</span>
                    </div>
                    <VProgressLinear
                      :model-value="vehicle.progress"
                      color="primary"
                      rounded
                      height="6"
                    />
                  </div>
                  <div>
                    <VTimeline
                      align="start"
                      truncate-line="both"
                      side="end"
                      density="compact"
                      line-thickness="1"
                      line-inset="6"
                      class="ps-2 v-timeline--variant-outlined fleet-timeline"
                    >
                      <VTimelineItem
                        icon="tabler-circle-check"
                        dot-color="rgb(var(--v-theme-surface))"
                        icon-color="success"
                        fill-dot
                        size="20"
                        :elevation="0"
                      >
                        <div class="ps-1">
                          <div class="text-caption text-success">
                            TRACKING NUMBER CREATED
                          </div>
                          <div class="app-timeline-title">
                            {{ vehicle.driverName }}
                          </div>
                          <div class="text-body-2">
                            Sep 01, 7:53 AM
                          </div>
                        </div>
                      </VTimelineItem>
                    </VTimeline>
                  </div>
                </div>
              </VExpandTransition>
            </div>
          </VCardText>
        </PerfectScrollbar>
      </VCard>
    </VNavigationDrawer>

    <VMain>
      <div class="h-100">
        <IconBtn
          class="d-lg-none navigation-toggle-btn rounded-sm"
          variant="elevated"
          @click="isLeftSidebarOpen = true"
        >
          <VIcon icon="tabler-menu-2" />
        </IconBtn>
        <!-- 👉 Fleet map  -->
        <div
          id="mapContainer"
          class="basemap"
        />

        <img
          v-for="(car, index) in carImgs"
          :key="index"
          ref="refCars"
          :src="car"
          alt="car Img marker"
          height="42"
          width="20"
        >
      </div>
    </VMain>
  </VLayout>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import { onMounted, ref, onBeforeMount, watch } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'
import fleetImg from '@images/misc/fleet-car.png'
import axios from "@/plugins/axios"
import { DOMParser } from 'xmldom'
import { kml } from '@tmcw/togeojson'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()
const accessToken = 'pk.eyJ1Ijoia2lsbGFoYjMwOCIsImEiOiJja2N0OXBodnYxZWJtMnFtMWgyd2s0N3IyIn0.9OkpMRpB46NefsfttnkYLA'
const map = ref()
const vuetifyDisplay = useDisplay()

const geojson = ref(null)
const refCars = ref([])
const activeIndex = ref(0)
const showPanel = ref([true, false, false, false])

const vehicleTrackingData = [
  { name: 'SANNY-1', location: 'HEREKE', progress: 88, driverName: 'Kerem Can Turgut' },
  { name: 'SANNY-2', location: 'HEREKE', progress: 100, driverName: 'Volkan Tercan' },
  { name: 'SANNY-3', location: 'HEREKE', progress: 60, driverName: 'Ahmet Erdoğan' },
  { name: 'SANNY-4', location: 'HEREKE', progress: 28, driverName: 'Hakkı Şimşek' },
]

const carImgs = ref([fleetImg, fleetImg, fleetImg, fleetImg])

definePage({ meta: { layoutWrapperClasses: 'layout-content-height-fixed' } })

// KML → GeoJSON
onBeforeMount(async () => {
  const response = await axios.get("/maps/get-active")
  const kmlText = atob(response.data.data)
  const parser = new DOMParser()
  const kmlDom = parser.parseFromString(kmlText, 'text/xml')

  geojson.value = kml(kmlDom)
  console.log(geojson.value)
})

// Harita ve marker oluşturma
onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  mapboxgl.accessToken = accessToken
  map.value = new mapboxgl.Map({
    container: 'mapContainer',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [29.600454, 40.782905],
    zoom: 16,

    //minZoom: 14,   // en düşük zoom
    //maxZoom: 18,    // en yüksek zoom
  })

  const Draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,   // çokgen çizme
      trash: true,      // silme
    },
  })

  map.value.addControl(Draw)

  map.value.on('draw.create', e => {
    const coords = e.features[0].geometry.coordinates

    console.log(coords)
  })

/*
  // Sadece Point verilerini al
  const points = geojson.value.features.filter(f => f.geometry.type === 'Point')

  points.forEach((feature, index) => {
    new mapboxgl.Marker({ element: refCars.value[index] })
      .setLngLat(feature.geometry.coordinates)
      .addTo(map.value)
  })

  refCars.value[activeIndex.value].classList.add('marker-focus')
  const lines = geojson.value.features.filter(f => f.geometry.type === 'LineString')

  lines.forEach(line => {
    map.value.on('load', () => {
      map.value.addSource('route-' + line.properties.name, {
        type: 'geojson',
        data: line,
      })
      map.value.addLayer({
        id: 'route-' + line.properties.name,
        type: 'line',
        source: 'route-' + line.properties.name,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#FF0000', 'line-width': 3 },
      })
    })
  })
 */
})

// Sidebar'da araca tıklayınca haritaya git
const flyToLocation = (geolocation, index) => {
  activeIndex.value = index
  showPanel.value.fill(false)
  showPanel.value[index] = !showPanel.value[index]
  if (vuetifyDisplay.mdAndDown.value) isLeftSidebarOpen.value = false
  map.value.flyTo({ center: geolocation, zoom: 16 })
}

// Marker focus toggle
watch(activeIndex, () => {
  refCars.value.forEach((car, index) => {
    if (index === activeIndex.value)
      car.classList.add('marker-focus')
    else
      car.classList.remove('marker-focus')
  })
})
</script>

<style lang="scss">
@use "@styles/variables/vuetify.scss";
@use "@core/scss/base/mixins.scss";
@import "mapbox-gl/dist/mapbox-gl.css";

.fleet-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-fleet-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-fleet-app-layout);
    }
  }
}

.navigation-toggle-btn {
  position: absolute;
  z-index: 1;
  inset-block-start: 1rem;
  inset-inline-start: 1rem;
}

.navigation-close-btn {
  position: absolute;
  z-index: 1;
  inset-block-start: 1rem;
  inset-inline-end: 1rem;
}

.basemap {
  block-size: 100%;
  inline-size: 100%;
}

.marker-focus {
  filter: drop-shadow(0 0 7px rgb(var(--v-theme-primary)));
}

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right {
  display: none;
}

.fleet-navigation-drawer {
  .v-timeline .v-timeline-divider__dot .v-timeline-divider__inner-dot {
    box-shadow: none;
  }
}

.fleet-timeline {
  &.v-timeline .v-timeline-item:not(:last-child) {
    .v-timeline-item__body {
      margin-block-end: 0.25rem;
    }
  }
}

/* stylelint-disable-next-line selector-id-pattern */
#mapContainer {
  block-size: 100vh !important;
}
</style>
