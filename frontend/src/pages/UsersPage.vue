<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <h4 class="text-h4 q-my-none">Gestión de Usuarios</h4>
      <q-btn label="Registrar Usuario" :to="{ name: 'usuarios-registrar' }" outline color="primary" no-caps icon="add"/>
    </div>

    <q-card>
      <q-table
        :rows="users"
        :columns="columns"
        row-key="_id"
        :loading="loading"
        flat
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense flat icon="edit" color="primary" class="q-mr-sm"
              :to="{ name: 'usuarios-editar', params: { id: props.row._id } }" />
            <q-btn dense flat icon="delete" color="primary"
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

    <div v-if="error" class="text-negative q-mt-md">
      {{ error }}
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import useUsers from 'src/composables/useUsers.js'

const $q = useQuasar()
const { users, loading, error, fetchUsers, deleteUser } = useUsers()

const columns = [
  { name: 'username', label: 'Usuario', field: 'username', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'role', label: 'Rol', field: 'role', align: 'left', sortable: true },
  { name: 'isActive', label: 'Activo', field: row => row.isActive ? 'Sí' : 'No', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

onMounted(() => {
  fetchUsers()
})

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
