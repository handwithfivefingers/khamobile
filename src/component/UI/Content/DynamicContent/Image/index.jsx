import { useState } from 'react'
import { BsDashLg } from 'react-icons/bs'
import { Button, Form, IconButton, SelectPicker, Stack } from 'rsuite'
import { KMInput } from '../../KMInput'
import styles from './styles.module.scss'

export default function DynamicImageComponentInput({ data, sectionName, onSubmit, max = false }) {
  const { pageData, setPageData } = data
  const currentSection = pageData[sectionName]

  const [sectionData, setSectionData] = useState(currentSection)

  const handleAdd = () => {
    const nextState = { ...sectionData }
    nextState.data.push('')
    setSectionData(nextState)
  }
  const handleRemove = (index) => {
    const nextState = { ...sectionData }
    nextState.data.splice(index, 1)
    setSectionData(nextState)
  }

  const handleInputchange = (value, index) =>
    setSectionData((prev) => {
      let current = [...prev]
      current[index] = value
      return current
    })

  const handleSubmit = () => {
    onSubmit(sectionName, sectionData)
  }

  return (
    <Form formValue={sectionData}>
      <div className="row gx-2 gy-2">
        <div className="col-12">
          <Stack spacing={12}>
            {max ? (
              sectionData?.data?.length < currentSection.max && (
                <Button onClick={handleAdd} appearance="default" color="primary">
                  Thêm
                </Button>
              )
            ) : (
              <Button onClick={handleAdd} appearance="default" color="primary">
                Thêm
              </Button>
            )}

            {max && <code>Số lượng hình ảnh tối đa {currentSection.max}</code>}
          </Stack>
        </div>
        {sectionData?.data?.map((item, index) => {
          return (
            <div className="col-6 ">
              <div className={styles.col}>
                <KMInput
                  name={[sectionName, index].join('')}
                  label={`Hình ảnh ${index + 1}`}
                  onChange={(value) => handleInputchange(value, index)}
                  value={item}
                />
                <div className="d-flex" style={{ maxWidth: '100%', objectFit: 'contain' }}>
                  <img src={process.env.API + item} style={{ objectFit: 'contain' }} width="100px" height="100px" />
                </div>
                <div className={styles.icon}>
                  <IconButton icon={<BsDashLg />} onClick={() => handleRemove(index)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="d-flex justify-content-end">
        <Button appearance="primary" onClick={handleSubmit}>
          Save Section
        </Button>
      </div>
    </Form>
  )
}
