# Cấu hình Google Gemini API

## Bước 1: Lấy API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google
3. Click "Create API Key"
4. Copy API key được tạo ra

## Bước 2: Cấu hình trong dự án

1. Tạo file `.env` trong thư mục gốc của dự án
2. Thêm dòng sau vào file `.env`:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Thay `your_gemini_api_key_here` bằng API key thực tế của bạn.

## Bước 3: Restart development server

```bash
npm run dev
```

## Tính năng AI

- **Giải nghĩa thông minh**: Sử dụng Gemini để phân tích lá bài
- **Fallback**: Nếu API không hoạt động, sẽ sử dụng giải nghĩa mẫu
- **Loading state**: Hiển thị trạng thái đang xử lý
- **Error handling**: Xử lý lỗi và thông báo cho người dùng

## Lưu ý bảo mật

- Không commit file `.env` lên Git
- API key sẽ được sử dụng ở client-side (Vite sẽ inject vào build)
- Để bảo mật hơn, nên tạo proxy server để ẩn API key

## Troubleshooting

### Lỗi "GEMINI_API_KEY is not configured"
- Kiểm tra file `.env` có tồn tại không
- Kiểm tra tên biến có đúng `VITE_GEMINI_API_KEY` không
- Restart development server

### Lỗi "Gemini API error: 403"
- Kiểm tra API key có đúng không
- Kiểm tra API key có quyền truy cập Gemini không
- Kiểm tra quota của API key

### Lỗi "No response from Gemini API"
- Kiểm tra kết nối internet
- Thử lại sau vài phút
- Kiểm tra status của Google AI Studio 