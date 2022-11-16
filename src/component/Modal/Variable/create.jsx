import React, { useEffect, useState } from "react";

import MinusIcon from "@rsuite/icons/Minus";
import PlusIcon from "@rsuite/icons/Plus";
import CardBlock from "component/UI/Content/CardBlock";
import Select from "component/UI/Content/MutiSelect";
import CustomUpload from "component/UI/CustomUpload";
import Textarea from "component/UI/Editor";
import JsonViewer from "component/UI/JsonViewer";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Content,
  FlexboxGrid,
  Form,
  IconButton,
  Input,
  InputNumber,
} from "rsuite";
import { TEXT } from "src/constant/text.constant";

const Cell = ({ children, style, ...rest }) => (
  <td
    style={{ padding: "2px 4px 2px 0", verticalAlign: "top", ...style }}
    {...rest}
  >
    {children}
  </td>
);

const VariableItem = ({ rowValue = {}, onChange, rowIndex }) => {
  const handleChange = (value, name) =>
    onChange(rowIndex, { ...rowValue, [name]: value });

  return (
    <FlexboxGrid.Item>
      <Cell>
        <Input
          value={rowValue.color}
          onChange={(value) => handleChange(value, "color")}
        />
      </Cell>
    </FlexboxGrid.Item>
  );
};

const OptionsControlInput = ({ value, onChange, ...props }) => {
  const [products, setProducts] = React.useState(value);

  const handleChangeProducts = (nextProducts) => {
    setProducts(nextProducts);
    onChange(nextProducts);
  };
  const handleInputChange = (rowIndex, value) => {
    const nextProducts = [...products];
    nextProducts[rowIndex] = value;
    handleChangeProducts(nextProducts);
  };

  const handleMinus = () => {
    handleChangeProducts(products.slice(0, -1));
  };

  const handleAdd = () => {
    handleChangeProducts(products.concat([{ color: "" }]));
  };

  return (
    <>
      <FlexboxGrid>
        <FlexboxGrid.Item>
          <Cell>{props.label}</Cell>
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <FlexboxGrid>
        {products?.map((rowValue, index) => {
          return (
            <VariableItem
              key={index}
              rowIndex={index}
              rowValue={rowValue}
              onChange={handleInputChange}
            />
          );
        })}
      </FlexboxGrid>

      <Cell colSpan={2} style={{ paddingTop: 10 }}>
        <ButtonGroup size="xs">
          <IconButton onClick={handleAdd} icon={<PlusIcon />} />
          <IconButton onClick={handleMinus} icon={<MinusIcon />} />
        </ButtonGroup>
      </Cell>
    </>
  );
};

const VariableModal = (props) => {
  const [form, setForm] = useState({
    groupVariable: [],
  });

  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>

      <JsonViewer data={form} />

      <Content className={" p-4"}>
        <Form
          formValue={form}
          onChange={(formVal) => setForm(formVal)}
          className={"row "}
          fluid
        >
          <div className="col-12 bg-w rounded">
            <CardBlock>
              <Form.Group controlId="variable">
                <Form.ControlLabel>
                  Biến thể: {TEXT[props.variableKey]}
                </Form.ControlLabel>
                <Form.Control
                  name={"groupVariable"}
                  accepter={OptionsControlInput}
                  label={TEXT[props.variableKey]}
                />
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <Form.Group>
                <ButtonToolbar>
                  <Button
                    appearance="primary"
                    onClick={() => props?.onSubmit(form)}
                  >
                    Tạo
                  </Button>
                </ButtonToolbar>
              </Form.Group>
            </CardBlock>
          </div>
        </Form>
      </Content>
    </>
  );
};

export default VariableModal;
