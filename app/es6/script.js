//备注：所有困难改为二般，因为感觉自己算法达不到困难

//移动化自适应宽度
let availWidth = window.screen.availWidth;
let chessWidth = 0.9 * availWidth;
if(chessWidth>600){
    chessWidth=600;
}
let gridWidth = (1 / 15) * chessWidth;
let sideWidth = gridWidth / 2;
let chessRadius = 0.75 * sideWidth;
//-------------------------------------------

let chess = document.getElementById('chess');
chess.width =chessWidth;
chess.height=chessWidth;
let context = chess.getContext('2d');
let win = document.getElementById('win');
let lose = document.getElementById('lose');
win.width=chessWidth;
win.height=chessWidth;
win.lineHeight=chessWidth;

lose.width=chessWidth;
lose.height=chessWidth;
lose.lineHeight=chessWidth;
let rank = 2;
context.strokeStyle = '#686868';

let over = false; //判断游戏是否结束
let me = true; //判断哪个颜色棋子落点
let chessBoard = []; //棋子


//主流程逻辑
window.onload = function (ev) {
    let rank = 2;
    init();
};

//主流程初始化
let init = function () {
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
let content = document.getElementById('content');
let dif = document.getElementById('difficult');
let gen = document.getElementById('general');
let easy = document.getElementById('easy');

//困难
dif.onclick = ()=> {
    rank = 0;
    content.innerText = '二般';
    init();
};

//一般
gen.onclick = ()=> {
    rank = 1;
    content.innerText = '一般';
    init();
};

//简单
easy.onclick = ()=> {
    rank = 2;
    content.innerText = '简单';
    init();
};


//绘制期棋盘
let drawChessBoard = ()=> {
    for (let i = 0; i < 15; i++) {

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
let chessInit =  () => {
    for (let i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (let j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }
};

//画棋子
let onStep = (i, j, me) =>{
    context.beginPath();
    context.arc(sideWidth + i * gridWidth, sideWidth + j * gridWidth, chessRadius, 0, 2 * Math.PI);
    context.closePath();
    let grd = context.createRadialGradient(sideWidth + i * gridWidth + 2, sideWidth + j * gridWidth - 2, chessRadius, sideWidth + i * gridWidth + 2, sideWidth + j * gridWidth - 2, 0);
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
chess.onclick =  (ev) =>{
    if (over) {
        return;
    }
    if (!me) {
        return;
    }
    let x = ev.offsetX;
    let y = ev.offsetY;
    let i = Math.floor(x / gridWidth);
    let j = Math.floor(y / gridWidth);
    if (chessBoard[i][j] == 0) {
        onStep(i, j, me);

        //黑棋
        chessBoard[i][j] = 1;

        //观察并设置落点后，判断胜负情况
        for (let k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;

                computerWin[k] = 6;
                if (myWin[k] == 5) {
                    setTimeout(()=> {
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
let wins = [];
let winsInit =  () => {
    for (let i = 0; i < 15; i++) {
        wins[i] = [];
        for (let j = 0; j < 15; j++) {
            wins[i][j] = [];
        }
    }
};

//初始化统计赢法种类
let count = 0;
/**
 * @return {number}
 */
let CountInit = function () {
    //横向统计
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 11; j++) {
            for (let k = 0; k < 5; k++) {
                wins[i][j + k][count] = true;
            }
            count++;
        }
    }

    //纵向统计
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 11; j++) {
            for (let k = 0; k < 5; k++) {
                wins[j + k][i][count] = true;
            }
            count++;
        }
    }
    //正对角线方向统计
    for (let i = 0; i < 11; i++) {
        for (let j = 14; j > 3; j--) {
            for (let k = 0; k < 5; k++) {
                wins[i + k][j - k][count] = true;
            }
            count++;
        }
    }

    //反对角线方向统计
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            for (let k = 0; k < 5; k++) {
                wins[i + k][j + k][count] = true;
            }
            count++;
        }
    }

    return count;
};

//初始化人和电脑赢法的统计数组
let myWin = [];
let computerWin = [];
let addWin=[];
let myAndcomInit =  () => {
    for (let i = 0; i < count; i++) {
        myWin[i] = 0;
        computerWin[i] = 0;
       addWin[i] = 0;
    }
};

//电脑黑棋落点
let computerAI = ()=> {
    let myScore = [];
    let computerScore = [];
    let addScore =[];
    let max = 0;
    let maxi = 0, maxj = 0;
    //初始化
    for (let i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        addScore[i] = [];
        for (let j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
            addScore[i][j] = 0;
        }
    }


    //AI算法实现
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (chessBoard[i][j] == 0) {
                for (let k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        //判断人
                        if (myWin[k] == 1) {
                            myScore[i][j] += grade[rank][0][0];
                            addScore[i][j] += grade[rank][0][0];

                        } else if (myWin[k] == 2) {
                            myScore[i][j] += grade[rank][0][1];
                            addScore[i][j] += grade[rank][0][1];
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += grade[rank][0][2];
                            addScore[i][j] += grade[rank][0][2];
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += grade[rank][0][3];
                            addScore[i][j] += grade[rank][0][3];
                        }

                        //判断电脑
                        if (computerWin[k] == 1) {
                            computerScore[i][j] += grade[rank][0][0];
                            addScore[i][j] += grade[rank][0][0];
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += grade[rank][1][1];
                            addScore[i][j] += grade[rank][1][1];
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += grade[rank][1][2];
                            addScore[i][j] += grade[rank][1][2];
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += grade[rank][1][3];
                            addScore[i][j] += grade[rank][1][3];
                        }
                    }
                }

                //判断最优点坐标

                //对于人的黑棋
                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    maxi = i;
                    maxj = j;
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[maxi][maxj]) {
                        maxi = i;
                        maxj = j;
                    }
                }
                //对于电脑的白棋
                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    maxi = i;
                    maxj = j;
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[maxi][maxj]) {
                        maxi = i;
                        maxj = j;
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
    for (let k = 0; k < count; k++) {
        if (wins[maxi][maxj][k]) {
            computerWin[k]++;
            myWin[k] = 6;
            if (computerWin[k] == 5) {
                setTimeout( ()=> {
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
let grade = [];
let gradeInit =  () => {
    for (let i = 0; i < 3; i++) {
        grade[i] = [];
        for (let j = 0; j < 2; j++) {
            grade[i][j] = [];
            for (let k = 0; k < 4; k++) {
                grade[i][j][k] = 0;
            }
        }
    }

    //困难模式（我认为最优的，当然肯定不是真正最优的算法）
    grade[0][0] = [1500, 12000, 23000, 43200000];
    grade[0][1] = [2000, 12200, 23999, 10000000000];

//一般模式（防守加进攻）
    grade[1][0] = [200, 12000, 7200000, 43200000];  //当出现2+2 ，填一个使两个都为三时，会赢；
    grade[1][1] = [220, 13200, 7920000, 10000000000];
//简单模式（只防守，不进攻）
    grade[2][0] = [200, 400, 2000, 10000];
    grade[2][1] = [220, 420, 2100, 20000];
};



