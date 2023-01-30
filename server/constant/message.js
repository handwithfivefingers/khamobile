const MESSAGE = {
	CREATED: () => `Tạo mới thành công`,
	UPDATED: () => `Cập nhật thành công`,
	DELETED: () => `Xóa thành công`,
	FETCHED: () => `Lấy danh sách thành công`,
	EXIST: (name) => `${name} đã tồn tại, vui lòng thử lại`,
	RESULT_NOT_FOUND: () => `Không tìm thấy, vui lòng thử lại sau`,
	ERROR: () => `Something went wrong`,
	ERROR_ADMIN: (name) => ` 'Tạo mới ${name} không thành công, vui lòng liên hệ admin'`,
	SYSTEM_ERROR: () => `System processing error, please try again`,
};

export { MESSAGE };
