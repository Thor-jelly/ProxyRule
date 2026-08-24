// ======================================
// Clash Verge Rev 全局扩展脚本
// ======================================
// 功能：保留机场订阅的节点，完全替换策略组和规则
// 适用场景：多个机场订阅，统一使用自定义规则和策略组
// ======================================
// 使用方法：
// 1. 打开 Clash Verge → 设置 → Clash 内核 → 配置
// 2. 找到 "全局扩展脚本" (Global Script Extension)
// 3. 将此脚本内容粘贴到输入框
// 4. 保存（所有订阅配置都会自动应用）
// ======================================

// ======================================
// 规则集通用配置
// ======================================
const ruleProviderCommon = {
  type: "http",
  behavior: "classical",
  interval: 86400
};

// ======================================
// 自定义规则提供者
// ======================================
const ruleProviders = {
  // > 自定义规则
  "my-direct": {
    ...ruleProviderCommon,
    url: "https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/clash/my_direct.yaml",
    path: "./ruleset/my_direct.yaml"
  },
  "my-proxy": {
    ...ruleProviderCommon,
    url: "https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/clash/my_proxy.yaml",
    path: "./ruleset/my_proxy.yaml"
  },
  "my-us": {
    ...ruleProviderCommon,
    url: "https://raw.githubusercontent.com/Thor-jelly/ProxyRule/master/rule/clash/my_us.yaml",
    path: "./ruleset/my_us.yaml"
  },
  
  // > 广告和隐私保护
  "advertising": {
    ...ruleProviderCommon,
    behavior: "domain",
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Advertising/Advertising_Domain.yaml",
    path: "./ruleset/advertising.yaml"
  },
  "privacy": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Privacy/Privacy_Classical.yaml",
    path: "./ruleset/privacy.yaml"
  },
  "hijacking": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Hijacking/Hijacking.yaml",
    path: "./ruleset/hijacking.yaml"
  },
  
  // > 国内服务
  "apple": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Apple/Apple_Classical.yaml",
    path: "./ruleset/apple.yaml"
  },
  "wechat": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/WeChat/WeChat.yaml",
    path: "./ruleset/wechat.yaml"
  },
  "download": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Download/Download.yaml",
    path: "./ruleset/download.yaml"
  },
  
  // > AI 服务
  "openai": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml",
    path: "./ruleset/openai.yaml"
  },
  "gemini": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Gemini/Gemini.yaml",
    path: "./ruleset/gemini.yaml"
  },
  "claude": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Claude/Claude.yaml",
    path: "./ruleset/claude.yaml"
  },
  
  // > 开发和办公
  "developer": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Developer/Developer.yaml",
    path: "./ruleset/developer.yaml"
  },
  "microsoft": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Microsoft/Microsoft.yaml",
    path: "./ruleset/microsoft.yaml"
  },
  
  // > 社交平台
  "telegram": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Telegram/Telegram.yaml",
    path: "./ruleset/telegram.yaml"
  },
  "google": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Google/Google.yaml",
    path: "./ruleset/google.yaml"
  },
  
  // > 流媒体
  "youtube": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/YouTube/YouTube.yaml",
    path: "./ruleset/youtube.yaml"
  },
  "netflix": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Netflix/Netflix.yaml",
    path: "./ruleset/netflix.yaml"
  },
  "disney": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Disney/Disney.yaml",
    path: "./ruleset/disney.yaml"
  },
  
  // > 国内和国际
  "china": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/China/China_Classical.yaml",
    path: "./ruleset/china.yaml"
  },
  "global": {
    ...ruleProviderCommon,
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Global/Global_Classical.yaml",
    path: "./ruleset/global.yaml"
  }
};

// ======================================
// 规则列表
// ======================================
const rules = [
  // > 自定义规则（最高优先级）
  "RULE-SET,my-direct,DIRECT",
  "RULE-SET,my-proxy,网速超快",
  "RULE-SET,my-us,美国",
  
  // > 广告和隐私保护
  "RULE-SET,advertising,REJECT",
  "RULE-SET,privacy,REJECT",
  "RULE-SET,hijacking,REJECT",
  
  // > 国内服务直连
  "RULE-SET,apple,DIRECT",
  "RULE-SET,wechat,DIRECT",
  "RULE-SET,download,DIRECT",
  
  // > AI 服务
  "RULE-SET,openai,美国",
  "RULE-SET,gemini,美国",
  "RULE-SET,claude,美国",
  
  // > 开发和办公
  "RULE-SET,developer,网速超快",
  "RULE-SET,microsoft,网速超快",
  
  // > 社交平台
  "RULE-SET,telegram,网速超快",
  "RULE-SET,google,网速超快",
  
  // > 流媒体
  "RULE-SET,youtube,网速超快",
  "RULE-SET,netflix,网速超快",
  "RULE-SET,disney,网速超快",
  
  // > 国内网站和服务
  "RULE-SET,china,DIRECT",
  
  // > 国际网站走代理
  "RULE-SET,global,网速超快",
  
  // > 局域网地址
  "GEOIP,LAN,DIRECT,no-resolve",
  
  // > 中国大陆 IP 直连
  "GEOIP,CN,DIRECT,no-resolve",
  
  // > 兜底规则（走代理）
  "MATCH,网速超快"
];

// ======================================
// 代理组通用配置
// ======================================
const groupBaseOption = {
  interval: 300,
  timeout: 3000,
  url: "http://www.gstatic.com/generate_204",
  lazy: true,
  "max-failed-times": 3
};

// ======================================
// 地区筛选正则表达式
// ======================================
const regionFilters = {
  香港: "(?i)港|hk|hongkong|hong kong",
  台湾: "(?i)台|tw|taiwan",
  日本: "(?i)日本|jp|japan",
  韩国: "(?i)韩|kr|korea",
  新加坡: "(?i)新|sg|singapore",
  美国: "(?i)美|us|unitedstates|united states"
};

// ======================================
// DNS 配置
// ======================================
const dnsConfig = {
  enable: true,
  listen: "0.0.0.0:53",
  ipv6: false,
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "default-nameserver": ["119.29.29.29", "223.5.5.5"],
  nameserver: [
    "https://dns.alidns.com/dns-query",
    "https://doh.pub/dns-query"
  ],
  fallback: [
    "https://dns.google/dns-query",
    "https://cloudflare-dns.com/dns-query"
  ],
  "fallback-filter": {
    geoip: true,
    "geoip-code": "CN"
  },
  "fake-ip-filter": [
    "*.lan",
    "*.local",
    "localhost.ptlogin2.qq.com",
    "+.stun.*.*",
    "+.stun.*.*.*",
    "*.n.n.srv.nintendo.net",
    "+.stun.playstation.net",
    "xbox.*.*.microsoft.com",
    "*.*.xboxlive.com",
    "*.msftncsi.com",
    "*.msftconnecttest.com"
  ]
};

// ======================================
// 主函数入口
// ======================================
function main(config, profileName) {
  // 检查是否有节点
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount = typeof config?.["proxy-providers"] === "object" 
    ? Object.keys(config["proxy-providers"]).length 
    : 0;
  
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理节点");
  }

  // 覆盖 DNS 配置
  config["dns"] = dnsConfig;

  // 完全替换策略组
  config["proxy-groups"] = [
    // > 主策略组
    {
      ...groupBaseOption,
      name: "网速超快",
      type: "select",
      proxies: ["香港", "台湾", "日本", "韩国", "新加坡", "美国", "自动选择", "DIRECT"],
      "include-all": true
    },
    
    // > 自动选择
    {
      ...groupBaseOption,
      name: "自动选择",
      type: "url-test",
      tolerance: 50,
      "include-all": true
    },
    
    // > 地区分流策略组
    {
      ...groupBaseOption,
      name: "香港",
      type: "select",
      filter: regionFilters.香港,
      "include-all": true
    },
    {
      ...groupBaseOption,
      name: "台湾",
      type: "select",
      filter: regionFilters.台湾,
      "include-all": true
    },
    {
      ...groupBaseOption,
      name: "日本",
      type: "select",
      filter: regionFilters.日本,
      "include-all": true
    },
    {
      ...groupBaseOption,
      name: "韩国",
      type: "select",
      filter: regionFilters.韩国,
      "include-all": true
    },
    {
      ...groupBaseOption,
      name: "新加坡",
      type: "select",
      filter: regionFilters.新加坡,
      "include-all": true
    },
    {
      ...groupBaseOption,
      name: "美国",
      type: "select",
      filter: regionFilters.美国,
      "include-all": true
    }
  ];

  // 完全替换规则提供者和规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  // 返回修改后的配置
  return config;
}
