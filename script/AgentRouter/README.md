# AgentRouter Quantumult X 自动签到脚本

AgentRouter 每日自动签到 Quantumult X 脚本。

自动完成 AgentRouter 登录触发签到、校验签到日志并查询当前账户剩余额度。账号密码通过 Quantumult X 的 `argument` 参数动态传入，无需修改源码或将密钥硬编码在脚本中。

> ⚠️ **说明**：当前脚本**单次执行仅支持单个账号**。如需使用多个账号，弄多个task_local 不同时间段，可以暂时过去。因为我没这个需求暂时没有写。

---

## 🌟 功能特性

- ✅ **自动签到**：每日定时自动登录 AgentRouter 触发签到
- ✅ **状态校验**：自动查询签到日志，校验是否签到成功及具体时间
- ✅ **额度查询**：签到完成后自动获取并展示账户剩余额度
- ✅ **隐私安全**：账号密码存放在本地 QX 配置中，无需提交凭据到 GitHub
- ✅ **快捷订阅**：支持通过 `gallery.json` 一键导入配置

---

## 🚀 Quantumult X 配置教程

打开 Quantumult X 配置文件，在 `[task_local]` 节点下添加配置。

### 标准单账号配置

直接在 `argument` 中填写你的 `email` 和 `password`：

```ini
[task_local]
# AgentRouter 自动签到
0 9 * * * [https://raw.githubusercontent.com/Thor-jelly/ProxyRule/refs/heads/master/script/AgentRouter/agentrouter_checkin.js](https://raw.githubusercontent.com/Thor-jelly/ProxyRule/refs/heads/master/script/AgentRouter/agentrouter_checkin.js), tag=AgentRouter签到, argument=email=你的邮箱&password=你的密码, img-url=[https://raw.githubusercontent.com/Orz-3/mini/master/Color/Task.png](https://raw.githubusercontent.com/Orz-3/mini/master/Color/Task.png), enabled=true