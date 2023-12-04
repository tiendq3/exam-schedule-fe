const token = sessionStorage.getItem('token');
const header = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
}

const logoutBtn = document.getElementById('logOut');
logoutBtn.addEventListener('click', () => {
  sessionStorage.setItem('token', null);
  sessionStorage.setItem('email', null);
  sessionStorage.setItem('roles', null);

  window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
  showStudents();

  // Hiển thị mục "Sinh Viên" khi trang được tải
  const studentTab = document.getElementById('import-export');
  studentTab.classList.add('active-tab');

  // Ẩn các mục khác ngoại trừ mục "Sinh Viên"
  const otherTabs = document.querySelectorAll('section:not(#import-export)');
  otherTabs.forEach(tab => {
    tab.classList.remove('active-tab');
  });
});

function showTab(tabId) {
  // Ẩn tất cả các mục
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.remove('active-tab');
  });

  // Hiển thị mục được chọn
  const tab = document.getElementById(tabId);
  tab.classList.add('active-tab');

  // Thêm lớp 'active' vào mục đang được chọn trong thanh công cụ
  const activeTab = document.querySelector('.active');
  activeTab.classList.remove('active');
  const selectedTab = document.querySelector(`li[onclick="showTab('${tabId}')"]`);
  selectedTab.classList.add('active');
}

// giang vien
async function fetchLecturers(pageNumber) {
  const apiUrl = `https://ithust.id.vn/giaovu/ds-giang-vien?page=${pageNumber}`;
  const response = await fetch(apiUrl, { headers: header });
  const data = await response.json();
  console.log(data);
  return data;
}

async function showLecturers(pageNumber) {
  const lecturerListDiv = document.getElementById('lecturer-list');
  const paginationDiv = document.getElementById('pagination-giangvien');

  const lecturers = await fetchLecturers(pageNumber);

  let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ Tên</th>
            <th>Ngày Sinh</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

  lecturers.content.forEach((lecturer, index) => {
    tableHTML += `
        <tr>
          <td>${pageNumber * 10 + index + 1}</td>
          <td>${lecturer.hoTen}</td>
          <td>${lecturer.ngaySinh}</td>
          <td>${lecturer.email}</td>
          <td>${lecturer.roles.join(', ')}</td>
          <td><button>Xem chi tiết</button></td>
        </tr>
      `;
  });

  tableHTML += `
        </tbody>
      </table>
    `;

  lecturerListDiv.innerHTML = tableHTML;

  // Tạo phân trang
  const totalPage = lecturers.totalPages;
  let paginationHTML = '';
  for (let i = 0; i < totalPage; i++) {
    paginationHTML += `<button onclick="showLecturers(${i})">${i + 1}</button>`;
  }

  paginationDiv.innerHTML = paginationHTML;
}

// Hiển thị mục "Giảng Viên" khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
  showLecturers(0);
});











// sinh vien
const exampleData = {
  classes: [
    { value: 'A1', label: 'Lớp A1' },
    { value: 'B1', label: 'Lớp B1' },
    { value: 'C1', label: 'Lớp C1' },
  ],
  departments: [
    { value: 'dept1', label: 'Viện A' },
    { value: 'dept2', label: 'Viện B' },
    { value: 'dept3', label: 'Viện C' },
  ],
};

// Hàm để lọc danh sách sinh viên dựa vào lớp và viện được chọn
function filterStudents() {
  const classFilter = document.getElementById('class-filter').value;
  const departmentFilter = document.getElementById('department-filter').value;
  const filteredStudents = exampleStudents.filter(student => {
    return (
      (classFilter === '' || student.class === classFilter) &&
      (departmentFilter === '' || student.department === departmentFilter)
    );
  });

  showStudents(filteredStudents);
}

// Hiển thị dữ liệu ví dụ cho combobox lớp và viện
document.addEventListener('DOMContentLoaded', () => {
  const classFilter = document.getElementById('class-filter');
  const departmentFilter = document.getElementById('department-filter');

  exampleData.classes.forEach(option => {
    const newOption = document.createElement('option');
    newOption.value = option.value;
    newOption.textContent = option.label;
    classFilter.appendChild(newOption);
  });

  exampleData.departments.forEach(option => {
    const newOption = document.createElement('option');
    newOption.value = option.value;
    newOption.textContent = option.label;
    departmentFilter.appendChild(newOption);
  });
});

let exampleStudents = [];

// Cập nhật hàm showStudents để hiển thị danh sách sinh viên theo trang
async function showStudents(pageNumber = 0) {
  // Cập nhật API URL (thay đổi thành URL API thực tế)
  const apiUrl = `https://ithust.id.vn/giaovu/ds-sinh-vien?page=${pageNumber}`;
  const response = await fetch(apiUrl, { headers: header });
  const students = await response.json();
  console.log(students);

  exampleStudents = students.content; // Lưu dữ liệu để sử dụng trong lọc

  // Hiển thị danh sách sinh viên theo trang
  const studentListDiv = document.getElementById('student-list');
  const paginationDiv = document.getElementById('pagination-sinhvien');

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ Tên</th>
          <th>MSSV</th>
          <th>Ngày Sinh</th>
          <th>Lớp</th>
          <th>Viện</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  students.content.forEach((student, index) => {
    tableHTML += `
      <tr>
        <td>${pageNumber * 10 + index + 1}</td>
        <td>${student.hoTen}</td>
        <td>${student.mssv}</td>
        <td>${student.ngaySinh}</td>
        <td>${student.lop}</td>
        <td>${student.vien}</td>
        <td>${student.email}</td>
        <td>${student.roles.join(', ')}</td>
        <td><button>Xem chi tiết</button></td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  studentListDiv.innerHTML = tableHTML;

  // Tạo phân trang
  const totalPage = students.totalPages;
  const currentPage = students.number;
  updatePaginationButtons(currentPage, totalPage, paginationDiv);
}


function updatePaginationButtons(currentPage, totalPage, paginationDiv) {
  let paginationHTML = '';
  const paginationLimit = 5;

  // Cập nhật nút "Back" nếu có
  if (currentPage > 0) {
    paginationHTML += `<button onclick="showStudents(${currentPage - 1})">Back</button>`;
  }

  // Tính toán trang bắt đầu và trang kết thúc để hiển thị các nút trang trung tâm
  let startPage = Math.max(currentPage - Math.floor(paginationLimit / 2), 0);
  let endPage = Math.min(startPage + paginationLimit - 1, totalPage - 1);

  if (endPage - startPage < paginationLimit - 1) {
    startPage = Math.max(endPage - paginationLimit + 1, 0);
  }

  // Tạo các nút trang
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="current-page" onclick="showStudents(${i})">${i + 1}</button>`;
    } else {
      paginationHTML += `<button onclick="showStudents(${i})">${i + 1}</button>`;
    }
  }

  // Cập nhật nút "Next" nếu có
  if (currentPage < totalPage - 1) {
    paginationHTML += `<button onclick="showStudents(${currentPage + 1})">Next</button>`;
  }

  // Hiển thị các nút trang vào phần pagination
  paginationDiv.innerHTML = paginationHTML;
}


// import-export
let exampleExams = [];
let exampleClasses = [];
let exampleExamClasses = [];

async function fetchClasses() {
  const apiUrl = 'https://ithust.id.vn/lophoc/all';
  const response = await fetch(apiUrl);
  const classes = await response.json();
  console.log(classes);
  exampleClasses = classes;
}

async function fetchExamClasses() {
  const apiUrl = 'https://ithust.id.vn/lopthi/all';
  const response = await fetch(apiUrl);
  const examClasses = await response.json();
  console.log(examClasses);
  exampleExamClasses = examClasses;
}

// Hàm lấy dữ liệu lịch thi theo trang
async function fetchExams(pageNumber = 0) {
  const classFilterValue = document.getElementById('class-filter-schedule').value;
  const examClassFilterValue = document.getElementById('exam-class-filter').value;
  const apiUrl = `https://ithust.id.vn/giaovu/quan-ly-lich-thi?page=${pageNumber}&filtersMaLH=${classFilterValue}&filtersMaLT=${examClassFilterValue}`;
  const response = await fetch(apiUrl, { headers: header });
  const exams = await response.json();
  exampleExams = exams.content; // Lưu dữ liệu để sử dụng trong lọc

  // Hiển thị danh sách lịch thi theo trang
  const examListDiv = document.getElementById('exam-list');
  const paginationDiv = document.getElementById('pagination-exam');

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ Tên</th>
          <th>MSSV</th>
          <th>Ngày Sinh</th>
          <th>Lớp</th>
          <th>Viện</th>
          <th>Mã LH</th>
          <th>Mã LT</th>
          <th>Ngày thi</th>
          <th>Kíp thi</th>
          <th>Phòng thi</th>
          <th>Học phần</th>
          <th>Actions</th>
          </tr>
      </thead>
      <tbody>
  `;

  exams.content.forEach((exam, index) => {
    tableHTML += `
      <tr>
        <td>${pageNumber * 10 + index + 1}</td>
        <td>${exam.hoTen}</td>
        <td>${exam.mssv}</td>
        <td>${exam.ngaySinh}</td>
        <td>${exam.lop}</td>
        <td>${exam.vien}</td>
        <td>${exam.maLH}</td>
        <td>${exam.maLT}</td>
        <td>${exam.ngayThi}</td>
        <td>${exam.maKT}</td>
        <td>${exam.tenPT}</td>
        <td>${exam.maHP}</td>
        <td><button>Xem chi tiết</button></td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  examListDiv.innerHTML = tableHTML;

  //
  const totalPage = exams.totalPages;
  const currentPage = exams.number;
  updatePaginationButtonsExams(currentPage, totalPage, paginationDiv);

}


// Cập nhật các nút trang theo yêu cầu bạn yêu cầu
function updatePaginationButtonsExams(currentPage, totalPage, paginationDiv) {
  // Code cập nhật phân trang
  let paginationHTML = '';
  const paginationLimit = 5;

  // Cập nhật nút "Back" nếu có
  if (currentPage > 0) {
    paginationHTML += `<button onclick="showStudents(${currentPage - 1})">Back</button>`;
  }

  // Tính toán trang bắt đầu và trang kết thúc để hiển thị các nút trang trung tâm
  let startPage = Math.max(currentPage - Math.floor(paginationLimit / 2), 0);
  let endPage = Math.min(startPage + paginationLimit - 1, totalPage - 1);

  if (endPage - startPage < paginationLimit - 1) {
    startPage = Math.max(endPage - paginationLimit + 1, 0);
  }

  // Tạo các nút trang
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="current-page" onclick="showStudents(${i})">${i + 1}</button>`;
    } else {
      paginationHTML += `<button onclick="showStudents(${i})">${i + 1}</button>`;
    }
  }

  if (currentPage < totalPage - 1) {
    paginationHTML += `<button onclick="showExams(${currentPage + 1})">Next</button>`;
  }

  paginationDiv.innerHTML = paginationHTML;
}

// Show danh sách lịch thi trong import-export khi trang được tải
async function showExams(currentPage) {
  await fetchExams(currentPage);
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchClasses();
  await fetchExamClasses();
  showExams();

  // Điền dữ liệu vào combobox lọc theo lớp học
  const classFilter = document.getElementById('class-filter-schedule');
  console.log(exampleClasses);
  exampleClasses.forEach(option => {
    console.log(option);
    const newOption = document.createElement('option');
    // newOption.value = option.id;
    // newOption.textContent = option.className;
    newOption.textContent = option;
    classFilter.appendChild(newOption);
  });

  const examClassFilter = document.getElementById('exam-class-filter');
  exampleExamClasses.forEach(option => {
    const newOption = document.createElement('option');
    newOption.textContent = option;
    examClassFilter.appendChild(newOption);
  });
});

//import
function uploadInputFile() {
  const fileInput = document.getElementById('excelFileInput');
  const uploadButton = document.getElementById('uploadButton');

  if (fileInput.files[0] == null) {
    alert('Vui lòng chọn một file để tải lên.');
    return;
  } else {
    fileInput.disabled = true;
    uploadButton.innerText = 'Đang tải...';
    uploadButton.disabled = true;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  // Gọi API để tải lên file
  fetch('https://ithust.id.vn/management/importDB', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
      // alert('Tải lên thành công!');
      uploadButton.innerText = "Upload";
      uploadButton.disabled = false;
      fileInput.value = null;
      fileInput.disabled = false;
    })
    .finally(() => {
      alert('Tải lên thành công!');
    });
}


const formInput = document.querySelector('.form-input');
formInput.addEventListener('click', () => {
  // Gọi đến API khi người dùng ấn vào nút
  fetch('https://ithust.id.vn/management/export-input-form', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'inputForm.xlsx';
      downloadLink.click();
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Đã xảy ra lỗi khi gọi API.');
    });
});

//export
function exportData() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const selectedValue = document.getElementById("exportFile").value;

  if (selectedValue === '1' || !startDate || !endDate) {
    alert('Vui lòng chọn phạm vi ngày hợp lệ và dữ liệu để xuất.');
    return;
  }

  // Chuyển ngày thành định dạng Unix time (timestamp)
  const startTimeStamp = new Date(startDate).getTime();
  const endTimeStamp = new Date(endDate).getTime();

  switch (selectedValue) {
    case '2':
      callApiExportFile("https://ithust.id.vn/management/rptDanhSachDuThi", 'rptDanhSachDuThi.docx', startTimeStamp, endTimeStamp);
      break;
    case '3':
      callApiExportFile("https://ithust.id.vn/management/rptDanhSachLopThi", 'rptDanhSachLopThi.docx', startTimeStamp, endTimeStamp);
      break;
    case '4':
      callApiExportFile("https://ithust.id.vn/management/rptDanhSachPhongThi", 'rptDanhSachPhongThi.docx', startTimeStamp, endTimeStamp);
      break;
    case '5':
      callApiExportFile("https://ithust.id.vn/management/rptPhanCongTrongThi", 'rptPhanCongTrongThi.docx', startTimeStamp, endTimeStamp);
      break;
    case '6':
      callApiExportFile("https://ithust.id.vn/management/qryExportToPDT", 'qryExportToPDT.xlsx', startTimeStamp, endTimeStamp);
      break;
    default:
      // Xử lý một giá trị không hợp lệ (nếu có)
      break;
  }
}

const exportBtn = document.getElementById('exportBtn');
function callApiExportFile(url, nameFile, startTimeStamp, endTimeStamp) {
  exportBtn.innerText = 'Đang xuất...';
  exportBtn.style.opacity = '0.5';
  exportBtn.disabled = true;
  console.log("time");
  console.log(startTimeStamp);
  console.log(endTimeStamp);
  fetch(url + `?startDay=${startTimeStamp}&endDay=${endTimeStamp}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi tải xuống file.');
      }
      return response.blob();
    })
    .then((blob) => {
      // Tạo một đường link ẩn để tải xuống file
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = nameFile;
      a.click();
      window.URL.revokeObjectURL(url);
      exportBtn.innerText = 'Xuất';
      exportBtn.disabled = false;
      exportBtn.style.opacity = '1';
    })
    .catch((error) => {
      console.error(error);
    });
}





// phongthi
const API_URL = 'https://ithust.id.vn/phongthi';
const API_GET_ALL = `${API_URL}/all`;
const API_DELETE = `${API_URL}/delete`;
const API_UPDATE = `${API_URL}/update`;
const API_IMPORT = `${API_URL}/import`;

// Hàm để lấy danh sách phòng thi từ API
async function getRoomList() {
  try {
    const response = await fetch(API_GET_ALL);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Hàm để vẽ bảng danh sách phòng thi từ dữ liệu
function renderTable(roomList) {
  const tableBody = document.querySelector('#roomTable tbody');
  tableBody.innerHTML = '';

  roomList.forEach((room, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${room.ten}</td>
                            <td>${room.maxPC}</td>
                            <td>${room.availablePC}</td>
                            <td>
                                <button class="editBtn">Sửa</button>
                                <button class="deleteBtn">Xóa</button>
                            </td>
                            `;

    // Xử lý sự kiện nút sửa
    const editBtn = row.querySelector('.editBtn');
    editBtn.addEventListener('click', () => {
      showEditModal(room);
    });

    // Xử lý sự kiện nút xóa
    const deleteBtn = row.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', () => {
      deleteRoom(room.id);
    });

    tableBody.appendChild(row);
  });
}

// Hàm để hiện modal thêm/sửa phòng thi
function showEditModal(room) {
  console.log(room);
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
                                <h2>${room ? 'Sửa' : 'Thêm'} phòng thi</h2>
                                <label>Tên phòng:</label>
                                <input type="text" id="tenPhong" value="${room ? room.ten : ''}" required>
                                <label>Số lượng máy:</label>
                                <input type="number" id="soLuongMay" value="${room ? room.maxPC : 0}" required>
                                <label>Số máy sử dụng được:</label>
                                <input type="number" id="soMaySuDungDuoc" value="${room ? room.availablePC : 0}" required>
                                <button id="saveBtn">Lưu</button>
                            `;

  // Xử lý sự kiện nút Lưu
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.addEventListener('click', () => {
    const tenPhong = document.getElementById('tenPhong').value;
    const soLuongMay = document.getElementById('soLuongMay').value;
    const soMaySuDungDuoc = document.getElementById('soMaySuDungDuoc').value;

    const updatedRoom = {
      ten: tenPhong,
      maxPC: soLuongMay,
      availablePC: soMaySuDungDuoc,
    };
    console.log(updatedRoom);

    saveRoom(updatedRoom);
  });

  const modal = document.getElementById('modal');
  modal.style.display = 'block';
}

// Hàm để đóng modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Hàm để lưu thông tin phòng thi (thêm/sửa)
async function saveRoom(room) {
  try {
    const response = await fetch(API_UPDATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(room),
    });

    if (response.ok) {
      closeModal();
      getAndRenderRoomList();
    } else {
      console.error('Error saving room:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving room:', error);
  }
}

// Hàm để xóa phòng thi
async function deleteRoom(roomId) {
  try {
    const response = await fetch(API_DELETE, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: roomId }),
    });

    if (response.ok) {
      getAndRenderRoomList();
    } else {
      console.error('Error deleting room:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting room:', error);
  }
}

// Hàm để import danh sách phòng thi từ file Excel
async function importRoomListFromExcel() {
  try {
    const response = await fetch(API_IMPORT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(/* Dữ liệu từ file Excel */),
    });

    if (response.ok) {
      getAndRenderRoomList();
    } else {
      console.error('Error importing room list:', response.statusText);
    }
  } catch (error) {
    console.error('Error importing room list:', error);
  }
}

// Hàm để lấy và vẽ lại danh sách phòng thi
async function getAndRenderRoomList() {
  const roomList = await getRoomList();
  renderTable(roomList);
}

// Xử lý sự kiện khi nhấn nút Thêm phòng thi
const addRoomBtn = document.getElementById('addRoomBtn');
addRoomBtn.addEventListener('click', () => {
  showEditModal(null);
});

// Xử lý sự kiện khi nhấn nút Import phòng thi
const importBtn = document.getElementById('importBtn');
importBtn.addEventListener('click', () => {
  importRoomListFromExcel();
});

// Hàm để đóng modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Xử lý sự kiện khi nhấn nút đóng (dấu tắt) trên modal
const closeBtn = document.querySelector('.closeBtn');
closeBtn.addEventListener('click', () => {
  closeModal();
});

// Xử lý sự kiện khi người dùng nhấn vào bất kỳ vị trí nào ngoài modal để đóng modal (nếu muốn)
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
});

// Lấy và vẽ lại danh sách phòng thi khi trang được tải
document.addEventListener('DOMContentLoaded', getAndRenderRoomList);





// quản lý lịch thi
const API_PHAN_CONG_TRONG_THI = 'https://ithust.id.vn/management/phan-cong-trong-thi';

function coiThiUpload() {
  const fileInput = document.getElementById('coiThiInput');
  const uploadButton = document.getElementById('uploadCoiThiButton');

  if (fileInput.files[0] == null) {
    alert('Vui lòng chọn một file để tải lên.');
    return;
  } else {
    fileInput.disabled = true;
    uploadButton.innerText = 'Đang tải...';
    uploadButton.disabled = true;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  // Gọi API để tải lên file
  fetch(API_PHAN_CONG_TRONG_THI, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
      // alert('Tải lên thành công!');
      uploadButton.innerText = "Upload";
      uploadButton.disabled = false;
      fileInput.value = null;
      fileInput.disabled = false;
    })
    .finally(() => {
      alert('Tải lên thành công!');
    });
}
// Lấy và vẽ lại danh sách lớp thi khi trang được tải
document.addEventListener('DOMContentLoaded', async () => {
  const lopThiList = await getLopThiList();
  renderLopThiTable(lopThiList);
});

