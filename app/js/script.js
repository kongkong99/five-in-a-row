'use strict';

//备注：所有困难改为二般，因为感觉自己算法达不到困难

//移动化自适应宽度
var availWidth = window.screen.availWidth;
var chessWidth = 0.9 * availWidth;
if (chessWidth > 600) {
    chessWidth = 600;
}
var gridWidth = 1 / 15 * chessWidth;
var sideWidth = gridWidth / 2;
var chessRadius = 0.75 * sideWidth;
//-------------------------------------------

var chess = document.getElementById('chess');
chess.width = chessWidth;
chess.height = chessWidth;
var context = chess.getContext('2d');
var win = document.getElementById('win');
var lose = document.getElementById('lose');
win.width = chessWidth;
win.height = chessWidth;
win.lineHeight = chessWidth;

lose.width = chessWidth;
lose.height = chessWidth;
lose.lineHeight = chessWidth;
var rank = 2;
context.strokeStyle = '#686868';

var over = false; //判断游戏是否结束
var me = true; //判断哪个颜色棋子落点
var chessBoard = []; //棋子


//主流程逻辑
window.onload = function (ev) {
    var rank = 2;
    init();
};

//主流程初始化
var init = function init() {
    //重置画布canvas
    chess.width = chess.width;

    over = false;
    me = true;
    win.style.display = 'none';
    lose.style.display = 'none';
    chess.style.display = 'block';
    drawChessBoard(); //绘制棋盘
    chessInit(); //初始化棋子数组
    winsInit(); //初始化赢法数组
    CountInit(); //统计所有赢法种类
    myAndcomInit(); //初始化人和电脑赢法的统计数组
    gradeInit(); //游戏难度初始化
};

//button点击切换难度
var content = document.getElementById('content');
var dif = document.getElementById('difficult');
var gen = document.getElementById('general');
var easy = document.getElementById('easy');

//困难
dif.onclick = function () {
    rank = 0;
    content.innerText = '二般';
    init();
};

//一般
gen.onclick = function () {
    rank = 1;
    content.innerText = '一般';
    init();
};

//简单
easy.onclick = function () {
    rank = 2;
    content.innerText = '简单';
    init();
};

//绘制期棋盘
var drawChessBoard = function drawChessBoard() {
    for (var i = 0; i < 15; i++) {

        //竖线
        context.moveTo(sideWidth + i * gridWidth, sideWidth);
        context.lineTo(sideWidth + i * gridWidth, chessWidth - sideWidth);
        context.stroke();

        //横线
        context.moveTo(sideWidth, sideWidth + i * gridWidth);
        context.lineTo(chessWidth - sideWidth, sideWidth + i * gridWidth);
        context.stroke();
    }
};

//初始化棋子
var chessInit = function chessInit() {
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }
};

//画棋子
var onStep = function onStep(i, j, me) {
    context.beginPath();
    context.arc(sideWidth + i * gridWidth, sideWidth + j * gridWidth, chessRadius, 0, 2 * Math.PI);
    context.closePath();
    var grd = context.createRadialGradient(sideWidth + i * gridWidth + 2, sideWidth + j * gridWidth - 2, chessRadius, sideWidth + i * gridWidth + 2, sideWidth + j * gridWidth - 2, 0);
    if (me) {
        //黑棋颜色
        grd.addColorStop(0, '#0a0a0a');
        grd.addColorStop(1, '#636766');
    } else {
        //白棋颜色
        grd.addColorStop(0, '#d1d1d1');
        grd.addColorStop(1, '#f9f9f9');
    }
    context.fillStyle = grd;
    context.fill();
};

//下棋落点点击事件
chess.onclick = function (ev) {
    if (over) {
        return;
    }
    if (!me) {
        return;
    }
    var x = ev.offsetX;
    var y = ev.offsetY;
    var i = Math.floor(x / gridWidth);
    var j = Math.floor(y / gridWidth);
    if (chessBoard[i][j] == 0) {
        onStep(i, j, me);

        //黑棋
        chessBoard[i][j] = 1;

        //观察并设置落点后，判断胜负情况
        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;

                computerWin[k] = 6;
                if (myWin[k] == 5) {
                    setTimeout(function () {
                        chess.style.display = 'none';
                        win.style.display = 'none';
                        lose.style.display = 'none';
                        win.style.display = 'block';
                    }, 1000);

                    over = true;
                }
            }
        }

        if (!over) {
            //没有结束实现电脑落点
            me = !me;
            computerAI();
        }
    }
};

//初始化赢法数组
var wins = [];
var winsInit = function winsInit() {
    for (var i = 0; i < 15; i++) {
        wins[i] = [];
        for (var j = 0; j < 15; j++) {
            wins[i][j] = [];
        }
    }
};

//初始化统计赢法种类
var count = 0;
/**
 * @return {number}
 */
var CountInit = function CountInit() {
    //横向统计
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
                wins[i][j + k][count] = true;
            }
            count++;
        }
    }

    //纵向统计
    for (var _i = 0; _i < 15; _i++) {
        for (var _j = 0; _j < 11; _j++) {
            for (var _k = 0; _k < 5; _k++) {
                wins[_j + _k][_i][count] = true;
            }
            count++;
        }
    }
    //正对角线方向统计
    for (var _i2 = 0; _i2 < 11; _i2++) {
        for (var _j2 = 14; _j2 > 3; _j2--) {
            for (var _k2 = 0; _k2 < 5; _k2++) {
                wins[_i2 + _k2][_j2 - _k2][count] = true;
            }
            count++;
        }
    }

    //反对角线方向统计
    for (var _i3 = 0; _i3 < 11; _i3++) {
        for (var _j3 = 0; _j3 < 11; _j3++) {
            for (var _k3 = 0; _k3 < 5; _k3++) {
                wins[_i3 + _k3][_j3 + _k3][count] = true;
            }
            count++;
        }
    }

    return count;
};

//初始化人和电脑赢法的统计数组
var myWin = [];
var computerWin = [];
var addWin = [];
var myAndcomInit = function myAndcomInit() {
    for (var i = 0; i < count; i++) {
        myWin[i] = 0;
        computerWin[i] = 0;
        addWin[i] = 0;
    }
};

//电脑黑棋落点
var computerAI = function computerAI() {
    var myScore = [];
    var computerScore = [];
    var addScore = [];
    var max = 0;
    var maxi = 0,
        maxj = 0;
    //初始化
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        addScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
            addScore[i][j] = 0;
        }
    }

    //AI算法实现
    for (var _i4 = 0; _i4 < 15; _i4++) {
        for (var _j4 = 0; _j4 < 15; _j4++) {
            if (chessBoard[_i4][_j4] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[_i4][_j4][k]) {
                        //判断人
                        if (myWin[k] == 1) {
                            myScore[_i4][_j4] += grade[rank][0][0];
                            addScore[_i4][_j4] += grade[rank][0][0];
                        } else if (myWin[k] == 2) {
                            myScore[_i4][_j4] += grade[rank][0][1];
                            addScore[_i4][_j4] += grade[rank][0][1];
                        } else if (myWin[k] == 3) {
                            myScore[_i4][_j4] += grade[rank][0][2];
                            addScore[_i4][_j4] += grade[rank][0][2];
                        } else if (myWin[k] == 4) {
                            myScore[_i4][_j4] += grade[rank][0][3];
                            addScore[_i4][_j4] += grade[rank][0][3];
                        }

                        //判断电脑
                        if (computerWin[k] == 1) {
                            computerScore[_i4][_j4] += grade[rank][0][0];
                            addScore[_i4][_j4] += grade[rank][0][0];
                        } else if (computerWin[k] == 2) {
                            computerScore[_i4][_j4] += grade[rank][1][1];
                            addScore[_i4][_j4] += grade[rank][1][1];
                        } else if (computerWin[k] == 3) {
                            computerScore[_i4][_j4] += grade[rank][1][2];
                            addScore[_i4][_j4] += grade[rank][1][2];
                        } else if (computerWin[k] == 4) {
                            computerScore[_i4][_j4] += grade[rank][1][3];
                            addScore[_i4][_j4] += grade[rank][1][3];
                        }
                    }
                }

                //判断最优点坐标

                //对于人的黑棋
                if (myScore[_i4][_j4] > max) {
                    max = myScore[_i4][_j4];
                    maxi = _i4;
                    maxj = _j4;
                } else if (myScore[_i4][_j4] == max) {
                    if (computerScore[_i4][_j4] > computerScore[maxi][maxj]) {
                        maxi = _i4;
                        maxj = _j4;
                    }
                }
                //对于电脑的白棋
                if (computerScore[_i4][_j4] > max) {
                    max = computerScore[_i4][_j4];
                    maxi = _i4;
                    maxj = _j4;
                } else if (computerScore[_i4][_j4] == max) {
                    if (myScore[_i4][_j4] > myScore[maxi][maxj]) {
                        maxi = _i4;
                        maxj = _j4;
                    }
                }
                //addScore 统计
                // if (addScore[i][j] > max) {
                //     max = addScore[i][j];
                //     maxi = i;
                //     maxj = j;
                // } else if (computerScore[i][j] == max) {
                //     if (myScore[i][j] > myScore[maxi][maxj]) {
                //         maxi = i;
                //         maxj = j;
                //     }
                // }
            }
        }
    }
    //电脑白棋落点，并判断胜负情况
    onStep(maxi, maxj, false);
    //console.log(maxi,maxj);
    chessBoard[maxi][maxj] = 2;
    for (var _k4 = 0; _k4 < count; _k4++) {
        if (wins[maxi][maxj][_k4]) {
            computerWin[_k4]++;
            myWin[_k4] = 6;
            if (computerWin[_k4] == 5) {
                setTimeout(function () {
                    chess.style.display = 'none';
                    win.style.display = 'none';
                    lose.style.display = 'none';
                    lose.style.display = 'block';
                }, 1000);
                over = true;
            }
        }
    }
    if (!over) {
        me = !me;
    }
};

//游戏难度设定并初始化
var grade = [];
var gradeInit = function gradeInit() {
    for (var i = 0; i < 3; i++) {
        grade[i] = [];
        for (var j = 0; j < 2; j++) {
            grade[i][j] = [];
            for (var k = 0; k < 4; k++) {
                grade[i][j][k] = 0;
            }
        }
    }

    //困难模式（我认为最优的，当然肯定不是真正最优的算法）
    grade[0][0] = [1500, 12000, 23000, 43200000];
    grade[0][1] = [2000, 12200, 23999, 10000000000];

    //一般模式（防守加进攻）
    grade[1][0] = [200, 12000, 7200000, 43200000]; //当出现2+2 ，填一个使两个都为三时，会赢；
    grade[1][1] = [220, 13200, 7920000, 10000000000];
    //简单模式（只防守，不进攻）
    grade[2][0] = [200, 400, 2000, 10000];
    grade[2][1] = [220, 420, 2100, 20000];
};