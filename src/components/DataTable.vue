<template>
  <div class="data-container">
    <!-- 头部 -->
    <div class="data-header">
      <span class="header-title">// DATA_MATRIX_v2.0</span>
      <button @click="showAddModal = true" class="add-btn">
        <span class="btn-text">[+ADD_RECORD]</span>
      </button>
    </div>

    <!-- 表格 -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>ROLE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id" :class="{ editing: editingId === item.id }">
            <template v-if="editingId === item.id">
              <td>{{ item.id }}</td>
              <td><input v-model="editForm.name" class="edit-input" /></td>
              <td><input v-model="editForm.role" class="edit-input" /></td>
              <td>
                <select v-model="editForm.status" class="edit-select">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </td>
              <td class="actions">
                <button @click="saveEdit" class="action-btn save">[SAVE]</button>
                <button @click="cancelEdit" class="action-btn cancel">[CANCEL]</button>
              </td>
            </template>
            <template v-else>
              <td class="id-cell">{{ String(item.id).padStart(3, '0') }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.role }}</td>
              <td>
                <span :class="['status-badge', item.status.toLowerCase()]">
                  {{ item.status }}
                </span>
              </td>
              <td class="actions">
                <button @click="startEdit(item)" class="action-btn edit">[EDIT]</button>
                <button @click="deleteItem(item.id)" class="action-btn delete">[DEL]</button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 底部状态 -->
    <div class="footer">
      <span class="status">
        <span class="blink">●</span> TOTAL_RECORDS: {{ data.length }}
      </span>
      <span class="status">
        ACTIVE: {{ activeCount }} | INACTIVE: {{ inactiveCount }}
      </span>
    </div>

    <!-- 添加弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <span>// NEW_RECORD_ENTRY</span>
          <button @click="showAddModal = false" class="close-btn">[X]</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>NAME:</label>
            <input v-model="newForm.name" class="form-input" placeholder="Enter name..." />
          </div>
          <div class="form-group">
            <label>ROLE:</label>
            <input v-model="newForm.role" class="form-input" placeholder="Enter role..." />
          </div>
          <div class="form-group">
            <label>STATUS:</label>
            <select v-model="newForm.status" class="form-select">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddModal = false" class="modal-btn cancel">[CANCEL]</button>
          <button @click="addRecord" class="modal-btn confirm">[CONFIRM]</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// Mock 数据
const mockData = [
  { id: 1, name: 'Cipher', role: 'NetRunner', status: 'ACTIVE' },
  { id: 2, name: 'Neon', role: 'SysAdmin', status: 'ACTIVE' },
  { id: 3, name: 'Glitch', role: 'Hacker', status: 'PENDING' },
  { id: 4, name: 'Phantom', role: 'Operative', status: 'INACTIVE' },
  { id: 5, name: 'Vortex', role: 'Developer', status: 'ACTIVE' }
]

const data = ref([...mockData])
const editingId = ref(null)
const showAddModal = ref(false)

const editForm = reactive({
  name: '',
  role: '',
  status: 'ACTIVE'
})

const newForm = reactive({
  name: '',
  role: '',
  status: 'ACTIVE'
})

let nextId = 6

const activeCount = computed(() => {
  return data.value.filter(item => item.status === 'ACTIVE').length
})

const inactiveCount = computed(() => {
  return data.value.filter(item => item.status === 'INACTIVE').length
})

const startEdit = (item) => {
  editingId.value = item.id
  editForm.name = item.name
  editForm.role = item.role
  editForm.status = item.status
}

const saveEdit = () => {
  const index = data.value.findIndex(item => item.id === editingId.value)
  if (index !== -1) {
    data.value[index] = {
      ...data.value[index],
      name: editForm.name,
      role: editForm.role,
      status: editForm.status
    }
  }
  editingId.value = null
}

const cancelEdit = () => {
  editingId.value = null
}

const deleteItem = (id) => {
  data.value = data.value.filter(item => item.id !== id)
}

const addRecord = () => {
  if (newForm.name.trim() && newForm.role.trim()) {
    data.value.push({
      id: nextId++,
      name: newForm.name.trim(),
      role: newForm.role.trim(),
      status: newForm.status
    })
    newForm.name = ''
    newForm.role = ''
    newForm.status = 'ACTIVE'
    showAddModal.value = false
  }
}
</script>

<style scoped>
.data-container {
  background: rgba(10, 20, 30, 0.9);
  border: 1px solid #ff00ff;
  border-radius: 0;
  padding: 20px;
  margin-top: 30px;
  box-shadow:
    0 0 20px rgba(255, 0, 255, 0.3),
    inset 0 0 60px rgba(255, 0, 255, 0.05);
  position: relative;
}

/* 角落装饰 - 紫色主题 */
.data-container::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 20px;
  height: 20px;
  border-top: 2px solid #ff00ff;
  border-left: 2px solid #ff00ff;
}

.data-container::after {
  content: '';
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 20px;
  height: 20px;
  border-bottom: 2px solid #ff00ff;
  border-right: 2px solid #ff00ff;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 0, 255, 0.3);
}

.header-title {
  color: #ff00ff;
  font-size: 14px;
  text-shadow: 0 0 10px #ff00ff;
  letter-spacing: 2px;
}

.add-btn {
  padding: 8px 16px;
  background: transparent;
  color: #ff00ff;
  border: 1px solid #ff00ff;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-btn:hover {
  background: rgba(255, 0, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
}

.btn-text {
  text-shadow: 0 0 5px #ff00ff;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead {
  background: rgba(255, 0, 255, 0.1);
}

.data-table th {
  padding: 12px 10px;
  text-align: left;
  color: #ff00ff;
  font-weight: normal;
  border-bottom: 1px solid rgba(255, 0, 255, 0.3);
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
  letter-spacing: 1px;
}

.data-table tbody tr {
  border-bottom: 1px solid rgba(255, 0, 255, 0.15);
  transition: all 0.3s;
}

.data-table tbody tr:hover {
  background: rgba(255, 0, 255, 0.1);
}

.data-table tbody tr.editing {
  background: rgba(255, 0, 255, 0.15);
}

.data-table td {
  padding: 12px 10px;
  color: #00ffff;
}

.id-cell {
  color: #00ff88;
  text-shadow: 0 0 5px #00ff88;
}

.status-badge {
  padding: 3px 10px;
  font-size: 10px;
  letter-spacing: 1px;
  text-shadow: 0 0 5px currentColor;
}

.status-badge.active {
  color: #00ff88;
  border: 1px solid #00ff88;
  background: rgba(0, 255, 136, 0.1);
}

.status-badge.inactive {
  color: #ff3366;
  border: 1px solid #ff3366;
  background: rgba(255, 51, 102, 0.1);
}

.status-badge.pending {
  color: #ffaa00;
  border: 1px solid #ffaa00;
  background: rgba(255, 170, 0, 0.1);
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: none;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 10px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.edit {
  color: #00ffff;
  text-shadow: 0 0 5px #00ffff;
}

.action-btn.edit:hover {
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
}

.action-btn.delete {
  color: #ff3366;
  text-shadow: 0 0 5px #ff3366;
}

.action-btn.delete:hover {
  color: #ff6699;
  text-shadow: 0 0 10px #ff3366;
}

.action-btn.save {
  color: #00ff88;
  text-shadow: 0 0 5px #00ff88;
}

.action-btn.save:hover {
  color: #00ff88;
  text-shadow: 0 0 10px #00ff88;
}

.action-btn.cancel {
  color: #ffaa00;
  text-shadow: 0 0 5px #ffaa00;
}

.action-btn.cancel:hover {
  color: #ffcc00;
  text-shadow: 0 0 10px #ffaa00;
}

.edit-input {
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 0, 255, 0.3);
  color: #ff00ff;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 12px;
  outline: none;
  width: 100%;
}

.edit-input:focus {
  border-color: #ff00ff;
  box-shadow: 0 0 8px rgba(255, 0, 255, 0.4);
}

.edit-select {
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 0, 255, 0.3);
  color: #ff00ff;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 12px;
  outline: none;
  cursor: pointer;
}

.edit-select:focus {
  border-color: #ff00ff;
  box-shadow: 0 0 8px rgba(255, 0, 255, 0.4);
}

.edit-select option {
  background: #0a141e;
  color: #ff00ff;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 0, 255, 0.3);
  font-size: 11px;
}

.footer .status {
  color: #ff00ff;
  text-shadow: 0 0 5px #ff00ff;
}

.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: rgba(10, 20, 30, 0.95);
  border: 1px solid #ff00ff;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.4);
  width: 90%;
  max-width: 400px;
}

.modal::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 15px;
  height: 15px;
  border-top: 2px solid #ff00ff;
  border-left: 2px solid #ff00ff;
}

.modal::after {
  content: '';
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 15px;
  height: 15px;
  border-bottom: 2px solid #ff00ff;
  border-right: 2px solid #ff00ff;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 0, 255, 0.3);
  color: #ff00ff;
  font-size: 12px;
  letter-spacing: 1px;
}

.close-btn {
  background: transparent;
  border: 1px solid #ff3366;
  color: #ff3366;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 11px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 51, 102, 0.2);
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #ff00ff;
  font-size: 11px;
  margin-bottom: 8px;
  text-shadow: 0 0 5px #ff00ff;
  letter-spacing: 1px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 0, 255, 0.3);
  color: #ff00ff;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  outline: none;
}

.form-input::placeholder {
  color: rgba(255, 0, 255, 0.4);
}

.form-input:focus,
.form-select:focus {
  border-color: #ff00ff;
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.4);
}

.form-select option {
  background: #0a141e;
  color: #ff00ff;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 0, 255, 0.3);
}

.modal-btn {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-btn.cancel {
  border-color: #666;
  color: #666;
}

.modal-btn.cancel:hover {
  background: rgba(102, 102, 102, 0.2);
}

.modal-btn.confirm {
  border-color: #00ff88;
  color: #00ff88;
  text-shadow: 0 0 5px #00ff88;
}

.modal-btn.confirm:hover {
  background: rgba(0, 255, 136, 0.2);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
}
</style>
