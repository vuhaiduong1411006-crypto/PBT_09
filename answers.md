# Phần A: Kiểm tra đọc hiểu

## Câu A1 — DOM Tree

1. Sơ đồ DOM Tree

```
document
└── div#app
    ├── header
    │   ├── h1
    │   │   └── "Todo App"
    │   └── nav
    │       ├── a.active
    │       │   └── "All"
    │       ├── a
    │       │   └── "Active"
    │       └── a
    │           └── "Completed"
    └── main
        ├── form#todoForm
        │   ├── input#todoInput
        │   └── button
        │       └── "Add"
        └── ul#todoList
            ├── li.todo-item
            │   └── "Learn HTML"
            └── li.todo-item.completed
                └── "Learn CSS"
```

2. querySelector

- Chọn thẻ h1

```javascript
document.querySelector("h1");
```

- Chọn input trong form

```javascript
document.querySelector("#todoForm input");
```

- Chọn tất cả .todo-item

```javascript
document.querySelectorAll(".todo-item");
```

- Chọn link đang active

```javascript
document.querySelector("a.active");
```

- Chọn li đầu tiên trong #todoList

```javascript
document.querySelector("#todoList li");
```

- Chọn tất cả a bên trong nav

```javascript
document.querySelectorAll("nav a");
```

## Câu A2 — innerHTML vs textContent

|                 | textContent                 | innerHTML                         |
| --------------- | --------------------------- | --------------------------------- |
| Đọc/ghi         | Text thuần                  | HTML có thể parse                 |
| Tốc độ          | Nhanh hơn                   | Chậm hơn                          |
| Bảo mật         | An toàn                     | Nguy hiểm nếu dùng với user input |
| Render tag HTML | Không (hiển thị nguyên văn) | Có                                |

Ví dụ:

```javascript
element.textContent = "<b>Hello</b>"; // Hiển thị: <b>Hello</b>
element.innerHTML = "<b>Hello</b>"; // Hiển thị: Hello (in đậm)
```

Khi nào dùng textContent:

- Hiển thị tên user, nội dung do người dùng nhập
- Đọc text của một element
- Bất kỳ khi nào không cần render HTML

Khi nào dùng innerHTML:

- Ghi HTML template do lập trình viên tự tạo (không từ user input)
- Render danh sách từ data đã được kiểm soát

XSS xảy ra khi user input được chèn trực tiếp vào innerHTML — browser parse và thực thi script độc hại.

Sửa:

```javascript
const userInput = document.querySelector("#search").value;
document.querySelector("#result").textContent = userInput;
```

## Câu A3 — Event Bubbling

1. Khi không có stopPropagation

Output:

```
BUTTON
INNER
OUTER
```

- Lý do: Event bubbling — sự kiện nổi từ element được click lên các phần tử cha. Click vào button → #btn xử lý trước → nổi lên #inner → nổi tiếp lên #outer.

2. Khi có stopPropagation

Output:

```
BUTTON
```

- Lý do: e.stopPropagation() dừng event tại #btn, không cho nổi lên các phần tử cha #inner và #outer không nhận được event → không log gì.

# Phần C: Debug và phân tích

## Câu C1 — Debug DOM Code

```javascript
const countDisplay = document.querySelector(".count");
const historyList = document.getElementById("history");

let count = 0;

function addHistory(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  li.addEventListener("click", function () {
    deleteHistory(this);
  });
  historyList.appendChild(li);
}

document.querySelector("#incrementBtn").addEventListener("click", function () {
  count++;
  countDisplay.textContent = count; // fix 6: dùng textContent thay innerHTML để tránh XSS
  addHistory("Count changed to " + count);
});

// fix 1: "onclick" → "click" (không có event tên "onclick")
document.querySelector("#decrementBtn").addEventListener("click", function () {
  count--;
  countDisplay.textContent = count; // fix 6: textContent thay innerHTML
  addHistory("Count changed to " + count);
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  count = 0;
  countDisplay.textContent = count; // fix 2: countDisplay là const, không thể gán lại — phải dùng textContent
  historyList.innerHTML = ""; // fix 3: innerHTML = null hiển thị chữ "null" — phải dùng ""
  addHistory("Reset — count về 0"); // fix 7: reset không ghi history
});

function deleteHistory(element) {
  element.parentNode.removeChild(element);
}

document.querySelector("#clearHistory").addEventListener("click", () => {
  const items = historyList.querySelectorAll("li");
  items.forEach((item) => {
    item.remove(); // fix 4: item.remove thiếu () — chỉ tham chiếu hàm chứ không gọi
  });
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("count", count);
  localStorage.setItem("history", historyList.innerHTML);
});

window.addEventListener("load", () => {
  // fix 5 + 8: localStorage.getItem() trả về string, phải parseInt()
  // nếu chưa có dữ liệu trả về null → || 0 để fallback
  count = parseInt(localStorage.getItem("count")) || 0;
  countDisplay.textContent = count;

  const savedHistory = localStorage.getItem("history");
  if (savedHistory) historyList.innerHTML = savedHistory;
});
```

## Câu C2 — Performance

1. Giải thích: Tại sao bind event lên 1000 elements riêng lẻ là BAD PRACTICE? Event Delegation giải quyết thế nào?

### Tại sao bind lên 1000 elements là bad practice

- Mỗi addEventListener tốn bộ nhớ. 1000 elements = 1000 event listeners tồn tại trong heap.
- Khi thêm element mới vào DOM, phải bind event lại thủ công cho element đó.
- Khi xóa element, phải nhớ removeEventListener để tránh memory leak.
- Với danh sách động (thêm/xóa liên tục), code quản lý event trở nên phức tạp và dễ lỗi.

### Event Delegation giải quyết thế nào

Event bubbling: khi user click vào element con, event nổi lên qua tất cả phần tử cha. Thay vì bind lên 1000 elements con, chỉ cần bind 1 listener lên phần tử cha. Phần tử cha lắng nghe tất cả event từ con nổi lên, rồi kiểm tra e.target để biết con nào được click.

2. Refactor

```javascript
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}

document.body.appendChild(fragment);
```

- Nhanh hơn vì DocumentFragment là một node ảo tồn tại trong bộ nhớ, không gắn vào DOM thật. Khi appendChild vào fragment, browser không cần tính lại layout vì fragment không hiển thị. Chỉ đến bước cuối khi append fragment vào body, browser mới thực hiện đúng 1 lần reflow cho toàn bộ 1000 elements cùng lúc.

# PHẦN D — VIDEO THỰC HÀNH OBS

- Link video PBT 09: https://youtu.be/e_cF42WMXFU
