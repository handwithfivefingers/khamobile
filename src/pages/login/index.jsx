import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import CardPost from 'component/UI/Content/CardPost'
import { KMInput, KMInputPassword } from 'component/UI/Content/KMInput'
import PageHeader from 'component/UI/Content/PageHeader'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useRef } from 'react'
import { Button, Form, Pagination, Schema } from 'rsuite'
import AuthenticateService from 'service/authenticate/Authenticate.service'
import styles from './styles.module.scss'
export default function LoginPage() {
  
  const router = useRouter()

  const formRef = useRef()

  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const handleSubmit = async () => {
    if (!formRef.current.check()) {
      console.error('Form Error')
      return
    }

    try {
      const resp = await AuthenticateService.login(form)
      if (resp.status === 200) {
        router.push('/admin')
      }
    } catch (error) {
      console.log('handleSubmit', error)
    }
  }

  const model = Schema.Model({
    username: Schema.Types.StringType()
      .isRequired('Tên tài khoản là bắt buộc')
      .minLength(3, 'Tên tài khoản thấp hơn 3 kí tự'),
    password: Schema.Types.StringType().isRequired('Mật khẩu là bắt buộc').minLength(8, 'Mật khẩu thấp hơn 8 kí tự'),
  })

  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Đăng nhập
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <div className="row gy-4">
            <div className={clsx(styles.loginForm)}>
              <Form formValue={form} ref={formRef} model={model} onChange={(val) => setForm({ ...val })}>
                <CardBlock>
                  <KMInput name="username" label="Tên đăng nhập" />

                  <KMInputPassword name="password" label="Password" />

                  <Button style={{ backgroundColor: 'var(--rs-blue-800)', color: '#fff' }} onClick={handleSubmit}>
                    Submit
                  </Button>
                </CardBlock>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
