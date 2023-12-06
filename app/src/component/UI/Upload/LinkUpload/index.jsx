import { TagInput } from 'rsuite'

const UploadLink = (props) => {
  return (
    <TagInput
      trigger={['Enter', 'Space', 'Comma']}
      placeholder="Enter, Space, Comma"
      style={{ width: 300 }}
      menuStyle={{ width: 300 }}
      onCreate={(value, item) => props.onChange(value, item)}
      {...props}
    />
  )
}
export default UploadLink
