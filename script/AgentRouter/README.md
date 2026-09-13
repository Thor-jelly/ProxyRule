# AgentRouter 自动签到脚本

适用于 **Quantumult X** 的 AgentRouter 每日自动签到与额度查询脚本。

---

## 📌 功能特点

* **每日自动签到**：通过定时任务在指定时间自动完成签到。
* **额度状态查询**：签到完成后自动获取并推送当前账户剩余额度。
* **简易本地配置**：直接在 QX 本地脚本文件中修改账号密码，简单稳定。

---

## 🚀 安装与配置教程

### 步骤 1：添加任务到 Quantumult X

选择以下任意一种方式将任务加入 QX：

* **方式 A（通过 Gallery 订阅）**：
  在 QX 的 **Task Gallery** 中添加订阅：
  `https://raw.githubusercontent.com/Thor-jelly/ProxyRule/refs/heads/master/script/gallery.json`
  刷新后找到 **AgentRouter签到** 添加至本地。

* **方式 B（手动修改配置文件）**：
  在 QX 配置文件的 `[task_local]` 节点追加：
  ```ini
  0 9 * * * [https://raw.githubusercontent.com/Thor-jelly/ProxyRule/refs/heads/master/script/AgentRouter/agentrouter_checkin.js](https://raw.githubusercontent.com/Thor-jelly/ProxyRule/refs/heads/master/script/AgentRouter/agentrouter_checkin.js), tag=AgentRouter签到, enabled=true




  // ==================== [用户配置区] ====================
const USER_EMAIL = "your_email@example.com";    // 填入你的登录邮箱
const USER_PASSWORD = "your_password";          // 填入你的登录密码
// ======================================================