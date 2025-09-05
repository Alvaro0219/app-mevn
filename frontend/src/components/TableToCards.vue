<template>
  <div class="table-cards-list">
    <q-card v-for="(row, idx) in rows" :key="row[rowKey] || idx" class="table-card q-mb-md">
      <q-card-section>
        <div v-for="col in columns" :key="col.name" class="table-card-row">
          <div class="table-card-label">{{ col.label }}</div>
          <div class="table-card-value">
            <slot :name="`cell-${col.name}`" :row="row" :col="col">
              {{ typeof col.field === 'function' ? col.field(row) : row[col.field] }}
            </slot>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <slot name="actions" :row="row" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
// Props: rows (array), columns (array), rowKey (string)
defineProps({
  rows: Array,
  columns: Array,
  rowKey: {
    type: String,
    default: '_id'
  }
})
</script>

<style scoped lang="scss">
.table-cards-list {
  display: flex;
  flex-direction: column;
}
.table-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  background: $card;
  border: 1px solid $border;
}
.table-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.table-card-label {
  font-weight: 600;
  color: $muted-foreground;
}
.table-card-value {
  color: $foreground;
  font-weight: 500;
}
</style>
