const token = sessionStorage.getItem("token");
const email = sessionStorage.getItem("email");
console.log(token);
if (token == null) {
    window.location.href = "index.html";
}
const navLinks = document.querySelectorAll('.nav-link');
const contentDiv = document.getElementById('content');

navLinks.forEach(link => {
    // link.style.backgroundColor = 'blue';
    const navLinkToShow = document.getElementById(link);

    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.target;
        showContent(target);

        navLinks.forEach(link => link.classList.remove('current'));
        link.classList.add('current');
    });
});

// Mặc định hiển thị nội dung trong mục "Danh sách lớp đang dạy"
showContent('danh_sach_lop_dang_day');

function showContent(target) {
    const divToShow = document.getElementById(target);
    const allDivs = document.querySelectorAll('div[id^="danh_sach_"]');
    allDivs.forEach(div => {
        if (div === divToShow) {
            div.classList.remove('hidden');
        } else {
            div.classList.add('hidden');
        }
    });

    if (target === 'danh_sach_lop_dang_day') {
        fetchLopDangDayData();
    }
    if (target === 'danh_sach_lop_coi_thi') {
        fetchLopCoiThiData();
    }
}

function fetchLopDangDayData() {
    fetch('https://exam-schedule-production.up.railway.app/giangvien/ds-lophoc', {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('lop_dang_day_body');
            tableBody.innerHTML = '';

            console.log(data);
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                                <td>${item.maLH}</td>
                                <td>${item.hocPhan.ten}(${item.hocPhan.maHP})</td>
                                <td>${item.hocKy}</td>
                                <td><button class="view-students-btn" data-lophoc="${item.maLH}">Xem danh sách sinh viên</button>
                                    <button class="export-ds-thi" data-lophoc="${item.maLH}">export danh sách thi</button>
                                </td>`;
                tableBody.appendChild(row);
            });

            const viewStudentsBtns = document.querySelectorAll('.view-students-btn');
            viewStudentsBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const maLopHoc = btn.dataset.lophoc;
                    alert(`Đang xem danh sách sinh viên của lớp ${maLopHoc}`);
                    // Thực hiện hành động khác khi nhấp vào nút xem danh sách sinh viên
                });
            });

            const exportDSThiBtns = document.querySelectorAll('.export-ds-thi');
            console.log(exportDSThiBtns);
            exportDSThiBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const maLopHoc = btn.dataset.lophoc;
                    console.log(maLopHoc);

                    // Tạo URL endpoint với các request param và token
                    const endpoint = `https://exam-schedule-production.up.railway.app/giangvien/exportDSThiByLopHoc?maLH=${maLopHoc}`;
                    const headers = {
                        'Authorization': `Bearer ${token}`
                    };

                    // Tạo một yêu cầu HTTP mới để tải xuống file
                    const downloadRequest = new XMLHttpRequest();
                    downloadRequest.open('GET', endpoint);
                    downloadRequest.setRequestHeader('Authorization', headers.Authorization);
                    downloadRequest.responseType = 'blob';

                    // Xử lý sự kiện khi tải xuống hoàn thành
                    downloadRequest.onload = function () {
                        if (downloadRequest.status === 200) {
                            // Tạo một đường dẫn tạm thời để tải xuống file
                            const blob = new Blob([downloadRequest.response], { type: 'application/octet-stream' });
                            const url = window.URL.createObjectURL(blob);

                            // Tạo một thẻ a ẩn và sử dụng nó để tải xuống file tự động
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = `danh_sach_thi_${maLopHoc}.csv`; // Thay đổi tên file tải xuống tại đây nếu cần
                            document.body.appendChild(a);
                            a.click();

                            // Giải phóng đường dẫn tạm thời
                            window.URL.revokeObjectURL(url);
                        } else {
                            alert('Có lỗi xảy ra khi tải xuống file.');
                        }
                    };

                    // Gửi yêu cầu tải xuống
                    downloadRequest.send();
                });
            });
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
        });
}

function fetchLopCoiThiData() {
    fetch('https://exam-schedule-production.up.railway.app/giangvien/ds-lop-coi-thi', {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('lop_coi_thi_body');
            tableBody.innerHTML = '';

            console.log(data);
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                                <td>${item.maLT}</td>
                                <td>${item.lopHoc.hocPhan.ten}(${item.lopHoc.hocPhan.maHP})</td>
                                <td>${item.ngayThi}</td>
                                <td>${item.kipThi.khoangTG}</td>
                                <td>${item.phongThi.ten}</td>
                                <td><button class="view-students-btn" data-lophoc="${item.maLopHoc}">Xem danh sách sinh viên</button></td>
                                `;
                tableBody.appendChild(row);

            });

            const viewStudentsBtns = document.querySelectorAll('.view-students-btn');
            console.log("hehee" + viewStudentsBtns);
            viewStudentsBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const maLopHoc = btn.dataset.lophoc;
                    alert(`Đang xem danh sách sinh viên của lớp ${maLopHoc}`);
                    // Thực hiện hành động khác khi nhấp vào nút xem danh sách sinh viên
                });
            })
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
        });
}
const logoutBtn = document.getElementById('logOut');
logoutBtn.addEventListener('click', () => {
    // Xóa thông tin đăng nhập khỏi lưu trữ
    sessionStorage.setItem('token', null);
    sessionStorage.setItem('email', null);
    sessionStorage.setItem('roles', null);

    // Điều hướng đến trang đăng nhập
    window.location.href = 'index.html';
});
const emailElement = document.getElementById('user-name');
emailElement.innerText = email;