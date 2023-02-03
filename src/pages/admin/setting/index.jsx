import AdminLayout from 'component/UI/AdminLayout'
import { useEffect } from 'react'
import { Table } from 'rsuite'
import { useCommonStore } from 'src/store/commonStore'
// import { mockUsers } from './mock';

const { Column, HeaderCell, Cell } = Table

// const data = mockUsers(20);

const Setting = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  useEffect(() => {
    changeTitle('Page Setting')
  }, [])
  return <> Setting page</>
}

Setting.Admin = AdminLayout

export default Setting
