<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <h4 class="text-h4 q-my-none">Gestión de Usuarios</h4>
      <q-btn label="Registrar Usuario" :to="{ name: 'usuarios-registrar' }" outline color="primary" no-caps icon="add"/>
    </div>

    <q-card v-if="!isMobile">
      <q-table
        :rows="users"
        :columns="columns"
        row-key="_id"
        :loading="loading"
        flat
      >
        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <span :class="['role-badge', props.row.role]">
              {{ props.row.role === 'admin' ? 'Administrador' : 'Usuario' }}
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-isActive="props">
          <q-td :props="props">
            <span :class="['status-badge', props.row.isActive ? 'active' : 'inactive']">
              {{ props.row.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense flat icon="edit" color="primary" class="q-mr-sm"
              :to="{ name: 'usuarios-editar', params: { id: props.row._id } }" />
            <q-btn dense flat icon="delete" color="negative" 
              @click="confirmAndDelete(props.row._id)" />
          </q-td>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing>
            <q-spinner color="primary" size="50px" />
          </q-inner-loading>
        </template>
      </q-table>
    </q-card>

    <TableToCards v-else :rows="users" :columns="columns" rowKey="_id">
      <template #cell-role="{ row }">
        <span :class="['role-badge', row.role]">
          {{ row.role === 'admin' ? 'Administrador' : 'Usuario' }}
        </span>
      </template>
      <template #cell-isActive="{ row }">
        <span :class="['status-badge', row.isActive ? 'active' : 'inactive']">
          {{ row.isActive ? 'Activo' : 'Inactivo' }}
        </span>
      </template>
      <template #actions="{ row }">
        <q-btn dense flat icon="edit" color="primary" class="q-mr-sm"
          :to="{ name: 'usuarios-editar', params: { id: row._id } }" />
        <q-btn dense flat icon="delete" color="negative" 
          @click="confirmAndDelete(row._id)" />
      </template>
    </TableToCards>

    <div v-if="error" class="text-negative q-mt-md">
      {{ error }}
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import useUsers from 'src/composables/useUsers.js'
import TableToCards from 'src/components/TableToCards.vue'

const $q = useQuasar()
const { users, loading, error, fetchUsers, deleteUser } = useUsers()
const isMobile = ref(false)

const columns = [
  { name: 'username', label: 'Usuario', field: 'username', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'role', label: 'Rol', field: 'role', align: 'left', sortable: true },
  { name: 'isActive', label: 'Estado', field: row => row.isActive ? 'Sí' : 'No', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

onMounted(() => {
  fetchUsers()
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 600
}

// Confirmacion de eliminacion de usuario
const confirmAndDelete = (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Eliminar este usuario?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deleteUser(id)
      $q.notify({ type: 'positive', message: 'Usuario eliminado' })
    } catch (e) {
      $q.notify({ type: 'negative', message: error.value || e.message || 'Error eliminando' })
    }
  })
}
</script>

<style scoped lang="scss">
// Badge para estado
.status-badge {
  display: inline-block;
  padding: 0.25em 0.7em;
  border-radius: 8px;
  font-size: 0.85em;
  font-weight: 600;
  &.active {
    background: $primary;
    color: #fff;
  }
  &.inactive {
    background: $secondary;
    color: #fff;
  }
  &.pending {
    background: $accent;
    color: #fff;
  }
}

// Badge para rol
.role-badge {
  display: inline-block;
  padding: 0.25em 0.7em;
  border-radius: 8px;
  font-size: 0.85em;
  font-weight: 600;
  &.admin {
    background: #2563eb; // celeste oscuro
    color: #fff;
  }
  &.user {
    background: #60a5fa; // celeste claro
    color: #fff;
  }
}

// Botones de acción
.q-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  &.q-mr-sm {
    margin-right: 0.5rem;
  }
  &[color="primary"] {
    background: linear-gradient(90deg, $primary 0%, $secondary 100%);
    color: #fff;
    border: none;
    &:hover {
      filter: brightness(1.1);
    }
  }
  &[color="secondary"] {
    background: $accent;
    color: #fff;
    border: none;
    &:hover {
      filter: brightness(1.1);
    }
  }
  &[color="negative"] {
    background: $destructive;
    color: #fff;
    border: none;
    &:hover {
      filter: brightness(1.1);
    }
  }
}

.text-negative {
  color: $destructive;
  font-weight: 600;
}

.q-inner-loading {
  background: rgba($primary, 0.08);
}

// Responsive
@media (max-width: 600px) {
  .q-card {
    border-radius: 8px;
  }
  .q-table {
    th, td {
      font-size: 0.92rem;
      padding: 8px 4px;
    }
  }
}
</style>
