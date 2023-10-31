<script setup lang="ts">
const isCollapse = ref(true)
</script>

<template>
  <el-aside>
    <el-scrollbar>
      <el-menu router unique-opened :collapse="isCollapse">
        <a href="/" class="logo">
          <img src="@/assets/logo.svg" alt="logo" />
          <h1>Smile</h1>
        </a>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><IEpSetting /></el-icon>
            <span>权限管理</span>
          </template>

          <el-menu-item index="/roles">
            <el-icon><IEpSetting /></el-icon>
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="/menus">
            <el-icon><IEpSetting /></el-icon>r
            <span>菜单管理</span>
          </el-menu-item>
          <el-menu-item index="/resources">
            <el-icon><IEpSetting /></el-icon>
            <span>资源列表</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/users">
          <el-icon>
            <IEpSetting />
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>

        <el-menu-item index="/courses">
          <el-icon>
            <IEpSetting />
          </el-icon>
          <span>课程管理</span>
        </el-menu-item>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><IEpSetting /></el-icon>
            <span>广告管理</span>
          </template>

          <el-menu-item index="/ad-list">
            <el-icon><IEpSetting /></el-icon>
            <span>广告列表</span>
          </el-menu-item>
          <el-menu-item index="/ad-manage">
            <el-icon><IEpSetting /></el-icon>
            <span>广告位管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-aside {
  background-color: #f4f4f4;
  height: 100vh;
  width: auto;
  .el-menu {
    background-color: #f4f4f4;
    width: 200px;
    border-right: none;

    &.el-menu--collapse {
      width: 60px;
      & h1 {
        display: none;
      }
    }
  }
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  height: 60px;
  color: black;

  img {
    height: 32px;
    width: 32px;
    margin-right: 5px;
  }
}
</style>
