import SearchLayer from '@/components/layers/SearchLayer.vue'

declare module 'vue/types/vue' {
  interface Vue {
    $searchLayer: SearchLayer
  }
}
