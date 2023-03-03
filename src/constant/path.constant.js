const PATH_ROUTER = {
  '/admin': {
    name: 'Admin',
    child: {
      '/pages': 'Trang',
      '/posts': 'Danh sách bài viết',
      '/posts/category': 'Danh mục bài viết',
      '/product': 'Danh sách sản phẩm',
      '/product/category': 'Danh mục sản phẩm',
      '/product/attribute': 'Thuộc tính sản phẩm',
      '/file-manager': 'Quản lý file',
      '/setting/menu': 'Tùy chỉnh Menu',
      '/setting/email': 'Tùy chỉnh email',
    },
  },
}

export { PATH_ROUTER }
