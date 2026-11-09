# Danh mục test case

## Kiểm thử tự động

Chạy `npm run test:assessment`.

| ID | Tình huống | Kết quả mong đợi |
|---|---|---|
| AUTO-01 | Sinh lô `verified` gồm 2.000 học sinh phổ thông và 200 hồ sơ nghề riêng | Đúng cơ cấu 800/700/500/200; không có critical hoặc warning |
| AUTO-02 | Sinh lô `incidents` | Phát hiện đủ các nhóm lỗi chính bằng quy tắc dữ liệu |
| AUTO-03 | Tính điểm THCS/THPT | Kết quả khớp công thức học kỳ và cả năm |
| AUTO-04 | Sửa điểm tiểu học thập phân | Lấy đúng giá trị evidence và không mutate bản ghi cũ |
| AUTO-05 | Điểm đánh giá lại chưa phê duyệt | Không tự sửa hoặc tự phê duyệt |
| AUTO-06 | Tính điểm mô-đun giáo dục nghề nghiệp | Khớp trọng số 0,4 điểm kiểm tra và 0,6 điểm thi kết thúc |

## Kiểm thử giao diện thủ công

| ID | Thao tác | Kết quả mong đợi |
|---|---|---|
| UI-01 | Mở lab | Mặc định là lô liên cấp 2.000 học sinh; chưa có kết quả audit |
| UI-02 | Chọn từng cấp học | Số bản ghi và kết quả cập nhật đúng phạm vi |
| UI-03 | Chọn lô có lỗi và chạy audit | Có critical/warning; tổng số được giữ dù bảng giới hạn dòng hiển thị |
| UI-04 | Lọc và tìm kiếm phát hiện | Bảng chỉ hiển thị các bản ghi phù hợp |
| UI-05 | Sửa lỗi có evidence | Dữ liệu được tính lại và audit log có before/after |
| UI-06 | Mở lỗi cần phê duyệt | Không có thao tác tự sửa; yêu cầu xử lý thủ công |
| UI-07 | Khóa khi còn critical | Hệ thống từ chối và ghi nhật ký |
| UI-08 | Audit lô sạch rồi khóa | Trạng thái chuyển `draft → reviewed → locked` |
| UI-09 | Công bố lô đã khóa | Trạng thái chuyển sang `published` và có log |
| UI-10 | Yêu cầu thu hồi | Trạng thái chuyển `published → withdrawn`; không sửa trực tiếp |
| UI-11 | Chọn sáu bước xử lý | Mục tiêu, số liệu, đầu vào, thao tác, đầu ra và quy tắc đổi đúng theo bước |
| UI-12 | Dùng bước trước/bước tiếp | Điều hướng đúng thứ tự và không tự thay đổi dữ liệu |
| UI-13 | Xem bước tiếp nhận của lô lỗi | Hiện 1.999/2.000 mã duy nhất, 9.981/10.000 ô điểm và 19 ô còn thiếu |
| UI-14 | Xem bước kiểm tra sau audit | Hiện 51 critical, 23 warning, 52 hồ sơ bị ảnh hưởng và 1.948 hồ sơ sạch |
| UI-15 | Chọn giáo dục nghề nghiệp | Chỉ hiện 200 hồ sơ nghề và dùng bộ quy tắc riêng |
| UI-16 | Thu nhỏ màn hình và dùng bàn phím | Bảng cuộn ngang, điều khiển không tràn và focus rõ ràng |
| UI-17 | Đổi ngôn ngữ | Nội dung đổi Việt/Anh; mã quy tắc và mã hồ sơ giữ nguyên |

## Tiêu chí phát hành

- [ ] `npm run test:assessment` pass.
- [ ] `npm run lint` pass.
- [ ] `npm run build` pass.
- [ ] Không có dữ liệu thật hoặc request mạng ngoài dự kiến.
- [ ] Không thể tự phê duyệt điểm đánh giá lại.
- [ ] Không thể khóa khi còn critical.
- [ ] Không thể công bố lô chưa khóa.
