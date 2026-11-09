# Ma trận chính sách

Ngày rà soát: **08/11/2026**.

Tài liệu này ghi rõ quy tắc đang có hiệu lực và quy tắc chỉ áp dụng từ ngày 01/12/2026. Khi văn bản thay đổi, cần tạo phiên bản chính sách mới; không sửa hồi tố dữ liệu lịch sử.

## Nguồn chính thức

| Văn bản | Hiệu lực liên quan | Phạm vi trong lab |
|---|---:|---|
| [Thông tư 27/2020/TT-BGDĐT](https://vanban.chinhphu.vn/?docid=201006&pageid=27160) | 20/10/2020 | Đánh giá học sinh tiểu học |
| [Thông tư 22/2021/TT-BGDĐT](https://vanban.chinhphu.vn/?docid=203926&pageid=27160) | 05/09/2021 | Đánh giá học sinh THCS và THPT |
| [Nghị định 88/2026/NĐ-CP](https://vanban.chinhphu.vn/?classid=1&docid=217356&pageid=27160) | 15/05/2026 | Quản lý dữ liệu giáo dục và CSDL quốc gia |
| [Thông tư 70/2026/TT-BGDĐT](https://vanban.chinhphu.vn/?docid=219275&orggroupid=4&pageid=27160) | 08/10/2026 | Tạo lập, kiểm tra, ký, phát hành, lưu trữ và lưu vết Học bạ số |
| [Thông tư 04/2022/TT-BLĐTBXH](https://vanban.chinhphu.vn/?docid=205592&pageid=27160) | Đến hết 09/11/2026 | Đào tạo, thi và tính điểm trung cấp/cao đẳng nghề |
| [Thông tư 79/2026/TT-BGDĐT](https://vanban.chinhphu.vn/?docid=219646&orggroupid=4&pageid=27160) | 10/11/2026 | Quy chế đào tạo mới trong giáo dục nghề nghiệp; thay thế Thông tư 04/2022 |
| [Thông tư 89/2026/TT-BGDĐT](https://vanban.chinhphu.vn/?docid=220070&pageid=27160&typegroupid=6) | 01/12/2026 | Sửa đổi quy định đánh giá và đồng bộ với Học bạ số |

Workflow của lab chỉ dựa trên văn bản Việt Nam trong bảng trên. Hue-S được mô phỏng như lớp đồng bộ phụ trợ tại Huế, không phải nguồn ghi điểm có thẩm quyền và không ghi ngược vào nguồn trường.

## Hồ sơ `current-2026-11-08`

### Tiểu học

| Quy tắc | Triển khai trong lab |
|---|---|
| Đánh giá môn học theo Hoàn thành tốt/Hoàn thành/Chưa hoàn thành | Lưu `T/H/C`, không quy đổi thành điểm trung bình chung |
| Bài kiểm tra định kỳ dùng thang 10, không có điểm thập phân | `primary-integer`, `score-range` |
| Phải có kết quả định kỳ theo phạm vi môn/lớp | `periodic-required` |
| Hồ sơ phải thống nhất giữa nguồn nghiệp vụ và dữ liệu phát hành | `national-mismatch`, `hue-mismatch` |

### THCS và THPT

| Quy tắc | Triển khai trong lab |
|---|---|
| Điểm thường xuyên theo số tiết: 2/3/4 | `regular-count` cho 35/70/trên 70 tiết |
| Mỗi học kỳ có một giữa kỳ và một cuối kỳ | `periodic-required` |
| Điểm thang 10, tối đa một chữ số thập phân | `score-range` |
| Điểm trung bình học kỳ | `(tổng ĐĐGtx + 2×ĐĐGgk + 3×ĐĐGck)/(số ĐĐGtx + 5)` |
| Điểm trung bình cả năm | `(ĐTBhkI + 2×ĐTBhkII)/3` |
| Điểm đánh giá lại phải có điều kiện và hồ sơ | `retake-approval`, `retake-eligibility` |

### Trung cấp và cao đẳng nghề

Tại ngày rà soát 08/11/2026, Thông tư 04/2022 vẫn có hiệu lực. Từ 10/11/2026, Thông tư 79/2026 có hiệu lực và thay thế Thông tư 04/2022.

| Quy tắc | Triển khai trong lab |
|---|---|
| Điều kiện dự thi gồm tham dự ít nhất 80% và điểm trung bình kiểm tra từ 5,0 | `vocational-exam-eligibility`; không tự cấp ngoại lệ |
| Điểm môn/mô-đun = 0,4 × trung bình kiểm tra + 0,6 × thi kết thúc | `vocational-formula` |
| Dùng thang 10, làm tròn một chữ số thập phân | `score-range` và hàm tính riêng |

Không dùng công thức học kỳ/cả năm của Thông tư 22 cho hồ sơ giáo dục nghề nghiệp.

### Học bạ số và phát hành

| Quy tắc | Triển khai trong lab |
|---|---|
| Dữ liệu phải được kiểm tra, đối chiếu và xác thực | Chạy audit và chuyển trạng thái `reviewed` |
| Chỉ phát hành sau khi ký số hợp lệ | Mô phỏng `locked → published` |
| Mọi hoạt động phải lưu vết | Audit log chỉ thêm mới trong phiên làm việc |
| Không sửa trực tiếp bản đã phát hành | `published → withdrawn → reviewed` |
| Truyền thông kết quả theo trạng thái | Chỉ mở thông báo/tra cứu mô phỏng khi lô ở trạng thái `published` |

## Hồ sơ `effective-2026-12-01`

Hồ sơ này áp dụng Thông tư 79/2026 cho giáo dục nghề nghiệp từ 10/11/2026, giữ nguyên phép tính phổ thông và bổ sung hướng dẫn từ Thông tư 89/2026. Lab hiện không mô phỏng phòng thi hoặc sự cố hạ tầng; hồ sơ tương lai chỉ thay đổi phần giải thích chính sách, không giả tạo chức năng ngoài MVP.

## Phân loại issue

| Mức | Ý nghĩa | Ảnh hưởng workflow |
|---|---|---|
| `critical` | Có thể làm sai kết quả chính thức hoặc vi phạm điều kiện bắt buộc | Chặn khóa và phát hành |
| `warning` | Cần đối soát hoặc đồng bộ, nhưng không tự động kết luận dữ liệu nguồn sai | Hiển thị cảnh báo; không tự sửa |

Phổ điểm chỉ là tín hiệu để kiểm tra. Lab không dùng phân phối điểm để tự động kết luận gian lận hoặc tự thay đổi kết quả học sinh.
