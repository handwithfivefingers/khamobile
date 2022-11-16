import ProductCreateModal from "component/Modal/Product/create";
import AdminLayout from "component/UI/AdminLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Content, Table, Button, Modal } from "rsuite";
import ProductService from "service/admin/Product.service";
import { useCommonStore } from "src/store/commonStore";

const { Column, HeaderCell, Cell } = Table;

const Products = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle);

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    component: null,
  });
  useEffect(() => {
    changeTitle("Page Products");
    getProducts();
  }, []);

  const handleClose = () => setModal({ open: false, component: null });

  const getProducts = async () => {
    try {
      const resp = await ProductService.getProduct();
      setProduct(resp.data.data);
    } catch (error) {
      console.log("getProducts error: " + error);
    }
  };

  const onUpdate = async (formValue) => {
    try {
      const form = new FormData();
      for (let key in formValue) {
        if (key === "img") {
          for (let img of formValue[key]) {
            if (img.src && typeof img.src === "string") {
              form.append(key, img.src);
            } else if (img?.blobFile && img?.blobFile instanceof Blob) {
              form.append(key, img?.blobFile);
            }
          }
        } else if (key === "variable") {
          form.append(key, JSON.stringify(formValue?.[key]));
        } else form.append(key, formValue?.[key]);
      }

      await ProductService.updateProduct(formValue._id, form);
    } catch (error) {
      console.log("onUpdate error", error);
    }
  };

  const onCreate = async (formValue) => {
    try {
      const form = new FormData();
      for (let key in formValue) {
        if (key === "img") {
          for (let img of formValue[key]) {
            if (img.src && typeof img.src === "string") {
              form.append(key, img.src);
            } else if (img?.blobFile && img?.blobFile instanceof Blob) {
              form.append(key, img?.blobFile);
            }
          }
        } else if (key === "variable") {
          form.append(key, JSON.stringify(formValue?.[key]));
        } else form.append(key, formValue?.[key]);
      }

      await ProductService.createProduct(form);
    } catch (error) {
      console.log("onCreate error", error);
    }
  };
  return (
    <>
      <Content className={"bg-w"}>
        <Button
          onClick={() =>
            setModal({
              open: true,
              component: <ProductCreateModal onSubmit={onCreate} />,
            })
          }
        >
          Add
        </Button>
        <Table
          height={400}
          data={product}
          onRowClick={(rowData) =>
            setModal({
              open: true,
              component: (
                <ProductCreateModal data={rowData} onSubmit={onUpdate} />
              ),
            })
          }
        >
          <Column width={60} align="center" fixed>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="_id" />
          </Column>

          <Column width={150}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="title" />
          </Column>

          <Column width={150}>
            <HeaderCell>Content</HeaderCell>
            <Cell dataKey="content" />
          </Column>

          <Column width={100}>
            <HeaderCell>Price</HeaderCell>
            <Cell dataKey="price" />
          </Column>
        </Table>
      </Content>

      <Modal
        size={"full"}
        open={modal.open}
        onClose={handleClose}
        keyboard={false}
        backdrop={"static"}
      >
        <Modal.Header>
          <Modal.Title>Create</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal?.component}</Modal.Body>
      </Modal>
    </>
  );
};
Products.Admin = AdminLayout;

export default Products;
