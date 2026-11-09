# UI/UX contract

## Mục đích

- **Người dùng chính:** cán bộ khảo thí cần hình dung cách xử lý một tập điểm lớn.
- **Công việc chính:** xác định lô đang ở bước nào, dữ liệu còn vấn đề gì và hành động an toàn tiếp theo là gì.
- **Phạm vi:** chỉ xử lý dữ liệu điểm; không trình bày quy trình tổ chức kỳ thi.
- **Hành động chính:** tại mỗi bước chỉ có một hành động nghiệp vụ nổi bật.

## Thứ bậc thông tin

1. Phạm vi cấp học và tình trạng tập dữ liệu.
2. Luồng sáu bước: Tiếp nhận → Chuẩn hóa → Kiểm tra → Ngoại lệ → Đối soát/Báo cáo → Khóa/Công bố.
3. Mục tiêu và số liệu của bước đang chọn.
4. Chuỗi Đầu vào → Thao tác → Đầu ra.
5. Quy tắc kiểm soát và bảng điều phối theo cấp học.
6. Hành động nghiệp vụ tiếp theo.
7. Bảng phát hiện, chi tiết đối soát và nhật ký kiểm soát.

## Quy tắc tương tác

- Người dùng chủ động chọn bước; hệ thống không tự sửa điểm.
- Trước audit, hiển thị số thực nhận/dự kiến và hành động kiểm tra tập điểm.
- Sau audit, hiển thị critical, warning, hồ sơ bị ảnh hưởng và hành động an toàn tiếp theo.
- Không cho khóa khi còn critical.
- Chỉ cho sửa lỗi có bằng chứng mô phỏng đã xác minh.
- Không dùng màu làm dấu hiệu duy nhất; trạng thái luôn có nhãn chữ và biểu tượng.
- Bảng điều phối xuất hiện từ bước kiểm tra trở đi.

## Responsive và accessibility

- **390×844:** các bước xếp dọc, bảng cuộn ngang, điều khiển không tràn viewport.
- **1440×900:** luồng bước và nội dung có đủ khoảng thở, không thêm cột phụ gây phân tán.
- Dùng phần tử semantic, button native, `aria-current="step"`, `aria-live="polite"` và focus ring rõ ràng.
- Chuyển động tôn trọng `prefers-reduced-motion`.

## Trạng thái nội dung

| Trạng thái | Cách thể hiện |
|---|---|
| Chưa kiểm tra | Hiện số lượng tiếp nhận và nút chạy kiểm tra |
| Thiếu một phần | Hiện cặp thực nhận/dự kiến, không che số còn thiếu |
| Bị chặn | Hiện số critical, nguyên nhân và đường dẫn đến hàng đợi ngoại lệ |
| Đạt | Cho phép khóa rồi công bố theo đúng thứ tự |
| Đã công bố | Cho phép yêu cầu thu hồi; không sửa trực tiếp |
