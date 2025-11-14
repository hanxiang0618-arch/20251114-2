let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];

// 選單相關變數
let menuX = -250; // 選單起始位置（隱藏狀態）
let showIframe = false; // 控制 iframe 顯示
let iframeElement = null; // 儲存 iframe 元素
let closeButtonX; // 關閉按鈕 X 座標
let closeButtonY = 20; // 關閉按鈕 Y 座標
let closeButtonSize = 30; // 關閉按鈕大小
let targetMenuX = -250; // 選單目標位置
let menuWidth = 250; // 選單寬度

// ⭐️ 新的選單項目 (長度為 6)
let menuItems = ['第一單元作品', '第一單元講義', '測驗卷', '淡江大學', '教育科技系', '回到首頁'];
let menuItemHeight = 50; // 選單項目高度
const QUIZ_URL = 'https://hanxiang0618-arch.github.io/111/'; // 測驗卷的目標網址
const TKU_URL = 'https://www.tku.edu.tw/'; // 淡江大學 URL 
const ET_URL = 'https://www.et.tku.edu.tw/'; // 教育科技系 URL 

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    objs.push(new DynamicShape());
    
    // 創建並設置 iframe
    iframeElement = document.createElement('iframe');
    iframeElement.style.position = 'absolute';
    iframeElement.style.left = '15%';
    iframeElement.style.top = '7.5%';
    // 設置初始大小
    iframeElement.style.width = (windowWidth * 0.7) + 'px'; 
    iframeElement.style.height = (windowHeight * 0.85) + 'px';
    iframeElement.style.left = (windowWidth * 0.15) + 'px';
    iframeElement.style.top = (windowHeight * 0.075) + 'px';
    iframeElement.style.border = 'none';
    iframeElement.style.display = 'none';
    iframeElement.style.zIndex = '1500'; // 確保在畫布之上
    document.body.appendChild(iframeElement);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    // 調整 iframe 大小
    if (iframeElement) {
        iframeElement.style.width = (windowWidth * 0.7) + 'px';
        iframeElement.style.height = (windowHeight * 0.85) + 'px';
        iframeElement.style.left = (windowWidth * 0.15) + 'px';
        iframeElement.style.top = (windowHeight * 0.075) + 'px';
    }
}

function mouseClicked() {
    // 檢查是否點擊關閉按鈕
    if (showIframe && 
        mouseX > closeButtonX - closeButtonSize/2 && 
        mouseX < closeButtonX + closeButtonSize/2 && 
        mouseY > closeButtonY - closeButtonSize/2 && 
        mouseY < closeButtonY + closeButtonSize/2) {
        
        iframeElement.style.display = 'none';
        iframeElement.src = ''; // 清空 src 釋放資源
        showIframe = false;
        return;
    }
    
    // ⭐【保留行動裝置點擊左側切換選單的邏輯】
    // 透過檢查是否為觸控事件或視窗較小來決定是否採用點擊切換邏輯
    // 這裡我們假設寬度較小的視窗為手機模式，適用點擊切換
    if (windowWidth < 800 && !showIframe && mouseX < 50 && menuX <= 0) {
        if (targetMenuX === -250) {
            targetMenuX = 0; // 顯示選單
        } else {
            targetMenuX = -250; // 隱藏選單
        }
        return; 
    }
    // ⭐【行動裝置點擊切換選單的邏輯 END】


    if (menuX > -50) { // 當選單可見時 (允許點擊選單項目)
        for (let i = 0; i < menuItems.length; i++) {
            let y = height/3 + i * menuItemHeight;
            if (mouseX >= menuX && mouseX <= menuX + menuWidth &&
                mouseY >= y - menuItemHeight/2 && mouseY <= y + menuItemHeight/2) {
                
                // 處理選單項目點擊
                let urlToLoad = '';
                let openInNewTab = false;

                switch(i) {
                    case 0: // 第一單元作品
                        urlToLoad = 'https://hanxiang0618-arch.github.io/20251024/';
                        break;
                    case 1: // 第一單元講義
                        urlToLoad = 'https://hackmd.io/@xiangli1234567899/SJMHuB0jex';
                        break;
                    case 2: // 測驗卷
                        urlToLoad = QUIZ_URL;
                        break;
                    case 3: // 淡江大學 
                        urlToLoad = TKU_URL; 
                        openInNewTab = true; // 在新分頁開啟
                        break;
                    case 4: // 教育科技系
                        urlToLoad = ET_URL; 
                        break;
                    case 5: // 回到首頁
                        openInNewTab = true;
                        urlToLoad = '../index.html';
                        break;
                }
                
                if (openInNewTab) {
                    window.open(urlToLoad, '_blank');
                } else if (urlToLoad !== '') {
                    // 處理 iframe 顯示/隱藏切換
                    if (showIframe && iframeElement.src === urlToLoad) {
                        // 如果點擊的項目已經在顯示，則隱藏它
                        iframeElement.style.display = 'none';
                        iframeElement.src = ''; 
                        showIframe = false;
                    } else {
                        // 顯示新的或不同的網頁
                        iframeElement.src = urlToLoad;
                        iframeElement.style.display = 'block';
                        showIframe = true;
                    }
                }
                
                // ⭐ 點擊選單項目後自動隱藏選單
                targetMenuX = -250; 
                
                return; // 處理完畢，退出循環
            }
        }
    }
}

function draw() {
    background(255);
    for (let i of objs) {
        i.run();
    }

    // 在首頁中間顯示文字（僅當 iframe 未顯示時），並在文字後方繪製半透明背景框以區別畫布
    if (!showIframe) {
        push();
        textAlign(CENTER, CENTER);
        // 依視窗寬度調整字體大小（縮小一些）
        let baseSize = constrain(floor(width * 0.05), 20, 110);
        textSize(baseSize);
        // 計算文字寬度以決定背景框大小
        let label = '李O祥 0662';
        let tw = textWidth(label);
        let th = baseSize; // 以字體大小作為高度參考
        let padX = tw * 0.25; // 水平方向內距（略小）
        let padY = th * 0.25; // 垂直方向內距（略小）

        // 繪製半透明背景框（深色），再畫白色文字以與背景區別
        rectMode(CENTER);
        noStroke();
        fill(32, 32, 32, 200); // 深色半透明背景
        rect(width/2, height/2, tw + padX * 2, th + padY * 2, 12);
        // 文字
        fill(255);
        text(label, width / 2, height / 2);
        pop();
    }

    // ⭐【恢復電腦滑鼠懸停邏輯】
    // 檢查滑鼠位置並更新選單狀態
    if (windowWidth >= 800) { // 假設寬度大於 800 像素為電腦模式
        if (mouseX < 100) {
            targetMenuX = 0;
        } else {
            targetMenuX = -250;
        }
    }
    // ⭐【電腦滑鼠懸停邏輯 END】

    // 平滑動畫
    menuX = lerp(menuX, targetMenuX, 0.1);

    // 繪製選單
    drawMenu();
    
    // 繪製關閉按鈕
    drawCloseButton();

    if (frameCount % int(random([15, 30])) == 0) {
        let addNum = int(random(1, 30));
        for (let i = 0; i < addNum; i++) {
            objs.push(new DynamicShape());
        }
    }
    for (let i = 0; i < objs.length; i++) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }
}

function easeInOutExpo(x) {
    return x === 0 ? 0 :
        x === 1 ?
        1 :
        x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
        (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function drawCloseButton() {
    if (showIframe) {
        push();
        // 設置關閉按鈕位置 (與 iframe 右側邊緣對齊)
        // 15% 留白 + 70% iframe 寬 = 85%，按鈕在右側留白的邊緣
        closeButtonX = windowWidth * 0.85 + closeButtonSize / 2;
        // 讓按鈕緊貼 iframe 右上角（略微向外）
        closeButtonX -= 5; 
        
        // 繪製關閉按鈕
        stroke(50);
        strokeWeight(2);
        fill(200, 0, 0);
        rectMode(CENTER);
        rect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize, 5);
        
        // 繪製 X 符號
        stroke(255);
        strokeWeight(2);
        line(closeButtonX - 8, closeButtonY - 8, closeButtonX + 8, closeButtonY + 8);
        line(closeButtonX + 8, closeButtonY - 8, closeButtonX - 8, closeButtonY + 8);
        pop();
    }
}

function drawMenu() {
    // 繪製選單背景
    push();
    rectMode(CORNER);   // 切換到 CORNER 模式
    fill(32, 32, 32, 220);
    noStroke();
    rect(menuX, 0, menuWidth, height);

    // 繪製選單項目
    textSize(32);
    textAlign(LEFT, CENTER);
    for (let i = 0; i < menuItems.length; i++) {
        let y = height/3 + i * menuItemHeight;
        
        // 檢查滑鼠是否懸停在選單項目上
        if (mouseX >= menuX && mouseX <= menuX + menuWidth &&
            mouseY >= y - menuItemHeight/2 && mouseY <= y + menuItemHeight/2) {
            fill(200, 200, 200);
        } else {
            fill(255);
        }
        
        // 在設置顏色後立即繪製文字
        text(menuItems[i], menuX + 20, y);
    }
    pop();
}

class DynamicShape {
    constructor() {
        this.x = random(0.3, 0.7) * width;
        this.y = random(0.3, 0.7) * height;
        this.reductionRatio = 1;
        this.shapeType = int(random(4));
        this.animationType = 0;
        this.maxActionPoints = int(random(2, 5));
        this.actionPoints = this.maxActionPoints;
        this.elapsedT = 0;
        this.size = 0;
        this.sizeMax = width * random(0.01, 0.05);
        this.fromSize = 0;
        this.init();
        this.isDead = false;
        this.clr = random(colors);
        this.changeShape = true;
        this.ang = int(random(2)) * PI * 0.25;
        this.lineSW = 0;
    }

    show() {
        push();
        translate(this.x, this.y);
        if (this.animationType == 1) scale(1, this.reductionRatio);
        if (this.animationType == 2) scale(this.reductionRatio, 1);
        fill(this.clr);
        stroke(this.clr);
        strokeWeight(this.size * 0.05);
        if (this.shapeType == 0) {
            noStroke();
            circle(0, 0, this.size);
        } else if (this.shapeType == 1) {
            noFill();
            circle(0, 0, this.size);
        } else if (this.shapeType == 2) {
            noStroke();
            rect(0, 0, this.size, this.size);
        } else if (this.shapeType == 3) {
            noFill();
            rect(0, 0, this.size * 0.9, this.size * 0.9);
        } else if (this.shapeType == 4) {
            line(0, -this.size * 0.45, 0, this.size * 0.45);
            line(-this.size * 0.45, 0, this.size * 0.45, 0);
        }
        pop();
        strokeWeight(this.lineSW);
        stroke(this.clr);
        line(this.x, this.y, this.fromX, this.fromY);
    }

    move() {
        let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
        if (0 < this.elapsedT && this.elapsedT < this.duration) {
            if (this.actionPoints == this.maxActionPoints) {
                this.size = lerp(0, this.sizeMax, n);
            } else if (this.actionPoints > 0) {
                if (this.animationType == 0) {
                    this.size = lerp(this.fromSize, this.toSize, n);
                } else if (this.animationType == 1) {
                    this.x = lerp(this.fromX, this.toX, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 2) {
                    this.y = lerp(this.fromY, this.toY, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 3) {
                    if (this.changeShape == true) {
                        this.shapeType = int(random(5));
                        this.changeShape = false;
                    }
                }
                this.reductionRatio = lerp(1, 0.3, sin(n * PI));
            } else {
                this.size = lerp(this.fromSize, 0, n);
            }
        }

        this.elapsedT++;
        if (this.elapsedT > this.duration) {
            this.actionPoints--;
            this.init();
        }
        if (this.actionPoints < 0) {
            this.isDead = true;
        }
    }

    run() {
        this.show();
        this.move();
    }

    init() {
        this.elapsedT = 0;
        this.fromSize = this.size;
        this.toSize = this.sizeMax * random(0.5, 1.5);
        this.fromX = this.x;
        this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
        this.fromY = this.y;
        this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
        this.animationType = int(random(3));
        this.duration = random(20, 50);
    }
}