/******************** click to search ***************************/
let searchText = document.getElementById('searchText');

// 获取当前时间
let now = new Date();

// 格式化当前时间为字符串，例如 "YYYY-MM-DD HH:MM:SS"
let year = now.getFullYear();
let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并确保两位数
let day = String(now.getDate()).padStart(2, '0'); // 确保两位数
let hours = String(now.getHours() + 2).padStart(2, '0'); // 确保两位数, 推迟 2 小时
let minutes = String(now.getMinutes()).padStart(2, '0'); // 确保两位数
// let seconds = String(now.getSeconds()).padStart(2, '0'); // 确保两位数

let formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

// 设置searchText的value为当前时间
searchText.value = formattedTime;

// 使用DOMContentLoaded事件确保DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    searchText.focus();
    searchText.value = formattedTime; // 确保在DOM加载完成后设置值
});
