// 遊戲狀態
let 狀態 = {
  score: 0,
  dna: 100,
  速度等級: 1,
  效率等級: 1,
  生物列表: []
};

// 生物配置
const 生物配置 = [
  { 類型: "🐰", 生成間隔: 2000, dna: 1 },
  { 類型: "🦏", 生成間隔: 5000, dna: 5 },
  { 類型: "🐉", 生成間隔: 10000, dna: 20 }
];

// 遊戲循環
function 生成生物() {
  const 生物 = 生物配置[Math.floor(Math.random() * 生物配置.length)];
  const 元素 = document.createElement("span");
  元素.className = "生物圖標";
  元素.textContent = 生物.類型;
  元素.onclick = () => 吞噬生物(元素, 生物.dna);
  document.getElementById("生物群").appendChild(元素);
  狀態.生物列表.push({
    元素,
    移除定時器: setTimeout(() => 元素.remove(), 生物.生成間隔)
  });
  setTimeout(生成生物, 生物.生成間隔 / 狀態.速度等級);
}

// 吞噬邏輯
function 吞噬生物(元素, dna值) {
  元素.remove();
  狀態.score++;
  狀態.dna += dna值 * 狀態.效率等級;
  document.getElementById("score").textContent = 狀態.score;
  document.getElementById("dna").textContent = 狀態.dna;
  document.getElementById("monster").style.transform = "scale(1.3)";
  setTimeout(() => {
    document.getElementById("monster").style.transform = "scale(1)";
  }, 300);
}

// 升級系統
function 升級(類型) {
  const 成本表 = { 速度: 100, 效率: 200 };
  if (狀態.dna >= 成本表[類型]) {
    狀態.dna -= 成本表[類型];
    if (類型 === "速度") {
      狀態.速度等級 += 0.5;
      document.getElementById("dnaCost速度").textContent = Math.floor(成本表.速度 * 1.5 ** 狀態.速度等級);
    } else {
      狀態.效率等級 += 0.5;
      document.getElementById("dnaCost效率").textContent = Math.floor(成本表.效率 * 1.5 ** 狀態.效率等級);
    }
    保存遊戲();
  }
}

// 存檔系統
function 保存遊戲() {
  localStorage.setItem("monsterSave", JSON.stringify(狀態));
  // 如果用Firebase，在此添加上傳代碼
}

function 加載遊戲() {
  const 存檔 = localStorage.getItem("monsterSave");
  if (存檔) 狀態 = JSON.parse(存檔);
  
  // 計算離線時間
  const 最後時間 = localStorage.getItem("lastPlayTime") || Date.now();
  const 離線秒數 = (Date.now() - 最後時間) / 1000;
  狀態.score += Math.floor(離線秒數 * 狀態.速度等級);
  更新介面();
}

function 更新介面() {
  document.getElementById("score").textContent = 狀態.score;
  document.getElementById("dna").textContent = 狀態.dna;
}

// 初始化
window.onload = () => {
  加載遊戲();
  生成生物();
  setInterval(保存遊戲, 30000); // 每30秒自動存檔
};

window.onbeforeunload = () => {
  localStorage.setItem("lastPlayTime", Date.now());
};
