# ProxyRule

代理规则和配置文件仓库，支持 Surge、Loon、Clash、Quantumult X 多平台。

## 📁 目录结构

```
ProxyRule/
├── config/                          # 配置文件
│   ├── surge/                       # Surge 配置
│   │   └── surge_rule.conf          # 完整配置文件
│   ├── loon/                        # Loon 配置（待添加）
│   ├── clash/                       # Clash 配置
│   │   ├── clash_verge_global_script.js  # Clash Verge 全局扩展脚本（推荐）⭐
│   │   ├── my_pc_rule.ini           # PC 端订阅转换配置
│   │   ├── my_phone_rule.ini        # 手机端订阅转换配置
│   │   ├── common_pc_flag.yml       # PC 端通用标志
│   │   └── common_phone_flag.yml    # 手机端通用标志
│   └── quantumultx/                 # Quantumult X 配置
│       ├── quanx_rule.conf          # 完整配置文件
│       ├── quanx_rule_old.conf      # 旧版配置（备份）
│       └── 脚本订阅任务.md           # 脚本任务说明
│
└── rule/                            # 分流规则
    ├── surge/                       # Surge & Loon 通用规则
    │   ├── my_direct.list           # 直连规则
    │   ├── my_proxy.list            # 代理规则
    │   └── my_us.list               # 美国节点规则
    ├── clash/                       # Clash 规则（YAML 格式）
    │   ├── my_direct.yaml           # 直连规则
    │   ├── my_proxy.yaml            # 代理规则
    │   └── my_us.yaml               # 美国节点规则
    └── quantumultx/                 # Quantumult X 规则
        ├── my_direct.list           # 直连规则
        ├── my_proxy.list            # 代理规则
        └── my_us.list               # 美国节点规则
```

## 🔗 使用方式

### Surge
```ini
# 完整配置文件
https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/config/surge/surge_rule.conf

# 或单独引用规则
RULE-SET,https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/surge/my_direct.list,DIRECT
RULE-SET,https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/surge/my_proxy.list,网速超快
RULE-SET,https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/surge/my_us.list,美国
```

### Loon
```ini
# 引用规则（与 Surge 规则通用）
https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/surge/my_direct.list, policy=DIRECT, tag=自定义直连, enabled=true
https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/surge/my_proxy.list, policy=网速超快, tag=自定义代理, enabled=true
https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/surge/my_us.list, policy=美国, tag=自定义美国, enabled=true
```

### Clash / Clash Verge（推荐）⭐
```javascript
// 方式一：使用全局扩展脚本（推荐）⭐
// 1. Clash Verge → 设置 → Clash 内核 → 全局扩展脚本
// 2. 复制 clash_verge_global_script.js 的内容并粘贴
// 3. 保存（所有订阅自动生效）
// 4. 正常添加所有机场订阅
// 详见：config/clash/CLASH_VERGE_使用说明.md
```

```yaml
# 方式二：使用订阅转换
https://xxxxxx&url=你的订阅&config=https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/config/clash/my_pc_rule.ini
```

```yaml
# 方式三：单独引用规则
rule-providers:
  my_direct:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/clash/my_direct.yaml
    path: ./ruleset/my_direct.yaml
    interval: 86400
  my_proxy:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/clash/my_proxy.yaml
    path: ./ruleset/my_proxy.yaml
    interval: 86400
  my_us:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/clash/my_us.yaml
    path: ./ruleset/my_us.yaml
    interval: 86400
```

### Quantumult X
```ini
# 完整配置文件
https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/config/quantumultx/quanx_rule.conf

# 或单独引用规则
https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/quantumultx/my_direct.list, tag=自定义直连, enabled=true
https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/quantumultx/my_proxy.list, tag=自定义代理, enabled=true
https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/quantumultx/my_us.list, tag=自定义美国, enabled=true
```

## 📝 配置文件说明

### Surge (`config/surge/surge_rule.conf`)
- ✅ 完整的 Surge 配置文件
- ✅ 包含所有策略组、DNS、规则等设置
- ✅ 基于 blackmatrix7 规则优化
- ✅ 详细的中文注释
- ✅ 兜底规则：走代理（`网速超快`）

### Clash (`config/clash/`)
- ✅ **clash_verge_global_script.js** - Clash Verge 全局扩展脚本（推荐）⭐
- ✅ **my_pc_rule.ini** - 订阅转换配置（PC 端）
- ✅ **my_phone_rule.ini** - 订阅转换配置（手机端）
- ℹ️ 兜底规则：走代理（`网速超快`）
- 📖 **使用场景：** 
  - 多个机场订阅，统一规则和策略组 → `clash_verge_global_script.js`（全局扩展脚本）
  - 使用订阅转换服务 → `.ini` 文件

### Quantumult X (`config/quantumultx/quanx_rule.conf`)
- ✅ 完整的 Quantumult X 配置文件
- ✅ 包含策略组、DNS、重写规则、定时任务
- ✅ 基于 blackmatrix7 规则优化
- ✅ 详细的中文注释
- ✅ 兜底规则：走代理（`网速超快`）

## ⚙️ 策略组名称统一

所有平台使用相同的策略组名称（与 Surge 一致）：

| 策略组 | 用途 |
|--------|------|
| **网速超快** | 主策略组（手动选择） |
| **自动选择** | 自动选择延迟最低节点（可选） |
| **香港** | 香港节点 |
| **台湾** | 台湾节点 |
| **日本** | 日本节点 |
| **韩国** | 韩国节点 |
| **新加坡** | 新加坡节点 |
| **美国** | 美国节点 |
| **DIRECT** | 直连 |
| **REJECT** | 拒绝 |

## 🌍 兜底规则说明

所有配置文件的兜底规则统一为：**走代理（`网速超快`）**

**原因：**
- ✅ 国内网站已通过 China 规则直连
- ✅ 新的国外网站不会被墙
- ✅ 更适合开发者和国际化使用

**如需改为直连：** 将兜底规则改为 `DIRECT` 即可

## 📌 规则来源

- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) - 主要规则来源
- [ACL4SSR](https://github.com/ACL4SSR/ACL4SSR) - Clash 规则来源
- [w37fhy/QuantumultX](https://github.com/w37fhy/QuantumultX) - Quantumult X 规则参考
