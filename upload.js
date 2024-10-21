



// 定義並初始化 Access Token
let accessToken = 'sl.u.AFL3epw4PFWQ6h24JXJwx-bGNHWUr47dXU1QZ1v203bJ_vT9egXMy6RIgO5fBA2vewQKp925X9SEPbZpmwdVrCtIjVQ-DnfpRYX--fZjeF44rptdeaMyJ5oHma-7YA2LED15TWpBzxk8PtaMp3mgS2kIPfLMuZAjNmg8d2TUCWQSTxmQvX6vR9pRgO487hD___23cUQcKM4ocZYSBa2gjtBoakVWzcRnKhqZnx_Vp2P_H-gHctkVljBmzYUjXR3seNhO34srVjYMOHwSyGnaKcEwUHYZDOxd2BrriptNF6ZAl1xJeFEmWO1GZ3maa1kFxzlMtKyIafwo3qg0ULbP3MU_j5xxbUpvt9BGsOF00mL7ddq9GwML245kD1doQudAg5B55uCEAxTyvkcqjZtI3u8hQQI2IFgENDMRWoDf6vwHzTxXN2LxGxBPjNJo555WnEphjgMDfke3FYuygf7BT7T2WnIfL_YBk7qkiENEQsHcMB_h0X4VKZyavpIJ2nHooG9RIpF2n75I6hyNzpePh0P5tkUndcP8a0RUJHX0Ix8xEpX45TsBMWoZosi2vQslILLcxN_aoCqnfwpk4FqJi5SvKx4eRYuFCWPpef0vh1qSa3pUTtnvNlFbmIKB5kWsvW5zq4GVyzNwXyMDaIwCqjQKyZzHtbBocbAFDZBkIoAW4w7wwdRUwSHRoOk7XOqtDqyCsv1ZApVhFjoI3uZgyQxq0HSov_UuO5dcL2Ayr3xy9tev99-CbM5F-OrkB7-0S47uSjl0t7TlMRjbCVvLVp6B716PspzOSFjlru-vHMpHCgMjLD-gvzkM1hUD8rGFONE2SUoesjA9Q5ayEu0zGG1xhS2QlMjTQJLQjyYYYmiqmPvdam9wqwXp82W0xDOlHL6itNRCVX4G39I8qptY0RlfRilJykdaBDlaHVJPyG0l9dd5zx5qL5F0wH-UJ-sigDVy3hzTMUqjSlNB2WFvIcZq7pbdGZdwlf1ZBAS-sT6nc46YT1pph9WmGvvHQ-nhsEmibkFktkxPAYj1DCk7_u2fvkVft4MdWg_vEZSSoSL4GFI8Pj141cZZSeTFNO5DJB3DZB-_6LGvTuC-ropRRVil4_1ozU2GJu3rYFdEgmFnQF2MblIUK3NIEAutsK_8eJYkvPOAJ40PCNPhQUZT075bvFQY5CCu20Cl5DOiPk8oOJyNNiTDe2nWL4BjsO6WR6BPOr73p1GVEFCFUn9wMiLas8caW4GOXAVhU1Tv6M7_mw5oq6fPCJyz9UCWNcDgG3hI4nbZ3ZeC67DM6QY5ydbQxd_7dHaOaWfehAsR9VTXS-vAf8bpl4eWHsedLTNA79oVkc2eteKTYvaprfdL4M-DtGlRlkKhDGVgRUpNnyI6kyHKjLUrkePDf88CPJbuy9MdSbKYmvxRwHCyqAZCCGv7';

// 定義必要的 Refresh Token、Client ID 和 Client Secret
const refreshToken = '91ngndttETgAAAAAAAAAAXUvogKJcOt4Q9fvVHKdPdy_1ElpCgdShrMqroze-QMX';
const clientId = 'pjx5ofi01owc5rr';
const clientSecret = 'qyod703ejfjr03v';

// 定義一個異步函數，用於在 Access Token 過期時自動刷新
async function refreshAccessToken() {
    // 發送 POST 請求到 Dropbox 的 OAuth 2.0 端點以刷新 Access Token
    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token', // 告訴 Dropbox API 要使用 refresh_token
            refresh_token: refreshToken, // 提供我們的 refresh_token
            client_id: clientId,          // 提供我們的 client_id
            client_secret: clientSecret,  // 提供我們的 client_secret
        }),
    });

    // 解析返回的 JSON 資料
    const data = await response.json();

    // 如果成功取得新的 Access Token，更新全域變數中的 accessToken
    if (data.access_token) {
        accessToken = data.access_token; // 更新 Access Token
//        console.log('Access token refreshed:', accessToken); // 輸出新的 Access Token
    } else {
        // 如果刷新失敗，輸出錯誤訊息
        console.error('Failed to refresh access token', data);
    }
}

// 為上傳表單的提交事件添加監聽器
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // 防止表單的默認提交行為

    const files = document.getElementById('fileInput').files; // 獲取使用者選擇的文件列表
    if (files.length === 0) { // 如果沒有選擇文件
        alert('請選擇一個或多個檔案'); // 提示使用者選擇文件
        return; // 終止執行
    }

    // 嘗試刷新 Access Token 以確保其有效
    await refreshAccessToken();

    // 顯示 loading 畫面
    document.getElementById('loadingOverlay').style.display = 'flex';

    // 初始化 Dropbox API 客戶端
    const dbx = new Dropbox.Dropbox({ accessToken: accessToken });

    let uploadPromises = []; // 用於保存所有上傳文件的 Promise

    // 迭代所有選擇的文件
    for (let i = 0; i < files.length; i++) {
        let file = files[i]; // 當前文件
        // 使用 Dropbox API 上傳每個文件，並將 Promise 添加到 uploadPromises 陣列
        let uploadPromise = dbx.filesUpload({ path: '/上傳喜宴照片/' + file.name, contents: file });
        uploadPromises.push(uploadPromise); // 將上傳的 Promise 添加到列表
    }

    // 等待所有文件上傳完成
    Promise.all(uploadPromises)
        .then(function(results) { // 如果所有上傳成功
            alert('所有檔案已成功上傳！'); // 提示使用者上傳成功
            // 隱藏 loading 畫面
            document.getElementById('loadingOverlay').style.display = 'none';
        })
        .catch(function(error) { // 如果上傳過程中出現錯誤
            console.error(error); // 輸出錯誤訊息
            alert('上傳失敗：' + error.message); // 提示使用者上傳失敗
            // 隱藏 loading 畫面
            document.getElementById('loadingOverlay').style.display = 'none';
        });
});