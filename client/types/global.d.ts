import Sidebar from '@/components/Sidebar.vue'
import SearchLayer from '@/components/layers/SearchLayer.vue'
import ScoreTable from '@/components/ScoreTable.vue'

declare module 'vue/types/vue' {
  interface Vue {
    $sidebar: Sidebar
    $searchLayer: SearchLayer
    $scoreTable: ScoreTable|undefined
  }
}
