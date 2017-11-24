var mySwiper = new Swiper('.swiper-container', {
    // direction: 'vertical',
    loop: true,
    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
    },
    // autoplay:3000,//自动轮播和版本有关系
})
//--------------------------------------
var state = "wait";
//点击已完成、未完成的切换----------
$('.btn-box div').click(function () {
    $('.btn-box div')
        .removeClass('active')
        .filter(this)
        .addClass('active');
    if ($('.wait').hasClass('active')) {
        state = 'wait';
        $('#dell-done').css('display','none');
    } else {
        state = 'done';
        $('#dell-done').css('display','block');
    }
    reWrite();//重绘
    myIScroll.scrollTo(0, 0, 0);//每次重绘要回到顶部
})
//获取数据、保存数据----------
function getData() {
    return localStorage.todo ? JSON.parse(localStorage.todo) : [];
}
function saveData(data) {
    localStorage.todo = JSON.stringify(data);
}
//点击添加-------
$('#add').click(function () {
    $('#main').css('filter', 'blur(2px)');
    $('.mask')
        .show()
        .find('.editarea')
        .delay(500)//延迟5s出现
        .queue(function () {//需要放在队列中，否则直接渲染
            $(this)
                .addClass('show')//延迟之后显示 否则直接渲染
                .dequeue();
            $('#text')[0].focus();//注意此处获取焦点的方法
        })
})
//点击提交-------
$('#subimt').click(function () {
    var text = $('#text').val();//原型身上一个方法 保存所存的值
    console.log(text)
    if (text === '') {
        alert('请输入');
        return;
    }
    $('#text').val('');//清空
    var time = new Date().getTime();// 实例 返回距 1970 年 1 月 1 日之间的毫秒数
    var data = getData();
    var color = getColor(colorArr);
    data.push({con: text, time, isStart: 0, isDone: 0, color,kuaii:0})
    console.log($('.editarea'))
    $('.editarea')
        .removeClass('show')
        .parent()
        .hide()
        .prev()//找前面的
        .css('filter', '')



    saveData(data);
    reWrite();
})
$('.close').click(function () {//点击关闭按钮关闭
    $('.editarea').removeClass('show').parent()
        .hide()
        .prev()//找前面的
        .css('filter', '')
})
$('.showclose').click(function () {
    $('.showarea').removeClass('show').parent()
        .hide()
        .prev()//找前面的
        .css('filter', '')
})

// 移动端运用滚动条插件
// jscrolljs.com 中下载
// iscroll.js  要写在自己js的前面就可以
// 必须有固定宽高的容器
var myIScroll = new IScroll('.content', {
    fadeScrollbars: true,
    // bounce:false,
    scrollbars: true,
    mouseWheel: true,
    click:true,
})
/*var colorArr = ['0', '3', '6', '9', 'c'];
function getColor() {//随机颜色
    var str = '#';
    for (var i = 0; i < 3; i++) {
        var c = colorArr[Math.floor(Math.random() * colorArr.length)];
        str += c;
    }
    return str;
}*/
function reWrite() {
    var data = getData();
    $('.content ul').empty();//删除所有的子节点
    data.reverse();//将内容顺序颠倒 新添加的再最前面
    var str = '';
    var className;
    var addclassname;
    $.each(data, function (index, val) {
        if (state == 'wait') {//如果是未完成的
            if (val.isDone == 0) {
                 className = val.isStart? 'active' : '';//给星星加颜色
                addclassname=val.kuaii?'active':'';//方块加颜色
                console.log(addclassname)
                str += "<li id='" + index + "'  style='background:" + val.color + "'><div class='kuai  "+addclassname+"'  id='active1'></div><time>" + getYear(val.time) + "<br><span>" + gettime(val.time) + "</span></time> <p>" + val.con + "</p> <span   class='iconfont "+className+" '>&#xe662;</span><div class='right'>完成</div></li>";
            }
        }

        else if (state == 'done') {//如果是已完成的状态
            if (val.isDone == 1) {
                className = val.isStart? 'active' : '';
                addclassname = val.kuaii? 'active' : '';


                str += "<li id='" + index + "'   style='background:#CCCCCC'><div class='kuai"+addclassname+"' id='active1'></div><time>" + getYear(val.time) + "<br><span>" + gettime(val.time) + "</span></time> <p>" + val.con + "</p><span class='iconfont "+className+" '>&#xe662;</span><div class='del'>删除除</div></li>";
            }
        }
    })
    $('.content ul').html(str);
    addEvent();
    myIScroll.refresh();//!!!!!!!!!刷新
}
reWrite();
function gettime(ms) {  //时分秒
    var date = new Date()
    date.setTime(ms)
    var hour = addZero(date.getHours());
    var minute = addZero(date.getMinutes());
    var second = addZero(date.getSeconds());
    return hour + ":" + minute + ":" + second;
}
function getYear(ms) {//年月日
    var date = new Date();
    date.setTime(ms)
    var year = date.getFullYear();
    var month = addZero(date.getMonth() + 1);
    var day = addZero(date.getDate());
    return year + "-" + month + "-" + day;
}
function addZero(num) {
    return num < 10 ? '0' + num : num;
}

//触屏距离的判断----------
var max = $(window).width() / 3;
function addEvent() {
    $('.content ul li').each(function (index, ele) {
        var hammer = new Hammer(ele);//!!!!!!!!!注意引用js文件
        var mx;//拖动的距离
        var state = 'start';//先定义开始拖动前的状态
        hammer.on('panstart', function () { //------触屏开始
            $(ele).css('transition', 'none');
        })
        hammer.on('pan', function (e) { //-------触屏移动
            mx = e.deltaX; //拖动距离---------pan事件上的属性
            if (state == 'start') {
                if (mx > 0) {//刚开始拖
                    return;
                }
            }
            if (state == 'end') {
                if (mx < 0) {
                    return;
                }
                if(-max+mx>0 ){
                    return;
                }
                mx=-max+mx;
            }
            if (Math.abs(mx) > max) {
                return;
            }
            $(ele).css('transform', "translate3d(" + mx + "px,0,0)")
        })
        hammer.on('panend', function () { //------拖动结束
            $(ele).css('transition', 'all 1s');
            if (Math.abs(mx) > max / 2) {//无论左右拖动
                $(ele).css('transform', 'translate3d(-'+max+'px,0,0)');
                state = 'end';//表示应该往右面拖
            }
            else {
                $(ele).css('transform', 'translate3d(0,0,0)');
                state = 'start';//表示应该往左面拖
            }
        })
    })
}
// 点击完成--移动到已完成中---------
/*$('.content').on('click', '.right', function () {
    var data = getData();
    var index = $(this).parent().attr('id');//获取到li中的id
    data.reverse();//顺序颠倒
    data[index].isDone = 1;
    data.reverse();//顺序再返回去
    saveData(data);
    reWrite();
})*/
//点击五角星--颜色改变----------
/*$('.content').on('click', '.iconfont', function () {
    var data = getData();
    var index = $(this).parent().attr('id');
    data.reverse();
    data[index].isStart = data[index].isStart? 0 : 1;
    //先判断当前是真假 真的是1
    data.reverse();
    saveData(data);
    reWrite();
})*/
//已完成中的----删除------
/*$('.content').on('click','.del', function (){
    var data = getData();
    var index = $(this).parent().attr('id');
    data.reverse();
    data.splice(index, 1)//删除某一个
    // data.reverse();
    saveData(data);
    reWrite();
})*/
//--------清空----------
/*function clear() {
    var data =getData();
    data = $.grep(data, function (ele, index) {
        return ele.isDone == 0;
    })//过滤 $.grep 数组
    saveData(data);
    reWrite()
}*/
//点击左侧小方块---实现删除整行------
/*$('.content').on('click','.kuai', function () {
    var data = getData();
    var index = $(this).parent().attr('id');
    data.reverse();
    data[index].kuaii = data[index].kuaii? 0 : 1;//-----------------
    //先判断当前是真假 真的是1
    data.reverse();
    saveData(data);
    reWrite();

})*/
// $('#dell')
//     .click(function(){
//
//     })













/*$('#dell-done').click(function(){
    clear();//已完成中的删除按钮
})*/
//---省略号内容--------
/*$('.content').on('click', 'p', function () {
    console.log($(this))
    var text = $(this).html();
    $('#main').css('filter', 'blur(2px)');
    $('.mask')
        .show()
        .find('.showarea')
        .delay(500)
        .queue(function () {
            $(this)
                .addClass('show')
                .dequeue();
            $('.show-inner').html(text);
            $('.showclose').html('X');
        })
})*/



//小米 天猫 移动 企业站 打字游戏 五子棋 todolist  个人主页


// rem  弹性 locostorage