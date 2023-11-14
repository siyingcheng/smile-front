<script setup async lang="ts">
import { useUserStore } from '@/stores/UserStore'
import type { IdType, UserAddressType } from '@/types'
import { InfoFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()

userStore.getAddressList(userStore.loginUser?.id as number)

// Create Address
const createAddressVisible = ref(false)
const newAddressFormRef = ref<FormInstance>()
const newAddressForm = reactive<UserAddressType>({} as UserAddressType)
const validatePhone = (form: UserAddressType) => {
  return (rule: any, value: any, callback: any) => {
    if (!/^1[0-9]{10}/.test(form.phone)) {
      callback(new Error('Cell phone format invalid'))
    }
    callback()
  }
}
const addressRules = (form: UserAddressType) => {
  return ref<FormRules<UserAddressType>>({
    fullAddress: [
      { required: true, message: 'Full address is required.', trigger: 'blur' },
    ],
    phone: [
      {
        required: true,
        message: 'Cell phone number is required.',
        trigger: 'blur',
      },
      {
        validator: validatePhone(form),
        message: 'Cell phone number format invalid',
        trigger: 'blur',
      },
    ],
  })
}
const newAddressRules = addressRules(newAddressForm)
const doCreateAddress = async () => {
  await newAddressFormRef.value?.validate().then(async () => {
    await userStore
      .createAddress(newAddressForm)
      .then(() => {
        ElNotification({
          type: 'success',
          message: 'Successfully save new address',
        })
        newAddressForm.fullAddress = ''
        newAddressForm.phone = ''
        newAddressForm.isDefault = false
        createAddressVisible.value = false
      })
      .catch((error) =>
        ElMessage({
          type: 'error',
          message:
            error.response?.data?.message ||
            'The creation of a new address failed.',
        }),
      )
  })
}

// Edit address
const editAddressFormRef = ref<FormInstance>()
const editAddressForm = reactive<UserAddressType>({} as UserAddressType)
const editAddressVisible = ref(false)
const editAddressRules = addressRules(editAddressForm)
const openEditModal = (data: UserAddressType) => {
  Object.assign(editAddressForm, data)
  editAddressVisible.value = true
}
const doEditAddress = async () => {
  await editAddressFormRef.value?.validate().then(
    async () =>
      await userStore
        .updateAddress(editAddressForm.id as number, editAddressForm)
        .then(() => {
          ElNotification({
            type: 'success',
            message: 'Successfully update the address',
          })
          editAddressVisible.value = false
        })
        .catch((error) =>
          ElMessage({
            type: 'error',
            message:
              error.response?.data?.message ||
              'The update of the address has failed',
          }),
        ),
  )
}

// Delete address
const confirmDelete = async (id: IdType) => {
  await userStore
    .deleteAddress(id)
    .then(() =>
      ElNotification({
        type: 'success',
        message: 'Successfully delete the address',
      }),
    )
    .catch(() =>
      ElMessage({
        type: 'error',
        message: 'The deletion of address failed',
      }),
    )
}
</script>

<template>
  <el-row>
    <el-col :lg="16">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-button
              class="button"
              type="primary"
              @click="createAddressVisible = true"
              >Add Address</el-button
            >
          </div>
        </template>

        <el-table :data="userStore.addressList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="fullAddress" label="Full Address" />
          <el-table-column prop="phone" label="Phone" width="120" />
          <el-table-column
            prop="isDefault"
            label="Default"
            width="100"
            align="center"
          >
            <template #default="scop">
              <el-icon v-if="scop.row.isDefault"><IEpStarFilled /></el-icon>
              <el-icon v-else></el-icon>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Operations"
            width="150"
            align="center"
          >
            <template #default="scop">
              <el-button
                link
                type="primary"
                size="small"
                @click="openEditModal(scop.row)"
              >
                Edit
              </el-button>
              <el-popconfirm
                width="220"
                confirm-button-text="OK"
                cancel-button-text="No, Thanks"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="Are you sure to delete this?"
                @confirm="confirmDelete(scop.row.id)"
              >
                <template #reference>
                  <el-button link type="danger" size="small">Delete</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- Create Address Dialog -->
        <el-dialog v-model="createAddressVisible" center width="520">
          <template #header>
            <h2>Add new Address</h2>
          </template>
          <el-form
            :model="newAddressForm"
            label-width="140px"
            label-position="left"
            :rules="newAddressRules"
            ref="newAddressFormRef"
          >
            <el-form-item label="Full Address" prop="fullAddress">
              <el-input
                v-model="newAddressForm.fullAddress"
                type="textarea"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="Cell Phone Number" prop="phone">
              <el-input v-model="newAddressForm.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Is Default Address" prop="isDefault">
              <el-checkbox v-model="newAddressForm.isDefault" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="createAddressVisible = false"
                >Cancel</el-button
              >
              <el-button type="primary" @click="doCreateAddress">
                Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>

        <!-- Edit Address Dialog -->
        <el-dialog v-model="editAddressVisible" center width="520">
          <template #header>
            <h2>Edit User</h2>
          </template>
          <el-form
            :model="editAddressForm"
            label-width="140px"
            label-position="right"
            :rules="editAddressRules"
            ref="editAddressFormRef"
          >
            <el-form-item label="Full Address" prop="fullAddress">
              <el-input
                v-model="editAddressForm.fullAddress"
                type="textarea"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="Cell Phone Number" prop="phone">
              <el-input v-model="editAddressForm.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Is Default Address" prop="isDefault">
              <el-checkbox v-model="editAddressForm.isDefault" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editAddressVisible = false">Cancel</el-button>
              <el-button type="primary" @click="doEditAddress">
                Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-card {
  margin: 2em auto auto auto;
  width: 90%;
}

.el-col {
  margin: auto auto;
}

.el-form-item {
  margin-top: 2.2em;
}
</style>
