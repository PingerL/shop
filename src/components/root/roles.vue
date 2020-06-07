<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template scope="scope">
            <!-- 一级权限 -->
            <el-row
              v-for="(item,index) in scope.row.children"
              :key="item.id"
              :class="['border-bottom',index === 0?'border-top':'']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeTagById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item1,index1) in item.children"
                  :key="item1.id"
                  :class="[index1 === 0?'':'border-top']"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeTagById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      @close="removeTagById(scope.row,item2.id)"
                    >>{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRoleInfo(scope.row.id)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑修改 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClose"
      >
      <el-tree ref="treeRef" :data="rightLists" :props="treeProps" @node-click="handleNodeClick" show-checkbox node-key="id" default-expand-all :default-checked-keys="defaultkeys"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      editForm: {},
      addForm: {},
      rightLists:[],
      roleId:'',
      editDialogVisible: false,
      addDialogVisible: false,
      setRightDialogVisible:false,
      // 默认选中的节点的 ID 值
      defaultkeys:[], 
      treeProps: {
          children: 'children',
          label: 'authName'
        },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 4, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get(`roles`);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.rolesList = res.data;
    },
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(`roles/${id}`);
      this.editForm = res.data;
    },
    async addRoleInfo() {
      const { data: res } = await this.$http.post(`roles`, this.addForm);
      if (res.meta.status !== 201) return this.$message.error("角色创建失败");
      this.getRolesList();
      this.$message.success("角色添加成功");
      this.addDialogVisible = false;
    },
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editForm.roleId}`,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("用户数据修改失败");
        this.getRolesList();
        this.$message.success("信息更新成功");
        this.editDialogVisible = false;
      });
    },
    delRoleInfo(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`);
          if (res.meta.status !== 200)
            return this.$message.error("用户删除失败");
          this.getRolesList();
          this.$message.success("用户删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
   async showSetRightDialog(role){
     this.roleId = role.id
      const {data:res} = await this.$http.get(`rights/tree`)
      this.rightLists = res.data
      this.getLeafKeys(role,this.defaultkeys)
      this.setRightDialogVisible = true

    },
    // 点击为角色分配权限
    async checkRights(){
       const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
       const idStr = keys.toString()
      //  const idStr = keys.join(',')
       const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
       if(res.meta.status !== 200) return this.$message.error('权限更新失败')
       this.$message.success('权限更新成功')
       this.getRolesList()
       this.setRightDialogVisible = false
       console.log(res)
     },
    // 获取三级权限的 id
    getLeafKeys(node,arr){
      if(!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    setRightDialogClose(){
      this.defaultkeys = []
    },
    removeTagById(role,rightsId){
      this.$confirm("此操作将永久删除该权限，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete (`roles/${role.id}/rights/${rightsId}`);
          console.log(res)
          if (res.meta.status !== 200)
            return this.$message.error("权限取消失败");
          // this.getRolesList(); 会导致页面重新渲染
          role.children = res.data
          this.$message.success("权限取消成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleNodeClick(data) {
        console.log(data);
      }
  }
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 8px;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.border-top {
  border-top: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>