import { useState } from 'react'
import { TagGroup, Tag, Input, IconButton, Button } from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
const VariableModal = ({ data, ...props }) => {
  const [tags, setTags] = useState(data)
  const [typing, setTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const removeTag = (tag) => {
    const nextTags = tags.map((item) => ({ ...item, delete: tag?.name === item.name ? 1 : 0 }))
    setTags(nextTags)
  }

  const addTag = () => {
    const nextTags = inputValue ? [...tags, { name: inputValue, parentId: props?.parentId }] : tags
    setTags(nextTags)
    setTyping(false)
    setInputValue('')
  }

  const handleButtonClick = () => {
    setTyping(true)
  }

  const renderInput = () => {
    if (typing) {
      return (
        <Input
          className="tag-input "
          size="xs"
          style={{ width: 70 }}
          value={inputValue}
          onChange={setInputValue}
          onBlur={addTag}
          onPressEnter={addTag}
        />
      )
    }

    return (
      <IconButton
        className="tag-add-btn"
        onClick={handleButtonClick}
        icon={<PlusIcon />}
        appearance="ghost"
        size="xs"
      />
    )
  }

  return (
    <div className="container-md p-2">
      <TagGroup className="d-flex flex-row justify-content-start align-items-center flex-wrap">
        {tags.map(
          ({ name, _id, delete: deleteFlag }, index) =>
            !deleteFlag && (
              <Tag
                key={index}
                closable
                onClose={() => removeTag({ name, _id })}
                className="m-2"
                color={(_id && 'blue') || 'green'}
              >
                {name}
              </Tag>
            ),
        )}
        <div className="m-2">{renderInput()}</div>
      </TagGroup>
      <div className="d-flex justify-content-end">
        <Button appearance="primary" onClick={() => props?.handleSubmit(tags, props.parentId)}>
          Lưu
        </Button>
      </div>
    </div>
  )
}

export default VariableModal
