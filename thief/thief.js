// 記錄答對名次
var ansNum = 0;

// 送出解鎖
document.getElementById('unlock-btn').addEventListener('click', function() {

	// 如果答對過，就不用再答一次，直接顯示
	if (ansNum !== 0) {
		document.getElementById('success-card').style.display = 'flex';
		console.log(ansNum);
		return;
	}

	// 顯示 loading 畫面
	document.getElementById('loadingOverlay').style.display = 'flex';
	// 取得四個 input 的值
	var passA = document.getElementById('pass-a').value.trim();
	var passB = document.getElementById('pass-b').value.trim();
	var passC = document.getElementById('pass-c').value.trim();
	var passD = document.getElementById('pass-d').value.trim();

	// 檢查每個 input 是否只有一個數字
	if (!isValidNumber(passA) || !isValidNumber(passB) || !isValidNumber(passC) || !isValidNumber(passD)) {
		alert("密碼內容不可以是空的，且只能是數字，請檢查");
		document.getElementById('loadingOverlay').style.display = 'none';
		return;
	}

	// 將四個數字組成字串
	var password = passA + passB + passC + passD;

	// 發送 POST 請求
	fetch('/api/thief_password', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ password: password })
	})
		.then(response => response.json())
		.then(data => {
			// 取出返回的值
			const unlock = data.unlock;
			const num = data.num;
			ansNum = data.num;
			const ssUrl = data.ssUrl;
			const funUrl = data.funUrl;

			// 隱藏 loading 畫面
			document.getElementById('loadingOverlay').style.display = 'none';

			if (unlock === 'fail') {
				document.getElementById('fail-card').style.display = 'flex';
				// 重設為0，避免被寫入fail
				ansNum = 0;
			} else if (unlock == 'winner') {
				document.getElementById('winner-card').style.display = 'flex';
				document.getElementById("winner-num").textContent = num;
				document.getElementById("winner-uuid").value = data.uuid;
				
				document.getElementById("success-num").textContent = num;
				document.getElementById("ssUrl").href = ssUrl;
				document.getElementById("funUrl").href = funUrl;
			} else if (unlock == 'success') {
				document.getElementById("success-num").textContent = num;
				document.getElementById('success-card').style.display = 'flex';
				document.getElementById("ssUrl").href = ssUrl;
				document.getElementById("funUrl").href = funUrl;
			} else {
				console.error('Error:', error);
				alert("發生錯誤，請告知婚宴聯絡人");
			}

			return;
			//			if (unlock === 'fail') {
			//				document.getElementById('loadingOverlay').style.display = 'flex';
			//			} else if (!url || url === 'null') {
			//				alert("密碼錯誤");
			//			} else {
			// 導頁
			//   window.location.href = url;

			// 清空輸入框內容
			//				document.getElementById('pass-a').value = '';
			//				document.getElementById('pass-b').value = '';
			//				document.getElementById('pass-c').value = '';
			//				document.getElementById('pass-d').value = '';

			// 在新標籤頁中打開 URL
			//				window.open(url, '_blank');
			//				alert(url);
			//			}
		})
		.catch(error => {
			// 隱藏 loading 畫面
			document.getElementById('loadingOverlay').style.display = 'none';

			console.error('Error:', error);
			alert("發生錯誤，請告知婚宴聯絡人");
		});
});

// 送出贏家資料
document.getElementById('winner-btn').addEventListener('click', function() {
	// 顯示 loading 畫面
	document.getElementById('loadingOverlay').style.display = 'flex';
	document.getElementById('winner-card').style.display = 'none';
	// 取得 input 的值
	var winnerName = document.getElementById('winner-name').value.trim();
	var winnerUuid = document.getElementById('winner-uuid').value.trim();

	// 檢查每個 贏家名稱 是否有輸入
	if (isValidStr(winnerName)) {
		document.getElementById('winner-card').style.display = 'flex';
		alert("請輸入名稱");
		return;
	}

	// 檢查其他元素
	if (isValidStr(winnerUuid)) {
		document.getElementById('loadingOverlay').style.display = 'none';
		alert("發生錯誤，請告知婚宴聯絡人");
		return;
	}

	// 發送 POST 請求
	fetch('/api/thief_winner', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			winnerName: winnerName,
			winnerUuid: winnerUuid,
		})
	})
		.then(response => response.json())
		.then(data => {
			// 隱藏 loading 畫面
			document.getElementById('loadingOverlay').style.display = 'none';

			// 另開視窗
//			window.open(url, '_blank');
			// 由原本另開視窗，改成顯示一般成功解鎖畫面
			document.getElementById('success-card').style.display = 'flex';

			// 清空欄位
//			document.getElementById('pass-a').value = '';
//			document.getElementById('pass-b').value = '';
//			document.getElementById('pass-c').value = '';
//			document.getElementById('pass-d').value = '';
//			document.getElementById('pass-d').value = '';
			document.getElementById('winner-name').value = '';
			document.getElementById('winner-uuid').value = '';
			return;
		})
		.catch(error => {
			console.log('into erro')
			// 隱藏 loading 畫面
			document.getElementById('loadingOverlay').style.display = 'none';
			console.error('Error:', error);
			alert("發生錯誤，請告知婚宴聯絡人");
		});
});

// 檢查 input 的值是否是一個數字且只有一個字元
function isValidNumber(value) {
	return value.length === 1 && /^[0-9]$/.test(value);
}

// 檢查 input 的值是否為空
function isValidStr(value) {
	if (typeof value === 'undefined' || value === null || value.length === 0) {
		return true;
	} else {
		return false;
	}
}

// 按下解密失敗按鈕後，關閉畫面
document.getElementById('fail-btn').addEventListener('click', function() {
	document.getElementById('fail-card').style.display = 'none';
});

// 按下解密成功按鈕後，關閉畫面
document.getElementById('success-btn').addEventListener('click', function() {
	//	document.getElementById('success-card').style.display = 'none';
});

// 按下關閉按鈕後，關閉畫面
document.getElementById('close-btn').addEventListener('click', function() {
	document.getElementById('success-card').style.display='none';
});

