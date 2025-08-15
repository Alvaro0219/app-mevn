<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h5">LISTA DE USUARIOS</div>
      <q-btn label="Registrar usuario" @click="$router.push('/usuarios/registrar')" class="btn-registrar" />
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
            <q-btn dense flat icon="delete" color="negative"
              @click="deleteUser(props.row._id)" />
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
import { onMounted } from 'vue';
import useUsers from 'src/composables/useUsers.js';

const { users, loading, error, fetchUsers, deleteUser } = useUsers();

const columns = [
  { name: 'username', label: 'Usuario', field: 'username', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'role', label: 'Rol', field: 'role', align: 'left', sortable: true },
  { name: 'isActive', label: 'Activo', field: row => row.isActive ? 'Sí' : 'No', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }
];

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.btn-registrar {
  background-color: #6c5ce71f;
  color: #6c5ce7;
}
</style>
