/*
====================================
Focus Manager Ultimate Edition
最终稳定版 script.js
====================================
*/

/*
====================================
全局状态
====================================
*/

let tasks = [];

let timer = null;

let currentTask = null;

let currentTaskId = null;

let pauseCount = 0;

let pauseDuration = 0;

let continuousFocusSeconds = 0;

let focusWarnings = 0;

let idleSeconds = 0;

let lastMouseMove = Date.now();

let startTimestamp = null;

let focusChart = null;

/*
====================================
Canvas 初始化
====================================
*/

const canvas = document.getElementById(
    "fireworksCanvas"
);

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = true;

/*
====================================
粒子池
====================================
*/

let gpuParticles = [];

let shockwaves = [];

/*
====================================
监听用户活动
====================================
*/

window.addEventListener("mousemove", () => {

    lastMouseMove = Date.now();

    idleSeconds = 0;
});

window.addEventListener("keydown", () => {

    lastMouseMove = Date.now();

    idleSeconds = 0;
});

/*
====================================
添加任务
====================================
*/

function addTask() {

    const input =
        document.getElementById("taskInput");

    const urgentInput =
        document.getElementById("urgentInput");

    const importantInput =
        document.getElementById("importantInput");

    const title =
        input.value.trim();

    if (!title) {

        alert("请输入任务内容");

        return;
    }

    const urgent =
        Number(urgentInput.value);

    const important =
        Number(importantInput.value);

    const score =
        urgent * 0.4 +
        important * 0.6;

    const task = {

        id: Date.now(),

        title,

        urgent,

        important,

        score,

        completed: false,

        focusHistory: []
    };

    tasks.push(task);

    tasks.sort(
        (a, b) => b.score - a.score
    );

    renderTasks();

    generateTaskRecommendations();

    refreshPredictionSystem();

    input.value = "";
}

/*
====================================
渲染任务
====================================
*/

function renderTasks() {

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const card =
            document.createElement("div");

        card.className = "task-card";

        card.style.padding = "20px";

        card.style.marginBottom = "15px";

        card.style.borderRadius = "18px";

        card.style.background =
            "rgba(255,255,255,0.08)";

        card.style.transition =
            "all 0.5s";

        card.innerHTML = `

            <h3>${task.title}</h3>

            <p>
                紧急程度：
                ${task.urgent}/10
            </p>

            <p>
                重要程度：
                ${task.important}/10
            </p>

            <p>
                综合评分：
                ${task.score.toFixed(1)}
            </p>

            <button
                onclick="selectTask(${task.id})"
            >
                选择任务
            </button>

        `;

        taskList.appendChild(card);
    });
}

/*
====================================
选择任务
====================================
*/

function selectTask(id) {

    currentTask =
        tasks.find(
            t => t.id === id
        );

    currentTaskId = id;

    alert(
        `已选择任务：${currentTask.title}`
    );
}

/*
====================================
开始计时
====================================
*/

function startTimer() {

    if (!currentTask) {

        alert("请先选择任务");

        return;
    }

    if (timer) return;

    startTimestamp = Date.now();

    timer = setInterval(() => {

        continuousFocusSeconds++;

        updateTimerDisplay();

    }, 1000);
}

/*
====================================
暂停计时
====================================
*/

function pauseTimer() {

    if (!timer) return;

    clearInterval(timer);

    timer = null;

    pauseCount++;

    pauseDuration += 15;
}

/*
====================================
结束计时
====================================
*/

function endTimer(event) {

    if (!currentTask) {

        return;
    }

    clearInterval(timer);

    timer = null;

    const duration =
        Math.floor(
            (Date.now() - startTimestamp)
            / 1000
        );

    const focus =
        calculateFocus();

    currentTask.focusHistory.push({

        duration,

        focus
    });

    /*
    高专注特效
    */

    if (focus >= 80) {

        launchFireworks(event);

        createShockwave(
            window.innerWidth / 2,
            window.innerHeight / 2
        );
    }

    /*
    灰飞烟灭
    */

    const cards =
        document.querySelectorAll(
            ".task-card"
        );

    cards.forEach(card => {

        if (
            card.innerText.includes(
                currentTask.title
            )
        ) {

            card.style.transform =
                "scale(0) rotate(25deg)";

            card.style.opacity = "0";

            setTimeout(() => {

                card.remove();

            }, 800);
        }
    });

    /*
    删除任务
    */

    tasks =
        tasks.filter(
            t => t.id !== currentTask.id
        );

    analyzeFocusTrend();

    renderFocusChart();

    generateAnalyticsInsights();

    refreshPredictionSystem();

    updateThemeByFocus(focus);

    alert(`
任务完成！

专注度：
${focus}%

耗时：
${Math.floor(duration / 60)} 分钟
    `);

    currentTask = null;

    currentTaskId = null;

    pauseCount = 0;

    pauseDuration = 0;

    continuousFocusSeconds = 0;

    focusWarnings = 0;

    renderTasks();
}

/*
====================================
更新计时显示
====================================
*/

function updateTimerDisplay() {

    const timerDisplay =
        document.getElementById(
            "timerDisplay"
        );

    if (!timerDisplay) return;

    const mins =
        Math.floor(
            continuousFocusSeconds / 60
        );

    const secs =
        continuousFocusSeconds % 60;

    timerDisplay.innerText =

        `${mins}分 ${secs}秒`;
}

/*
====================================
AI 分心监测
====================================
*/

function monitorFocusState() {

    setInterval(() => {

        const now = Date.now();

        idleSeconds = Math.floor(

            (now - lastMouseMove) / 1000
        );

        if (idleSeconds >= 60 && timer) {

            focusWarnings++;

            showFocusWarning();

            lastMouseMove = Date.now();
        }

    }, 5000);
}

monitorFocusState();

/*
====================================
分心提醒
====================================
*/

function showFocusWarning() {

    const div =
        document.createElement("div");

    div.innerText =
        "⚠ 检测到可能分心";

    div.style.position = "fixed";

    div.style.top = "20px";

    div.style.right = "20px";

    div.style.padding = "20px";

    div.style.background =
        "rgba(255,0,0,0.8)";

    div.style.color = "white";

    div.style.borderRadius = "15px";

    div.style.zIndex = "9999";

    document.body.appendChild(div);

    setTimeout(() => {

        div.remove();

    }, 3000);
}

/*
====================================
高级专注算法
====================================
*/

function calculateFocus() {

    let focus = 100;

    focus -= pauseCount * 6;

    focus -= pauseDuration * 0.3;

    focus -= focusWarnings * 5;

    if (continuousFocusSeconds >= 1800) {

        focus += 8;
    }

    if (focus > 100) {

        focus = 100;
    }

    if (focus < 0) {

        focus = 0;
    }

    return Math.round(focus);
}

/*
====================================
AI 推荐
====================================
*/

function generateTaskRecommendations() {

    const panel =
        document.getElementById(
            "aiRecommendationPanel"
        );

    if (panel) {

        panel.remove();
    }

    const div =
        document.createElement("div");

    div.id =
        "aiRecommendationPanel";

    div.style.marginTop = "30px";

    div.style.padding = "25px";

    div.style.borderRadius = "20px";

    div.style.background =
        "rgba(255,255,255,0.08)";

    let html =
        "<h2>🤖 AI 建议</h2>";

    if (tasks.length > 0) {

        html += `
            <p>
            🔥 建议优先完成：
            ${tasks[0].title}
            </p>
        `;
    }

    div.innerHTML = html;

    document.querySelector(".container")
            .appendChild(div);
}

/*
====================================
专注趋势分析
====================================
*/

function analyzeFocusTrend() {

    let history = [];

    tasks.forEach(task => {

        if (task.focusHistory) {

            task.focusHistory.forEach(h => {

                history.push(h.focus);
            });
        }
    });

    if (history.length === 0) return;

    const avg =
        Math.round(

            history.reduce(
                (a, b) => a + b,
                0
            ) / history.length
        );

    showTrendAnalysis(avg);
}

/*
====================================
显示趋势分析
====================================
*/

function showTrendAnalysis(avg) {

    const old =
        document.getElementById(
            "trendPanel"
        );

    if (old) old.remove();

    const panel =
        document.createElement("div");

    panel.id = "trendPanel";

    panel.style.marginTop = "25px";

    panel.style.padding = "25px";

    panel.style.borderRadius = "20px";

    panel.style.background =
        "rgba(0,0,0,0.25)";

    panel.innerHTML = `

        <h2>📊 AI 专注分析</h2>

        <p>
            平均专注度：
            ${avg}%
        </p>

    `;

    document.querySelector(".container")
            .appendChild(panel);
}

/*
====================================
主题切换
====================================
*/

function updateThemeByFocus(focus) {

    if (focus >= 85) {

        document.body.style.background =
            "linear-gradient(135deg,#11998e,#38ef7d)";

    } else if (focus >= 60) {

        document.body.style.background =
            "linear-gradient(135deg,#243b55,#141e30)";

    } else {

        document.body.style.background =
            "linear-gradient(135deg,#3a1c71,#d76d77,#ffaf7b)";
    }
}

/*
====================================
分析面板
====================================
*/

function createAnalyticsPanel() {

    const old =
        document.getElementById(
            "analyticsPanel"
        );

    if (old) old.remove();

    const panel =
        document.createElement("div");

    panel.id = "analyticsPanel";

    panel.style.marginTop = "40px";

    panel.style.padding = "30px";

    panel.style.borderRadius = "25px";

    panel.style.background =
        "rgba(255,255,255,0.08)";

    panel.innerHTML = `

        <h2>
            📊 专注数据中心
        </h2>

        <canvas
            id="focusChartCanvas"
        ></canvas>

    `;

    document.querySelector(".container")
            .appendChild(panel);
}

/*
====================================
获取历史数据
====================================
*/

function getFocusHistoryData() {

    let history = [];

    tasks.forEach(task => {

        if (task.focusHistory) {

            task.focusHistory.forEach(h => {

                history.push(h.focus);
            });
        }
    });

    return history;
}

/*
====================================
渲染图表
====================================
*/

function renderFocusChart() {

    createAnalyticsPanel();

    const canvas2 =
        document.getElementById(
            "focusChartCanvas"
        );

    if (!canvas2) return;

    const ctx2 =
        canvas2.getContext("2d");

    let history =
        getFocusHistoryData();

    if (history.length === 0) {

        history = [100];
    }

    if (focusChart) {

        focusChart.destroy();
    }

    focusChart = new Chart(ctx2, {

        type: "line",

        data: {

            labels:
                history.map(
                    (_, i) =>
                    `第${i + 1}次`
                ),

            datasets: [{

                label: "专注趋势",

                data: history,

                borderWidth: 3,

                tension: 0.35,

                fill: true,

                backgroundColor:
                    "rgba(0,255,180,0.12)",

                borderColor:
                    "rgba(0,255,180,1)"
            }]
        }
    });
}

/*
====================================
AI 数据洞察
====================================
*/

function generateAnalyticsInsights() {

    const old =
        document.getElementById(
            "insightPanel"
        );

    if (old) old.remove();

    const panel =
        document.createElement("div");

    panel.id = "insightPanel";

    panel.style.marginTop = "30px";

    panel.style.padding = "25px";

    panel.style.borderRadius = "20px";

    panel.style.background =
        "rgba(0,0,0,0.25)";

    panel.innerHTML = `

        <h2>🤖 AI 数据洞察</h2>

        <p>
            当前任务数量：
            ${tasks.length}
        </p>

    `;

    document.querySelector(".container")
            .appendChild(panel);
}

/*
====================================
预测系统
====================================
*/

function refreshPredictionSystem() {

    const old =
        document.getElementById(
            "predictionPanel"
        );

    if (old) old.remove();

    const panel =
        document.createElement("div");

    panel.id = "predictionPanel";

    panel.style.marginTop = "30px";

    panel.style.padding = "25px";

    panel.style.borderRadius = "20px";

    panel.style.background =
        "rgba(255,255,255,0.08)";

    let html =
        "<h2>⏳ AI 耗时预测</h2>";

    tasks.forEach(task => {

        const predicted =
            30 + task.important * 5;

        html += `

            <p>
                ${task.title}
                ：预计 ${predicted} 分钟
            </p>

        `;
    });

    panel.innerHTML = html;

    document.querySelector(".container")
            .appendChild(panel);
}

/*
====================================
GPU 粒子类
====================================
*/

class GPUParticle {

    constructor(x, y) {

        this.x = x;

        this.y = y;

        const angle =
            Math.random() * Math.PI * 2;

        const speed =
            Math.random() * 8 + 2;

        this.vx =
            Math.cos(angle) * speed;

        this.vy =
            Math.sin(angle) * speed;

        this.life = 90;

        this.maxLife = 90;

        this.size =
            Math.random() * 3 + 1;

        this.hue =
            Math.random() * 360;

        this.friction = 0.985;

        this.gravity = 0.04;
    }

    update() {

        this.vx *= this.friction;

        this.vy *= this.friction;

        this.vy += this.gravity;

        this.x += this.vx;

        this.y += this.vy;

        this.life--;
    }

    draw() {

        const alpha =
            this.life / this.maxLife;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `
            hsla(
                ${this.hue},
                100%,
                60%,
                ${alpha}
            )
        `;

        ctx.shadowBlur = 10;

        ctx.shadowColor = `
            hsla(
                ${this.hue},
                100%,
                60%,
                ${alpha}
            )
        `;

        ctx.fill();
    }
}

/*
====================================
创建烟花爆炸
====================================
*/

function createGPUExplosion(x, y) {

    for (let i = 0; i < 80; i++) {

        gpuParticles.push(

            new GPUParticle(x, y)
        );
    }
}

/*
====================================
发射烟花
====================================
*/

function launchFireworks(event) {

    const rect =
        event.target.getBoundingClientRect();

    const x =
        rect.left + rect.width / 2;

    const y =
        rect.top;

    let bursts = 0;

    const interval =
        setInterval(() => {

            createGPUExplosion(

                x + Math.random() * 120 - 60,

                y + Math.random() * 120 - 60
            );

            bursts++;

            if (bursts >= 10) {

                clearInterval(interval);
            }

        }, 200);
}

/*
====================================
冲击波
====================================
*/

class Shockwave {

    constructor(x, y) {

        this.x = x;

        this.y = y;

        this.radius = 0;

        this.life = 60;

        this.maxLife = 60;

        this.speed = 4;
    }

    update() {

        this.radius += this.speed;

        this.life--;
    }

    draw() {

        const alpha =
            this.life / this.maxLife;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = `
            rgba(
                255,
                255,
                255,
                ${alpha}
            )
        `;

        ctx.lineWidth = 4;

        ctx.shadowBlur = 10;

        ctx.shadowColor =
            "white";

        ctx.stroke();
    }
}

function createShockwave(x, y) {

    shockwaves.push(

        new Shockwave(x, y)
    );
}

/*
====================================
GPU 动画循环（最终稳定版）
====================================
*/

function gpuAnimate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.globalCompositeOperation =
        "source-over";

    /*
    粒子
    */

    for (
        let i = gpuParticles.length - 1;
        i >= 0;
        i--
    ) {

        const p = gpuParticles[i];

        p.update();

        p.draw();

        if (p.life <= 0) {

            gpuParticles.splice(i, 1);
        }
    }

    /*
    冲击波
    */

    for (
        let i = shockwaves.length - 1;
        i >= 0;
        i--
    ) {

        const s = shockwaves[i];

        s.update();

        s.draw();

        if (s.life <= 0) {

            shockwaves.splice(i, 1);
        }
    }

    setTimeout(() => {

        requestAnimationFrame(
            gpuAnimate
        );

    }, 16);
}

/*
====================================
启动 GPU 引擎
====================================
*/

gpuAnimate();

/*
====================================
窗口缩放
====================================
*/

window.addEventListener("resize", () => {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;
});

/*
====================================
首次初始化
====================================
*/

renderTasks();

generateTaskRecommendations();

renderFocusChart();

generateAnalyticsInsights();

refreshPredictionSystem();