# Assessment Data Integrity Lab

## Mục tiêu

Showcase mô phỏng cách cán bộ khảo thí xử lý một tập điểm lớn sau khi nhận dữ liệu từ các đơn vị. Giao diện chỉ tập trung vào vận hành dữ liệu, không mô phỏng công tác lập kế hoạch, coi thi, chấm thi hoặc truyền thông kỳ thi.

Luồng xử lý gồm sáu bước:

1. **Tiếp nhận tập điểm:** gắn mã lô, giữ bản gốc và kiểm đếm dữ liệu nhận được.
2. **Chuẩn hóa và kiểm kê:** chuẩn hóa định danh, lớp, môn, kiểu dữ liệu và cấu trúc cột.
3. **Kiểm tra toàn bộ dữ liệu:** chạy quy tắc theo cấp học trên toàn bộ tập điểm.
4. **Xử lý hàng đợi ngoại lệ:** chỉ chuyển các hồ sơ có vấn đề để cán bộ đối chiếu và xử lý.
5. **Đối soát và lập báo cáo:** kiểm tra phổ điểm, tỷ lệ sạch và sai lệch giữa các hệ thống.
6. **Khóa và công bố:** chỉ cho phép khóa khi không còn lỗi chặn; mọi thao tác đều được lưu vết.

## Dữ liệu mô phỏng

- Lô phổ thông: 2.000 học sinh gồm 800 Tiểu học, 700 THCS và 500 THPT.
- Lô giáo dục nghề nghiệp: 200 hồ sơ riêng, không trộn công thức với phổ thông.
- Hai trạng thái đầu vào: lô có lỗi nghiệp vụ và lô đã đối soát.
- Không sử dụng dữ liệu học sinh thật và không gửi dữ liệu ra ngoài.

Với lô phổ thông có lỗi, tập dữ liệu xác định tạo ra:

| Cấp học | Tiếp nhận | Critical | Warning | Hồ sơ bị ảnh hưởng | Hồ sơ sạch |
|---|---:|---:|---:|---:|---:|
| Tiểu học | 800 | 9 | 5 | 10 | 790 |
| THCS | 700 | 24 | 10 | 24 | 676 |
| THPT | 500 | 18 | 8 | 18 | 482 |
| **Tổng lô** | **2.000** | **51** | **23** | **52** | **1.948** |

Trước khi chạy kiểm tra, hệ thống cho thấy 1.999/2.000 mã học sinh duy nhất và 9.981/10.000 ô điểm đã nhận. Khoảng thiếu này là tín hiệu kiểm kê, không được tự động điền hoặc suy đoán.

## Nguyên tắc vận hành

- Dữ liệu gốc được giữ nguyên để truy vết.
- Toàn bộ lô được kiểm tra, nhưng cán bộ chỉ xử lý các ngoại lệ.
- Chỉ sửa dữ liệu khi có chứng từ mô phỏng đã xác minh.
- Lỗi critical chặn khóa và công bố.
- Hue-S là lớp đối soát/phụ trợ, không ghi ngược vào nguồn dữ liệu chính.
- Bản đã công bố muốn sửa phải đi qua thu hồi và tạo lại; nhật ký cũ vẫn được giữ.

## Kiến trúc

| File | Trách nhiệm |
|---|---|
| `syntheticData.ts` | Sinh dữ liệu xác định cho các lô sạch và có lỗi |
| `auditEngine.ts` | Kiểm tra, thống kê và xử lý lỗi có chứng từ |
| `auditEngine.test.ts` | Kiểm thử độc lập bộ quy tắc |
| `AssessmentIntegrityLab.tsx` | Vòng đời lô, bảng lỗi, đối soát và nhật ký |
| `WorkflowExplorer.tsx` | Luồng sáu bước và số liệu theo từng giai đoạn |
| `policy.ts` | Nhãn cấp học và quy tắc nghiệp vụ được engine sử dụng |

Engine không phụ thuộc React. Giao diện chỉ giữ trạng thái trong bộ nhớ trình duyệt; không có backend, tài khoản, dữ liệu thật hoặc quyết định tự động bằng AI.

## Kiểm tra

```bash
npm run test:assessment
npm run lint
npm run build
```

Đường dẫn: `/showcase/assessment-data-integrity-lab`.
