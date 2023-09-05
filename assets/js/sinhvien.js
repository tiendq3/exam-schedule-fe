const token = sessionStorage.getItem("token");
const email = sessionStorage.getItem("email");
console.log(email);
console.log(token);
if (token == null) {
    window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", function () {
    fetch("https://exam-schedule-production.up.railway.app/sinhvien/ds-lophoc", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const classTable = document.getElementById("classTable");

            data.forEach((classInfo, index) => {
                const row = document.createElement("tr");
                console.log(classInfo);
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${classInfo.maLH}</td>
                <td>${classInfo.hocPhan.ten}(${classInfo.hocPhan.maHP})</td>
                <td>${classInfo.giangVien.hoTen}</td>
                <td><button onclick="openModal('${classInfo.maLH}')">Xem</button></td>
            `;
                classTable.querySelector("tbody").appendChild(row);
            });
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách lớp học:", error);
        });
});
function openModal(maLH) {
    const modal = document.getElementById("myModal");
    const closeBtn = document.getElementsByClassName("close")[0];
    const scheduleTable = document.getElementById("scheduleTable");

    // Xóa nội dung cũ trong bảng
    while (scheduleTable.tBodies[0].firstChild) {
        scheduleTable.tBodies[0].removeChild(scheduleTable.tBodies[0].firstChild);
    }

    fetch(`https://exam-schedule-production.up.railway.app/sinhvien/lop-thi-cua-lop-hoc?maLH=${maLH}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const row = document.createElement("tr");
            row.innerHTML =
                `<td>${data.maLT}</td>
                <td>${data.lopHoc.hocPhan.ten}(${data.lopHoc.hocPhan.maHP})</td>
                <td>${data.ngayThi}</td>
                <td>${data.kipThi.khoangTG}</td>
                <td>${data.phongThi.ten}</td>`;
            scheduleTable.querySelector("tbody").appendChild(row);

            modal.style.display = "block";
        })
        .catch(error => {
            console.error("Lỗi khi lấy thông tin lớp thi:", error);
        });

    closeBtn.onclick = function () {
        modal.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
const logoutBtn = document.getElementById('logOut');
logoutBtn.addEventListener('click', () => {
    // Xóa thông tin đăng nhập khỏi lưu trữ
    sessionStorage.setItem('token', null);
    sessionStorage.setItem('email', null);
    sessionStorage.setItem('roles', null);

    // Điều hướng đến trang đăng nhập
    window.location.href = 'login.html';
});
const emailElement = document.getElementById('user-name');
emailElement.innerText =email;