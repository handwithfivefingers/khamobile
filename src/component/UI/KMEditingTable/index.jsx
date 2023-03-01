import clsx from 'clsx'
import React, { Children, useMemo, useState, memo } from 'react'
import { BsDashLg, BsPlusLg } from 'react-icons/bs'
import { Table, Button, Input, IconButton } from 'rsuite'
import { KMInput } from '../Content/KMInput'
import { isEqual } from 'lodash'
import styles from './styles.module.scss'

const CustomTable = ({ data, bordered, ...props }) => {
  const renderChildren = (row, rowIndex) => {
    if (props.children) {
      return Children.map(props.children, (child) => {
        return React.cloneElement(child, { ...child.props, rowData: row, rowIndex }, row[child.props?.['dataIndex']])
      })
    }
    return <CustomTable.Column {...row} rowIndex={rowIndex} />
  }
  const classTable = clsx('table border rounded', {
    ['table-bordered']: bordered,
  })

  const renderFooter = () => {
    let html = null

    html = props?.footer?.()
    return html
  }

  return (
    <table className={classTable}>
      <tbody>
        {data?.map((row, index) => {
          return <tr key={index}>{renderChildren(row, index)}</tr>
        })}
      </tbody>
      <tfoot>{props.footer ? renderFooter() : ''}</tfoot>
    </table>
  )
}

function isEqualColumn(prevProps, nextProps) {
  const isEqualProps = isEqual(prevProps.children, nextProps.children)
  // console.log('isEqualProps', isEqualProps, prevProps, nextProps)
  return isEqualProps
}

const Column = memo((props) => {
  const { render, rowData, dataIndex, rowIndex, width } = props
  return (
    <td style={{ width: width }}>
      <span>{render ? render(rowData, rowData[dataIndex], rowIndex) : props.children}</span>
    </td>
  )
}, isEqualColumn)

CustomTable.Column = Column

export default function KMEditingTable({ data, ...props }) {
  const [tableData, setTableData] = useState(data)

  const addNewField = () => {
    setTableData((prev) => {
      return prev.concat({ key: '', value: '' })
    })
  }

  const handleChange = (value, dataKey, position) => {
    const next = [...tableData]
    next[position][dataKey] = value
    setTableData(next)
    if (props.onChange) {
      props.onChange(next)
    }
  }

  const handleRemoveIndex = (value, index) => {
    setTableData((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      return next
    })
  }

  return (
    <CustomTable
      data={tableData}
      bordered
      footer={() => {
        return (
          <div className="d-flex justify-content-center">
            <IconButton
              icon={<BsPlusLg />}
              appearance="primary"
              ripple
              style={{ background: 'var(--rs-blue-500)', color: '#fff' }}
              size="sm"
              className="my-2"
              onClick={addNewField}
            />
          </div>
        )
      }}
    >
      <CustomTable.Column
        dataIndex="key"
        render={(rowData, rowValue, index) => (
          <KMInput
            value={rowValue}
            key={index}
            onChange={(e) => handleChange(e, 'key', index)}
            placeHolder="Tên thuộc tính"
          />
        )}
      />
      <CustomTable.Column
        dataIndex="value"
        render={(rowData, rowValue, index) => (
          <KMInput
            value={rowValue}
            key={index}
            onChange={(e) => handleChange(e, 'value', index)}
            placeHolder="Giá trị"
          />
        )}
      />

      <CustomTable.Column
        dataIndex="value"
        width="50px"
        render={(rowData, rowValue, index) => (
          <IconButton
            icon={<BsDashLg />}
            onClick={() => handleRemoveIndex(rowValue, index)}
            appearance="primary"
            ripple
            style={{ background: 'var(--rs-blue-500)', color: '#fff' }}
            size="sm"
            className="my-2"
          />
        )}
      />
    </CustomTable>
  )
}
