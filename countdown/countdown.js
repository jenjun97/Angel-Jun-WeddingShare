

// 設定倒數計時的目標日期和時間
var targetDate = new Date('2024-10-19T13:30:00');
var timerId = null;

// 格式化時間顯示
function formatTime(time) {
	// 設置計時器的字體顏色為黑色
	document.getElementById('timer').style.color = 'black';
	// 計算總小時數
	var hours = Math.floor(time / 3600);
	var minutes = Math.floor((time % 3600) / 60);
	var seconds = time % 60;
	// 返回格式化後的時間字串
	// 格式化小時數，刪除千位數前面的0
	var formattedHours = hours.toString();

	// 返回格式化後的時間字串
	return formattedHours + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);

}

// 更新計時器
function updateTimer() {
	// 獲取當前時間
	var now = new Date();
	// 計算剩餘時間（秒）
	var timeLeft = Math.floor((targetDate - now) / 1000);

	// 如果時間到，顯示
	if (timeLeft <= 0) {
		// 設置計時器顯示為00天 00:00:00，並將字體顏色設為紅色
		// document.getElementById('timer').innerHTML = '00:00:00';
		// document.getElementById('timer').style.color = 'red';
		// 清除計時器
		clearInterval(timerId);
		
		// 顯示thief元素
		document.getElementById('thief').style.display = 'block';
		// 隱藏countdown元素
		document.querySelector('.countdown').style.display = 'none';
		return;
	}

	// 更新計時器顯示
	document.getElementById('timer').innerHTML = formatTime(timeLeft);
}

// 開始計時器
function startTimer() {
	// 如果計時器尚未開始，則設置每秒更新一次計時器
	if (timerId === null) {
		timerId = setInterval(updateTimer, 1000);
	}
}

// 自動開始倒數計時
startTimer();
