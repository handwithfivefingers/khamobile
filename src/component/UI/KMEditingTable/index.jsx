import React from 'react'
import { Table, Button, Input } from 'rsuite'
// const { Column, HeaderCell, Cell } = Table

// const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
//   const editing = rowData.status === 'EDIT'
//   return (
//     <Cell {...props} className={editing ? 'table-content-editing' : ''}>
//       <input
//         className="rs-input"
//         defaultValue={rowData[dataKey]}
//         onChange={(event) => {
//           onChange && onChange(rowData.id, dataKey, event.target.value)
//         }}
//       />
//     </Cell>
//   )
// }

// const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
//   return (
//     <Cell {...props} style={{ padding: '6px' }}>
//       <Button
//         appearance="link"
//         onClick={() => {
//           onClick(rowData.id)
//         }}
//       >
//         {rowData.status === 'EDIT' ? 'Save' : 'Edit'}
//       </Button>
//     </Cell>
//   )
// }

const CustomTable = ({ data, ...props }) => {
  const renderChildren = (row) => {
    console.log(props.children, row)
    if (props.children) {
      // return React.cloneElement(props.children, row)
      return React.Children.map(children, (child) => {
        return React.cloneElement(child, row)
      })
    }
    return <CustomTable.Column {...row} />
  }
  return (
    <table>
      <tbody>
        {/* {props.children} */}
        {data?.map((row) => {
          return <tr>{renderChildren(row)}</tr>
        })}
      </tbody>
    </table>
  )
}

const Column = ({ dataIndex, render, ...props }) => {
  return <td>{render ? render : props.children}</td>
}

CustomTable.Column = Column

export default function KMEditingTable() {
  const [data, setData] = React.useState([{ key: 'status', value: 'hello' }])

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], data)
    nextData.find((item) => item.id === id)[key] = value
    setData(nextData)
  }

  // const handleEditState = (id) => {
  //   const nextData = Object.assign([], data)
  //   const activeItem = nextData.find((item) => item.id === id)
  //   activeItem.status = activeItem.status ? null : 'EDIT'
  //   setData(nextData)
  // }

  return (
    // <Table height={420} data={data} showHeader bordered>
    //   <Column width={200}>
    //     <HeaderCell>Tên </HeaderCell>
    //     <EditableCell dataKey="key" onChange={handleChange} />
    //   </Column>

    //   <Column width={200}>
    //     <HeaderCell>Thông số</HeaderCell>
    //     <EditableCell dataKey="value" onChange={handleChange} />
    //   </Column>
    // </Table>
    // <table>
    //   <tbody>
    //     <tr>
    //       <td>
    //         <input
    //           className="rs-input"
    //           // defaultValue={rowData[dataKey]}
    //           // onChange={(event) => {
    //           //   onChange && onChange(rowData.id, dataKey, event.target.value)
    //           // }}
    //         />
    //       </td>
    //       <td>
    //         <input
    //           className="rs-input"
    //           // defaultValue={rowData[dataKey]}
    //           // onChange={(event) => {
    //           //   onChange && onChange(rowData.id, dataKey, event.target.value)
    //           // }}
    //         />
    //       </td>
    //     </tr>
    //   </tbody>
    // </table>
    <CustomTable data={data}>
      <CustomTable.Column dataIndex="key" />
      <CustomTable.Column dataIndex="value" />
    </CustomTable>
  )
}
