const MESSAGE = {
	CREATED: () => `Tạo mới thành công`,
	UPDATED: () => `Cập nhật thành công`,
	DELETED: () => `Xóa thành công`,
    RESULT_NOT_FOUND: () => `Không tìm thấy, vui lòng thử lại sau`,
	ERROR: () => `Something went wrong`,
	ERROR_ADMIN: (name) => ` 'Tạo mới ${name} không thành công, vui lòng liên hệ admin'`,
	SYSTEM_ERROR: () => `Processing error`,
};

export { MESSAGE };
