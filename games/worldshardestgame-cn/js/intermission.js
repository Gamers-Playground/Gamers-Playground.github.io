var intermissions = [
    [],
    /*  L1 */["你还不知道", "你将面对什么。"],
    /*  L2 */["别白费力气了。"],
    /*  L3 */["我几乎可以", "保证", "你一定会失败。"],
    /*  L4 */["那关很简单。"],
    /*  L5 */["没错，就是这样！"],
    /*  L6 */["别晕头转向！"],
    /*  L7 */["你能跑多快？"],
    /*  L8 */["别被搞糊涂了。"],
    /*  L9 */["你的反应", "有多快？"],
    /* L10 */["比看起来更难。"],
    /* L11 */["放弃吧...", "难度只会", "越来越大。"],
    /* L12 */["希望你不赶时间。"],
    /* L13 */["这关太简单了。", "说真的，", "一点都不难。"],
    /* L14 */["从这里开始", "真正考验技巧了。"],
    /* L15 */["有简单的方法，", "也有", "困难的方法。"],
    /* L16 */["放弃吧，", "这关一点都不难。"],
    /* L17 */["你不可能", "通关的。"],
    /* L18 */["这关太难了", "你永远都", "过不去。"],
    /* L19 */["没那么容易，", "对吧？"],
    /* L20 */["现在更难了。"],
    /* L21 */["你已经输定了。"],
    /* L22 */["别卡住了！"],
    /* L23 */["转啊转..."],
    /* L24 */["如果你知道诀窍，", "这关", "一点都不难。"],
    /* L25 */["你可能", "开始烦躁了。"],
    /* L26 */["这关最多", "死两次", "就能过。"],
    /* L27 */["一点都不难。"],
    /* L28 */["宝宝要奶瓶吗？"],
    /* L29 */["可能有点棘手。"],
    /* L30 */["接下来的关卡", "是不可能的。"]
];

function initIntermission() {
    state = "intermission";
    intermissionTimer = INTERMISSION_TIMER_TOT;
    finishInstructions();
}

function updateIntermission() {
    if (state == "intermission") {
        if (intermissionTimer > 0) {
            intermissionTimer--;
        } else {
            state = "game";
            resetPlayer();
            resetEnemies(level);
            playerAtCheck(true);
    		initInstructions();
            justLoaded = false;
        }
    }
}

function drawIntermission() {
    drawPlainBg();
    
    // text
    const TEXT_SIZE = 50;
    canvas.fillStyle = "black";
    canvas.font = "bold " + cwh(TEXT_SIZE) + "px Arial";
    canvas.textAlign = "center";
    if (intermissions[level].length == 1) {
        canvas.fillText(intermissions[level][0], cwh(CANVAS_WIDTH / 2) + os.x, cwh(CANVAS_HEIGHT / 2 + INTERMISSION_Y_FIX) + os.y);
    } else if (intermissions[level].length == 2) {
        canvas.fillText(intermissions[level][0], cwh(CANVAS_WIDTH / 2) + os.x, cwh(CANVAS_HEIGHT / 2 - TEXT_SIZE / 2 - INTERMISSION_TEXT_SPACE + INTERMISSION_Y_FIX) + os.y);
        canvas.fillText(intermissions[level][1], cwh(CANVAS_WIDTH / 2) + os.x, cwh(CANVAS_HEIGHT / 2 + TEXT_SIZE / 2 + INTERMISSION_TEXT_SPACE + INTERMISSION_Y_FIX) + os.y);
    } else if (intermissions[level].length == 3) {
        canvas.fillText(intermissions[level][0], cwh(CANVAS_WIDTH / 2) + os.x, cwh(CANVAS_HEIGHT / 2 - (TEXT_SIZE + INTERMISSION_TEXT_SPACE * 2) + INTERMISSION_Y_FIX) + os.y);
        canvas.fillText(intermissions[level][1], cwh(CANVAS_WIDTH / 2) + os.x, cwh(CANVAS_HEIGHT / 2 + INTERMISSION_Y_FIX) + os.y);
        canvas.fillText(intermissions[level][2], cwh(CANVAS_WIDTH / 2) + os.x, cwh(CANVAS_HEIGHT / 2 + (TEXT_SIZE + INTERMISSION_TEXT_SPACE * 2) + INTERMISSION_Y_FIX) + os.y);
    }
}

function drawPlainBg() {
	var color0, color1;
	if (level >= WALLS_RED) {
		color0 = INTERMISSION_COLOR_2_0;
		color1 = INTERMISSION_COLOR_2_1;
	} else if (level >= WALLS_PURPLE) {
		color0 = INTERMISSION_COLOR_1_0;
		color1 = INTERMISSION_COLOR_1_1;
	} else {
		color0 = INTERMISSION_COLOR_0_0;
		color1 = INTERMISSION_COLOR_0_1;
	}
	
    var grad = canvas.createLinearGradient(os.x, os.y, os.x, cwh(CANVAS_HEIGHT - BAR_HEIGHT * 2) + os.y);
    canvas.beginPath();
    canvas.rect(os.x, cwh(BAR_HEIGHT) + os.y, cwh(CANVAS_WIDTH), cwh(CANVAS_HEIGHT - BAR_HEIGHT * 2));
    grad.addColorStop(0, color0);
    grad.addColorStop(1, color1);
    canvas.fillStyle = grad;
    canvas.fill();
}
